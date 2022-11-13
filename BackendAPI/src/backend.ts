import cors from 'cors';
import env from 'dotenv';
env.config();
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import startController from './controllers/rootController';
import { init } from './database/mongodb';


const PORT = process.env.PORT;

if(PORT == null || PORT == undefined) {
    console.log("Port not set");
    process.exit(1);
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

const app = express();
app.use(express.json());
app.use(morgan('common'));
// app.use(cors(corsOptions));
app.use(cors());
app.use(helmet());
init()
    startController(app);

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});
