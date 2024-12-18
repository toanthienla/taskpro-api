import express from 'express';
import { userValidation } from '~/validations/userValidation';
import { userController } from '~/controllers/userController';

const Router = express.Router();

Router.route('/register')
  .post(userValidation.createUser, userController.createUser);

export const userRoute = Router;