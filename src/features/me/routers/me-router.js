import express from "express";
const router = express.Router();

import MeController from "../controllers/me-controller";
import { verifyToken } from '../../global/middlewares/verify-token';

router.get('/', verifyToken, MeController.get);
router.put('/', verifyToken, MeController.put);

export default router;
