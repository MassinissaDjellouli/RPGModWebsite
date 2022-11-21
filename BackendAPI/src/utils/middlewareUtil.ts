import cors from 'cors';
import express, {Express} from 'express';
import helmet from 'helmet';
import morgan from 'morgan';

export const initMiddleware = (app: Express) => {
    app.use(express.json({limit: '50mb'}));
    app.use(morgan('common'));
    app.use(cors());
    // app.use(cors(corsOptions));
    app.use(helmet());
}

const whitelist = ['http://localhost:5173']
const corsOptions = {
    origin: function (origin: any, callback: any) {
        if (whitelist.indexOf(origin) !== -1) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    }
}