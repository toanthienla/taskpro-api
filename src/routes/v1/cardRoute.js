import express from 'express';
import { cardValidation } from '~/validations/cardValidation';
import { cardController } from '~/controllers/cardController';

const Router = express.Router();

Router.route('/')
  .post(cardValidation.createCard, cardController.createCard);

export const cardRoute = Router;