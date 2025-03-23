import mongoose, { Schema } from 'mongoose';

const postSchema = new mongoose.Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  posts: [
    {
      _id: {
        type: Schema.Types.ObjectId,
        auto: true,
      },
      caption: {
        type: String,
        maxlength: 25,
        required: true,
      },
      image: {
        type: String,
        default: '',
      },
      description: {
        type: String,
        default: '',
      },
      like: [
        {
          type: Schema.Types.ObjectId,
          default: [],
        }
      ],
      isPrivate: {
        type: Boolean,
        default: false
      },
      date: {
        type: String,
        default: new Date()
      }
    },

  ],
  story: [
    {
      _id: {
        type: Schema.Types.ObjectId,
        auto: true,
      },
      caption: {
        type: String,
        maxlength: 25,
        required: true,
      },
      image: {
        type: String,
        default: '',
      },
      like: [{
        type: Schema.Types.ObjectId,
        default: [],
      }],
      date: {
        type: String,
        default: new Date()
      }
    }
  ],
});
const Post = mongoose.model('Post', postSchema);

export default Post;
