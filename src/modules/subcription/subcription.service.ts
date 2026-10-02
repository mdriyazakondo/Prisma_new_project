import Stripe from "stripe";
import config from "../../config";
import { prisma } from "../../lib/prisma";
import { stripe } from "../../utils/stripe";

const createCheckoutSession = async (userId: string) => {
  const transactionResult = await prisma.$transaction(async (tx) => {
    const user = await tx.user.findUnique({
      where: { id: userId },
      include: { Subcription: true },
    });
    //old subcriptionService code
    let stripeCustomerId = user?.Subcription?.stripeCustomerId;

    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        name: user?.name,
        email: user?.email,
        metadata: {
          userId: user?.id!,
        },
      });
      stripeCustomerId = customer.id;
    }

    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: config.stripe_price_id,
          quantity: 1,
        },
      ],
      mode: "subscription",
      customer: stripeCustomerId,
      allowed_payment_method_types: ["card"],
      success_url: `${config.app_url}/premium?success=true`,
      cancel_url: `${config.app_url}/payment?success=false`,
      metadata: {
        userId: user?.id as string,
      },
    });

    return session.url;
  });

  return { paymentUrl: transactionResult };
};

const stripeWebhookHandler = async (payload: Buffer, signature: string) => {
  const endpointSecret = config.stripe_webhook_secret;
  const event = stripe.webhooks.constructEvent(
    payload,
    signature,
    endpointSecret,
  );
  switch (event.type) {
    case "checkout.session.completed":
      const session = event.data.object as Stripe.Checkout.Session;

      const userId = session.metadata?.userId as string;
      const stripeCustomerId = session.customer as string;
      const stripeSubcriptionId = session.subscription as string;

      if (!userId || !stripeCustomerId || !stripeSubcriptionId) {
        throw new Error("stripe webhook failed");
      }

      const stripeSubscription =
        await stripe.subscriptions.retrieve(stripeSubcriptionId);

      const currentPerieodStart =
        stripeSubscription.items.data[0]?.current_period_start;

      const currentPeriodEndMilliSecond =
        stripeSubscription.items.data[0]?.current_period_end!;

      const currentPeriodEnd = new Date(currentPeriodEndMilliSecond * 1000);

      console.log({
        userId,
        stripeCustomerId,
        stripeSubcriptionId,
        status: "ACTIVE",
        currentPeriodEnd,
      });

      await prisma.subcription.upsert({
        where: {
          userId,
        },
        create: {
          userId,
          stripeCustomerId,
          stripeSubcriptionId,
          status: "ACTIVE",
          currentPeriodEnd,
        },
        update: {
          stripeCustomerId,
          stripeSubcriptionId,
          status: "ACTIVE",
          currentPeriodEnd,
        },
      });

      break;
    case "customer.subscription.updated":
      // const paymentMethod = event.data.object;

      break;

    case "customer.subscription.deleted":
      // const payment = event.data.object;

      break;
    default:
      // Unexpected event type
      console.log(`No event matched. Unhandled event type ${event.type}.`);
      break;
  }
};

export const subcriptionService = {
  createCheckoutSession,
  stripeWebhookHandler,
};
