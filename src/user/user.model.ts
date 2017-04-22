import { Connection, Document, Schema } from 'mongoose';

const schemaName = 'User';

const requiredValidationMessage = '{PATH} is required';

const userSchema = new Schema({
  name: {
    type: String,
    trim: true,
    required: requiredValidationMessage
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    required: requiredValidationMessage,
    index: true
  },
  password: {
    type: String,
    required: requiredValidationMessage,
    minlength: [8, 'Password should be more that 8 characters']
  }
});

export interface Credentials {
  email: string;
  password: string;
}

export interface User extends Credentials, Document {
  name: string;
}

export const userRef = {
  type: Schema.Types.ObjectId,
  ref: schemaName
}

/** Connection -> Model */
export const getUserModel = (connection: Connection) => connection.model(schemaName, userSchema);
