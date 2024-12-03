import express from 'express';
import { boardValidation } from '~/validations/boardValidation';
import { boardController } from '~/controllers/boardController';

const Router = express.Router();

Router.route('/')
  .get((req, res) => {
    res.status(200).json({ message: 'GET: boardRoutes.js' });
  })
  .post(boardValidation.createNew, boardController.createNew);

export const boardRoute = Router;