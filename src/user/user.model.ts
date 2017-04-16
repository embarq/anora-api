import { Connection, Document, Model, Schema } from 'mongoose';

const UserSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    index: true
  }
});

/** Connection -> Model */
export const getUserModel = (connection: Connection) => connection.model('User', UserSchema);
