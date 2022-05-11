import express from "express";

const router = express.Router();
import UserSessionsController from "../controllers/user-sessions-controller";

router.post('/', UserSessionsController.post);

export default router;
