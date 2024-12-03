/* eslint-disable no-console */
import express from 'express';
import { CONNECT_DB, CLOSE_DB } from '~/config/mongodb';
import exitHook from 'async-exit-hook';
import { env } from '~/config/enviroment.js';
import { APIs_V1 } from '~/routes/v1/index.js';

const app = express();

const hostname = env.APP_HOST;
const port = env.APP_PORT;

const START_SERVER = () => {

  // Enable req.body json data
  app.use(express.json());

  // Use APIv1 routes
  app.use('/v1', APIs_V1);

  app.listen(port, hostname, () => {
    console.log(`Hello ToanLa, I am running at http://${hostname}:${port}/`);
  });

  exitHook(() => {
    console.log('Clean Mongodb');
    CLOSE_DB();
  });
};

// An IIFE (Immediately Invoked Function Expression)
(async () => {
  try {
    // await CONNECT_DB();
    START_SERVER();
  } catch (error) {
    console.error(error);
    process.exit(0);
  }
})();
