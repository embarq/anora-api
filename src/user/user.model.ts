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
    trim: true,
    required: '{PATH} is required'
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    required: '{PATH} is required',
    index: true
  },
  password: {
    type: String,
    required: '{PATH} is required',
    minlength: [8, 'Password should be more that 8 characters']
  }
});

/** Connection -> Model */
export const getUserModel = (connection: Connection) => connection.model('User', UserSchema);
