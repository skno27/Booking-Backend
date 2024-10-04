import Stripe from "stripe";
import env from "dotenv";

env.config();

const stripeAccess = process.env.STRIPE_SECRET_KEY;
const stripe = new Stripe(`${stripeAccess}`, {
  apiVersion: "2024-06-20",
});

export default stripe;
