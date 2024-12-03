import express from 'express';
import { boardValidation } from '~/validations/boardValidation';
import { boardController } from '~/controllers/boardController';
import { StatusCodes } from 'http-status-codes';

const Router = express.Router();

Router.route('/')
  .get((req, res) => {
    res.status(StatusCodes.OK).json({ message: 'GET: boardRoutes.js' });
  })
  .post(boardValidation.createNew, boardController.createNew);

export const boardRoute = Router;