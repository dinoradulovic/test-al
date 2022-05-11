import express from "express";
const router = express.Router();

import PasswordResetController from "../controllers/password-resets-controller";

router.post('/', PasswordResetController.post);

export default router;
