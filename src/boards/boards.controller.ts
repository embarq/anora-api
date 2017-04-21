import { Connection, Document, Model } from 'mongoose';
import { RequestHandler } from 'express';
import { getBoardModel } from './boards.model';
import { baseRequestHandler, validatedRequestHandler } from '../etc/helpers';
import ExpressValidator = require('express-validator');

const authorSelector = 'name';

const validateCreateBoardForm = (req: ExpressValidator.RequestValidation) => {
  req.checkBody('title', 'Board title is required').notEmpty();
  return req.getValidationResult();
}

const validateBoardId = (req: ExpressValidator.RequestValidation) => {
  req.checkParams('id', 'Board is not exists').isMongoId();
  return req.getValidationResult();
}

const validateBoardsListQuery = (req: ExpressValidator.RequestValidation) => {
  req.checkQuery('short', 'Invalid query param').optional().isBoolean();
  return req.getValidationResult();
}

const create = (model: Model<Document>) => (board, authorId) => {
  return model
  .create(Object.assign(board, {
    author: authorId,
    members: [ authorId ]
  }))
  .then((doc: any) => doc
    .populate({
      path: 'author members',
      select: authorSelector
    })
    .execPopulate())};

const getAllBoards = (model: Model<Document>) => (isShort: boolean = false) => {
  const options = {
    path: 'author members',
    select: authorSelector
  };

  const query = isShort ? '_id title color' : null;

  return model
    .find(null, query)
    .exec()
    .then(docs => model.populate(docs, options));
};

const getBoard = (model: Model<Document>) => id => model
  .findById(id)
  .exec()
  .then(doc => doc
    .populate({
      path: 'author',
      select: authorSelector
    })
    .execPopulate())
  .catch(err => { throw new Error(`Board with id "${ id }" not found`); });

export const getBoardsController = (connection: Connection) => {
  const BoardModel = getBoardModel(connection);

  return {
    create: (req, res) =>
      validatedRequestHandler(
        res,
        () => validateCreateBoardForm(req),
        () => create(BoardModel)(req.body, req.user)),

    getBoard: (req, res) =>
      validatedRequestHandler(
        res,
        () => validateBoardId(req),
        () => getBoard(BoardModel)(req.params['id'])),

    getAllBoards: (req, res) =>
      validatedRequestHandler(
        res,
        () => validateBoardsListQuery(req),
        () => getAllBoards(BoardModel)(req.query['short'] === 'true'))
  }
}
