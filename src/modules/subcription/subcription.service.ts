import config from "../../config";
import { prisma } from "../../lib/prisma";
import { stripe } from "../../utils/stripe";
import {
  handleChangeSubscription,
  handleCheckoutCompleted,
} from "./subscription.utils";

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
      await handleCheckoutCompleted(event.data.object);

      break;

    case "customer.subscription.updated":
      // const paymentMethod = event.data.object;
      await handleChangeSubscription(event.data.object);
      break;

    // stripe subscriptions cancel sub_1UMB6bPLLTs2nCQyueypxWlu

    case "customer.subscription.deleted":
      // const payment = event.data.object;
      await handleChangeSubscription(event.data.object);
      break;
    default:
      // Unexpected event type
      console.log(`No event matched. Unhandled event type ${event.type}.`);
      break;
  }
};

const getSubscription = async (userId: string) => {
  const isSubscriptionStatus = await prisma.subcription.findUniqueOrThrow({
    where: { userId },
  });

  const isActice =
    isSubscriptionStatus.status === "ACTIVE" &&
    isSubscriptionStatus.currentPeriodEnd &&
    new Date(isSubscriptionStatus.currentPeriodEnd) > new Date();

  return {
    status: isSubscriptionStatus.status,
    isSubscribed: isActice,
    currentPeriodEnd: isSubscriptionStatus.currentPeriodEnd,
  };
};

export const subcriptionService = {
  createCheckoutSession,
  stripeWebhookHandler,
  getSubscription,
};
