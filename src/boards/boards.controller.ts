import { Connection, Document, Model } from 'mongoose';
import { RequestHandler } from 'express';
import { getBoardModel } from './boards.model';
import { baseRequestHandler } from '../etc/helpers';

const authorSelector = 'name';

const create = (model: Model<Document>) => board => model
  .create(Object.assign(board, {
    members: [ board.author ]
  }))
  .then((doc: any) => doc
    .populate({
      path: 'author members',
      select: authorSelector
    })
    .execPopulate());

const getAllBoards = (model: Model<Document>) => () => {
  const options = {
    path: 'author members',
    select: authorSelector
  };

  return model
    .find()
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
      baseRequestHandler(res, create(BoardModel)(req.body)),

    getBoard: (req, res) =>
      baseRequestHandler(res, getBoard(BoardModel)(req.params['id'])),

    getAllBoards: (req, res) =>
      baseRequestHandler(res, getAllBoards(BoardModel)())
  }
}
