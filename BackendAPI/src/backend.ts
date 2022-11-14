import env from 'dotenv';
env.config();

import express from 'express';
import rootController from './controllers/rootController';
import { init as initDB } from './database/mongodb';
import { initMiddleware } from './utils/middlewareUtil';
import adminController from './controllers/adminController';

const app = express();
const PORT = process.env.PORT;

const start = async () => {
  if(PORT == null || PORT == undefined) {
    console.log("Port not set");
    process.exit(1);
  }
  await initDB()
  initMiddleware(app);
  await rootController(app);
  await adminController(app);
}

start().then(() => {
  app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
  });
})

