import { model, Schema, Document } from 'mongoose';
import { User } from '@interfaces/users.interface';

const userSchema: Schema = new Schema({
  name: {
    type: String,
    required: true
  },
  affliate: {
    type: String,
    required: true
  },
  mail: {
    type: String,
    required: true
  },
  mobile: {
    type: String,
    required: true
  },
  uid: {
    type: String,
    required: true
  },
  devices: {
    type: Array,
    required: true
  }
});

const userModel = model<User & Document>('Users', userSchema);

export default userModel;
