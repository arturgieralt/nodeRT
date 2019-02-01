import { Schema, model } from 'mongoose';
import { validateUsername } from './../validators/UserValidators';

export const UserSchema = new Schema({
  _id: Schema.Types.ObjectId,
  name: {
    type: String,
    unique: true,
    required: [true, 'Please provide a username'],
    validate: [{ validator: validateUsername, msg: 'Invalid length' }]
  },
  email: {
    type: String,
    unique: true,
    required: [true, 'Please provide an email']
  }
});

export const UserModel = model('User', UserSchema, 'users');