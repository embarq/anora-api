import express = require('express');
import mongoose = require('mongoose');
import bodyParser = require('body-parser');
import validator = require('express-validator');

import { getAuthRouter } from './auth/auth.router';
import { getBoardsRouter } from './boards/boards.router';

(mongoose as any).Promise = global.Promise;

const databaseURI = process.env.DB_URI || 'mongodb://localhost/anora';
const connection = mongoose.createConnection(databaseURI);
const app = express();
const api = express.Router();

app.use(bodyParser.json());
app.use(validator({
  errorFormatter: (param, message, value) => ({ param, message, value })
}));

api.use('/auth', getAuthRouter(connection));
api.use('/boards', getBoardsRouter(connection));

app.use('/api', api);

app.listen(process.env.PORT || 3000, () => console.log('App running'));
