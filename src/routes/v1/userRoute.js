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

Router.route('/logout')
  .delete(userController.logout);

Router.route('/refresh_token')
  .get(userController.refreshToken);

export const userRoute = Router;