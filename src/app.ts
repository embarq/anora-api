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

app.use(bodyParser.json());
app.use(validator({
  errorFormatter: (param, message, value) => ({ param, message, value })
}));

app.use('/auth', getAuthRouter(connection));
app.use('/boards', getBoardsRouter(connection));

app.listen(process.env.PORT || 3000, _ => console.log('App running'));
