import Stripe from "stripe";
import { SubcriptionStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import { stripe } from "../../utils/stripe";

export const getPeriodEndPoint = async (payload: Stripe.Subscription) => {
  const currentPeriodEndMilliSecond =
    payload.items.data[0]?.current_period_end!;

  const currentPeriodEnd = new Date(currentPeriodEndMilliSecond * 1000);

  return currentPeriodEnd;
};

export const handleCheckoutCompleted = async (
  session: Stripe.Checkout.Session,
) => {
  console.log(session, "session");
  const userId = session.metadata?.userId as string;
  const stripeCustomerId = session.customer as string;
  const stripeSubcriptionId = session.subscription as string;

  if (!userId || !stripeCustomerId || !stripeSubcriptionId) {
    console.log(`Webhook: Missing values for creating checkout session`);
    return;
  }

  const stripeSubscription =
    await stripe.subscriptions.retrieve(stripeSubcriptionId);

  const currentPerieodStart =
    stripeSubscription.items.data[0]?.current_period_start;

  const currentPeriodEnd = await getPeriodEndPoint(stripeSubscription);

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
};

export const handleChangeSubscription = async (
  payload: Stripe.Subscription,
) => {
  const stripeSubcriptionId = payload.id;
  const status =
    payload.status === "active" || payload.status === "trialing"
      ? SubcriptionStatus.ACTIVE
      : payload.status === "canceled"
        ? SubcriptionStatus.CANCELED
        : SubcriptionStatus.EXPIRED;

  const currentPeriodEnd = await getPeriodEndPoint(payload);

  const isSubscriptionExist = await prisma.subcription.findUnique({
    where: {
      stripeSubcriptionId,
    },
  });

  if (!isSubscriptionExist) {
    console.log(
      `Webhook: No subscription found for subscription: ${stripeSubcriptionId}`,
    );
    return;
  }

  await prisma.subcription.update({
    where: { stripeSubcriptionId },
    data: { status, currentPeriodEnd },
  });
};
