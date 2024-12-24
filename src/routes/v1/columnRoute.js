import express from 'express';
import { columnValidation } from '~/validations/columnValidation';
import { columnController } from '~/controllers/columnController';
import { authMiddleware } from '~/middlewares/authMiddleware';

const Router = express.Router();

Router.route('/')
  .post(authMiddleware.isAuthorized, columnValidation.createColumn, columnController.createColumn)
  .put(authMiddleware.isAuthorized, columnValidation.updateColumn, columnController.updateColumn)
  .delete(authMiddleware.isAuthorized, columnValidation.deleteColumnCardOrderIds, columnController.deleteColumnCardOrderIds);

Router.route('/:columnId')
  .delete(authMiddleware.isAuthorized, columnValidation.deleteColumn, columnController.deleteColumn);

export const columnRoute = Router;