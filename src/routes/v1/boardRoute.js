import express from 'express';

const Router = express.Router();

Router.route('/')
  .get((req, res) => {
    res.status(200).json({ message: 'GET: boardRoutes.js' });
  })
  .post((req, res) => {
    res.status(201).json({ message: 'POST: boardRoutes.js' });
  });

export const boardRoute = Router;