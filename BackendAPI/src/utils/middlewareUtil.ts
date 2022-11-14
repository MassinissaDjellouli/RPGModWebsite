import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import { Express } from 'express';
export const initMiddleware = (app:Express) => {
    app.use(express.json());
    app.use(morgan('common'));
    // app.use(cors(corsOptions));
    app.use(cors());
    app.use(helmet());
}

const whitelist = ['http://localhost:3000']
const corsOptions = {
  origin: function (origin:any, callback:any) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}