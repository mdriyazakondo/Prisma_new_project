import type { Application, NextFunction, Request, Response } from "express";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import config from "./config";
import { userRouter } from "./modules/user/user.route";
import { globalErrorHandler } from "./middlewares/globalErrorHandler";
import { authRoute } from "./modules/auth/auth.routes";
import { postRoutes } from "./modules/post/post.route";
import { commentRoutes } from "./modules/comment/comment.route";
import { notFoundMiddleware } from "./middlewares/notFound";
import HttpStatus from "http-status";
import { subcriptionRoute } from "./modules/subcription/subcription.route";
import { stripe } from "./utils/stripe";
const app: Application = express();

const endpointSecret = config.stripe_webhook_secret;

// app.post(
//   "/api/subcription/webhook",
//   express.raw({ type: "application/json" }),
//   (request: Request, response: Response) => {
//     let event = request.body;
//     console.log(event, "request stripe body");
//     console.log("request headers", request.headers);
//     // Only verify the event if you have an endpoint secret defined.
//     // Otherwise use the basic event deserialized with JSON.parse
//     if (endpointSecret) {
//       // Get the signature sent by Stripe
//       const signature = request.headers["stripe-signature"]!;
//       try {
//         event = stripe.webhooks.constructEvent(
//           request.body,
//           signature,
//           endpointSecret,
//         );
//       } catch (err: any) {
//         console.log(`⚠️  Webhook signature verification failed.`, err.message);
//         return response
//           .status(400)
//           .json({ message: `Webhook Error: ${err.message}` });
//       }
//     }

//     console.log(event, "event after try block");
//     // Handle the event
//     switch (event.type) {
//       case "payment_intent.succeeded":
//         const paymentIntent = event.data.object;
//         console.log(
//           `PaymentIntent for ${paymentIntent.amount} was successful!`,
//         );
//         // Then define and call a method to handle the successful payment intent.
//         // handlePaymentIntentSucceeded(paymentIntent);
//         break;
//       case "payment_method.attached":
//         const paymentMethod = event.data.object;
//         // Then define and call a method to handle the successful attachment of a PaymentMethod.
//         // handlePaymentMethodAttached(paymentMethod);
//         break;
//       default:
//         // Unexpected event type
//         console.log(`Unhandled event type ${event.type}.`);
//     }

//     // Return a 200 response to acknowledge receipt of the event
//     response.send();
//   },
// );

app.use("/api/subscription/webhook", express.raw({ type: "application/json" }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: config.app_url,
    credentials: true,
  }),
);

app.get("/", async (req: Request, res: Response) => {
  res.status(200).json({ message: "hello world", success: true });
});

app.use("/api/user", userRouter);
app.use("/api/auth", authRoute);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/subcription", subcriptionRoute);

// app.use(globalErrorHandler);
app.use(notFoundMiddleware);

app.use(globalErrorHandler);

export default app;
