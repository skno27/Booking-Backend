import Express from "express";
import * as infoController from "../controllers/info.js";

const router = Express.Router();

router.post("/", infoController.submitInfo);
// router.patch("/", infoController.updateInfo);

export default router;
