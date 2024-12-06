import express from 'express';
import { boardRoute } from './boardRoute';
import { columnRoute } from './columnRoute';
import { cardRoute } from './cardRoute';

const Router = express.Router();

Router.use('/boards', boardRoute);
Router.use('/columns', columnRoute);
Router.use('/cards', cardRoute);

export const APIs_V1 = Router;