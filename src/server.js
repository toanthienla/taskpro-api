/* eslint-disable no-console */
import express from 'express';
import { CONNECT_DB, CLOSE_DB } from '~/config/mongodb';
import exitHook from 'async-exit-hook';
import env from '~/config/enviroment.js';
import { APIs_V1 } from '~/routes/v1/index.js';
import errorHandlingMiddleware from '~/middlewares/errorHandlingMiddleware';
import cors from 'cors';
import { corsOptions } from '~/config/cors';

const app = express();

const hostname = env.APP_HOST;
const port = env.APP_PORT;

const START_SERVER = () => {

  // CORS domain whitelist
  app.use(cors(corsOptions));

  // Enable req.body json data
  app.use(express.json());

  // Use APIv1 routes
  app.use('/v1', APIs_V1);

  // Express error hadling
  app.use(errorHandlingMiddleware);

  if (env.BUILD_MODE === 'production') {
    // Config in Render.com deploy
    app.listen(process.env.PORT, () => {
      console.log(`Production mode: TaskPro is running at http://${hostname}:${port}/`);
    });
  } else {
    app.listen(port, hostname, () => {
      console.log(`Dev mode: TaskPro is running at http://${hostname}:${port}/`);
    });
  }

  exitHook(() => {
    console.log('Clean Mongodb');
    CLOSE_DB();
  });
};

// An IIFE (Immediately Invoked Function Expression)
(async () => {
  try {
    await CONNECT_DB();
    START_SERVER();
  } catch (error) {
    console.error(error);
    process.exit(0);
  }
})();
