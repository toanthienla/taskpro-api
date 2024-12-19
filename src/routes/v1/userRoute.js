import express from 'express';
import { userValidation } from '~/validations/userValidation';
import { userController } from '~/controllers/userController';

const Router = express.Router();

Router.route('/register')
  .post(userValidation.createUser, userController.createUser);

Router.route('/validation')
  .put(userValidation.validateUser, userController.validateUser);

Router.route('/login')
  .post(userValidation.loginUser, userController.loginUser);
export const userRoute = Router;