import { Connection, Document, Model, Schema } from 'mongoose';

export interface Credentials {
  email: string;
  password?: string;
}

export interface User extends Credentials, Document {
  name: string;
}

const UserSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    index: true
  },
  password: {
    type: String,
    required: true
  }
});

/** Connection -> Model */
export const getUserModel = (connection: Connection) => connection.model('User', UserSchema);
