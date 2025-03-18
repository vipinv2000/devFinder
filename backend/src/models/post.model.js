import mongoose, { Schema } from 'mongoose';

const postSchema = new mongoose.Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  posts: [
    {
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
      likeCount: {
        type: Number,
        default: 0,
      },
      isPrivate:{
        type:Boolean,
        default:false
      },
      date:{
        type:String,
        default:new Date()
      }
    },
    
  ],
});
const Post = mongoose.model('Post', postSchema);

export default Post;
