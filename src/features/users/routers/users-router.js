import express from "express";
const router = express.Router();

import UsersController from "../controllers/users-controller";
import { verifyToken } from '../../global/middlewares/verify-token';
import { onlyAdmin } from '../../global/middlewares/access-control';

router.get('/', verifyToken, UsersController.get);
router.get('/:userId', verifyToken, onlyAdmin, UsersController.getOne);
router.put('/:userId', verifyToken, onlyAdmin, UsersController.put);
router.delete('/:userId', verifyToken, onlyAdmin, UsersController.delete);
router.post('/', UsersController.post);

router.post('/:userId/approvals', verifyToken, onlyAdmin, UsersController.postApproval);

export default router;
