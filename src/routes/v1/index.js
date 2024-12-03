import express from 'express';
import { boardRoute } from './boardRoute';

const Router = express.Router();

Router.use('/boards', boardRoute);

export const APIs_V1 = Router;