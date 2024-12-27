import express from 'express';
import { cardValidation } from '~/validations/cardValidation';
import { cardController } from '~/controllers/cardController';
import { authMiddleware } from '~/middlewares/authMiddleware';
import { multerMiddleware } from '~/middlewares/multerMiddleware';


const Router = express.Router();

Router.route('/')
  .post(authMiddleware.isAuthorized, cardValidation.createCard, cardController.createCard);

Router.route('/:cardId')
  .put(authMiddleware.isAuthorized, multerMiddleware.upload.single('cardCover'), cardValidation.updateCard, cardController.updateCard);

export const cardRoute = Router;