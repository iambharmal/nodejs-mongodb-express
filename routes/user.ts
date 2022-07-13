import express from 'express';
import UserController from './../controllers/user.controller';

const router = express.Router();
const userController = new UserController;

router.get('/', userController.index);

export default router;