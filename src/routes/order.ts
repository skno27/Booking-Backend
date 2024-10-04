import Express from "express";
import * as orderController from "../controllers/order.js";

const router = Express.Router();

router.post("/", orderController.submitTransaction);

export default router;
