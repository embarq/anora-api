import {
  Connection,
  Document,
  Model,
  Schema,
  Types
} from 'mongoose';

import { userRef } from '../user/user.model';

export namespace Board {
  export interface BoardList {
    _id: string;
    title: string;
  }

  export interface Schema {
    members: Array<string>;
    author: string;
    title: string;
    color?: string;
    lists?: Array<BoardList>;
  }
}

const BoardSchema = new Schema({
  members: {
    type: [ userRef ],
    required: true
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  color: {
    type: String,
    default: null
  },
  lists: {
    default: [ ],
    type: [
      {
        title: {
          type: String,
          required: true
        }
      }
    ]
  }
});

export const getBoardModel = (connection: Connection) => connection.model('Board', BoardSchema);
