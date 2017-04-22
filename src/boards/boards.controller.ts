import { Connection, Document, Model } from 'mongoose';
import { RequestHandler } from 'express';
import { Board, getBoardModel } from './boards.model';
import { baseRequestHandler, validatedRequestHandler } from '../etc/helpers';
import { ControllerMethods } from '../etc/declarations';
import { AnoraAuthRequest } from '../auth/auth.middleware';
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

const create = (model: Model<Document>) => (board: Board.Schema, authorId: string) => model
  .create(Object.assign(board, {
    author: authorId,
    members: [ authorId ]
  }))
  .then((doc: any) => doc
    .populate({
      path: 'author members',
      select: authorSelector
    })
    .execPopulate());

const getAllBoards = (model: Model<Document>) => (author: string, isShort: boolean = false) => {
  const options = {
    path: 'author members',
    select: authorSelector
  };

  const query = isShort ? '_id title color' : { };

  return model
    .find({ }, query)
    .where({
      members: { $in: [ author ] },
      author
    })
    .exec()
    .then(docs => model.populate(docs, options));
};

const getBoard = (model: Model<Document>) => (id: string) => model
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
    create: (req: AnoraAuthRequest, res) =>
      validatedRequestHandler(
        res,
        () => validateCreateBoardForm(req),
        () => create(BoardModel)(req.body, req.user)),

    getBoard: (req, res) =>
      validatedRequestHandler(
        res,
        () => validateBoardId(req),
        () => getBoard(BoardModel)(req.params['id'])),

    getAllBoards: (req: AnoraAuthRequest, res) =>
      validatedRequestHandler(
        res,
        () => validateBoardsListQuery(req),
        () => getAllBoards(BoardModel)(req.user, req.query['short'] === 'true'))
  } as ControllerMethods;
}
