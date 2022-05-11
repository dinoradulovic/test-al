import express from "express";
const router = express.Router();

import PasswordResetRequestsController from "../controllers/password-reset-requests-controller.js";

router.post('/', PasswordResetRequestsController.post);

export default router;
