import express from "express";
const router = express.Router();

import EmailVerificationsController from "../controllers/email-verifications-controller";

router.post('/', EmailVerificationsController.post);

export default router;
