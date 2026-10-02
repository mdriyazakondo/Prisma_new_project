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

export const subcriptionService = {
  createCheckoutSession,
};
