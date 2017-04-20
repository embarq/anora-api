import {
  Connection,
  Document,
  Model,
  Schema,
  Types
} from 'mongoose';

const UserRef = {
  type: Schema.Types.ObjectId,
  ref: 'User'
};

const BoardSchema = new Schema({
  members: [ UserRef ],
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    require: true
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
          require: true
        }
      }
    ]
  }
});

export const getBoardModel = (connection: Connection) => connection.model('Board', BoardSchema);
