import { MongoClient, ServerApiVersion } from 'mongodb';
import env from '~/config/enviroment.js';


const MONGODB_URI = env.MONGODB_URI;
const DATABASE_NAME = env.DATABASE_NAME;

let taskproDb = null;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(MONGODB_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true
  }
}
);

export const CONNECT_DB = async () => {
  await client.connect();
  taskproDb = client.db(DATABASE_NAME);
};

export const CLOSE_DB = async () => {
  await client.close();
};

export const GET_DB = () => {
  if (taskproDb) {
    return taskproDb;
  }
  else
    throw new Error('Something go wrong in get Monodb!');
};
