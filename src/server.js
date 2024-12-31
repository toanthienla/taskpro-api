/* eslint-disable no-console */
import express from 'express';
import { CONNECT_DB, CLOSE_DB } from '~/config/mongodb';
import exitHook from 'async-exit-hook';
import env from '~/config/enviroment.js';
import { APIs_V1 } from '~/routes/v1/index.js';
import errorHandlingMiddleware from '~/middlewares/errorHandlingMiddleware';
import cors from 'cors';
import { corsOptions } from '~/config/cors';
import cookieParser from 'cookie-parser';
import socketIo from 'socket.io';
import http from 'http';
import { inviteUserToBoardSocket } from './sockets/inviteUserToBoardSocket';

const app = express();

const hostname = env.APP_HOST;
const port = env.APP_PORT;

const START_SERVER = () => {
  // Vercel serverless function need to trust proxy
  app.enable('trust proxy');

  // Disable browser caching request
  app.use((req, res, next) => {
    res.set('Cache-Control', 'no-store');
    next();
  });

  // Config Cookie Parser (get cookies from browser)
  app.use(cookieParser());

  // CORS domain whitelist
  app.use(cors(corsOptions));

  // Enable req.body json data
  app.use(express.json());

  // Use APIv1 routes
  app.use('/v1', APIs_V1);

  // Error hadling middleware
  app.use(errorHandlingMiddleware);

  // Create a server instance and pass the express app as a real-time server
  const server = http.createServer(app);
  const io = socketIo(server, { cors: corsOptions });
  io.on('connection', (socket) => {
    inviteUserToBoardSocket(socket);
  });

  // Use server to listen because server have express and socket.io
  if (env.BUILD_MODE === 'production') {
    // Config in Render.com deploy
    server.listen(process.env.PORT, () => {
      console.log('Production mode: TaskPro is running at https://taskpro-api-hwly.onrender.com');
    });
  } else {
    server.listen(port, hostname, () => {
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
