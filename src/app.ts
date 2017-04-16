import * as express from 'express';
import * as mongoose from 'mongoose';
import * as bodyParser from 'body-parser';

import { getAuthRouter } from './auth/auth.router';
import { getBoardsRouter } from './boards/boards.router';

(mongoose as any).Promise = global.Promise;

const databaseURI = process.env.DB_URI || 'mongodb://localhost/anora';
const connection = mongoose.createConnection(databaseURI);
const app = express();

app.use(bodyParser.json());

app.use('/auth', getAuthRouter(connection));
app.use('/boards', getBoardsRouter(connection));

app.listen(process.env.PORT || 3000, _ => console.log('App running'));
