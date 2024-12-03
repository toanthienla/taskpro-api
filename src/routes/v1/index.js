import express from 'express';
import { boardRoute } from './boardRoute';

const Router = express.Router();

Router.get('/', (req, res) => {
  res.status(200).json({ message: 'APIs V1 ready to use' });
});

Router.use('/boards', boardRoute);

export const APIs_V1 = Router;