import Express from "express";
import * as checkoutController from "../controllers/checkout.js";

const router = Express.Router();

router.post("/", checkoutController.paymentIntent);

export default router;
