import express from 'express';
import { columnValidation } from '~/validations/columnValidation';
import { columnController } from '~/controllers/columnController';

const Router = express.Router();

Router.route('/')
  .post(columnValidation.createColumn, columnController.createColumn)
  .put(columnValidation.putColumnCardOrderIds, columnController.putColumnCardOrderIds)
  .delete(columnValidation.deleteColumnCardOrderIds, columnController.deleteColumnCardOrderIds);

export const columnRoute = Router;