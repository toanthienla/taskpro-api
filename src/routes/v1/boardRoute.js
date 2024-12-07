import express from 'express';
import { boardValidation } from '~/validations/boardValidation';
import { boardController } from '~/controllers/boardController';

const Router = express.Router();

Router.route('/')
  .post(boardValidation.createBoard, boardController.createBoard);

Router.route('/:id')
  .get(boardController.getBoard)
  .put(boardValidation.putBoardColumnOrderIds, boardController.putBoardColumnOrderIds);

export const boardRoute = Router;