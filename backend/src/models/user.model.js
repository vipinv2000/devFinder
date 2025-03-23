import mongoose, { Schema } from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    profilePic: {
      type: String,
      default: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSnFRPx77U9mERU_T1zyHcz9BOxbDQrL4Dvtg&s',
    },
    field: {
      type: [String],
      default: [],
    },

    action: {
      type:[
        {
          userId: { type: Schema.Types.ObjectId, ref: 'User' },
          follow:{
            type:String,
            default:""
          }
        },
      ], default: [],
    },
   
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);

export default User;
