import Post from '../models/post.model.js';
import User from '../models/user.model.js';

export const addpost = async (req, res) => {
  const userId = req.user._id;
  const { caption, image, description, visibility } = req.body;

  try {
    const postData = {
      caption,
      image,
      description,
      isPrivate: visibility ? true : false,
      date: new Date(),
    };

    let post = await Post.findOne({ user: userId });
    console.log(post);

    if (post) {
      post.posts.push(postData);
      await post.save();
    } else {
      post = new Post({
        user: userId,
        posts: [postData],
      });
      await post.save();
    }

    return res.status(201).json({ success: true, message: 'Post uploaded' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const requestFollow = async (req, res) => {
  const userId = req.user._id;
  const { id } = req.params; // ID of the user to follow

  try {
    const sender = await User.findById(userId);
    const receiver = await User.findById(id);

    if (!sender || !receiver) {
      return res
        .status(404)
        .json({ success: false, message: 'User not found' });
    }

    // Check if a follow request already exists
    const existingIndex = sender.action.findIndex(
      item => item.userId.toString() === id.toString()
    );

    if (existingIndex !== -1) {
      return res
        .status(400)
        .json({ success: false, message: 'Follow request already sent' });
    }

    // Add follow request for both users
    sender.action.push({
      userId: id,
      follow: 'pending',
    });

    receiver.action.push({
      userId: userId,
      follow: 'requested',
    });

    await sender.save();
    await receiver.save();

    return res
      .status(200)
      .json({ success: true, message: 'Successfully sent follow request' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getPendingRequests = async (req, res) => {
  try {
    const userId = req.user._id; // Get logged-in user ID

    // Find users who have a follow request pending
    const user = await User.findById(userId).populate(
      'action.userId',
      'fullName email profilePic'
    );

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: 'User not found' });
    }

    // Filter out actions where follow status is "pending"
    const pendingRequests = user.action.filter(
      item => item.follow === 'pending'
    );

    return res.status(200).json({ success: true, pendingRequests });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const acceptFollowRequest = async (req, res) => {
  const userId = req.user._id; // Logged-in user (Receiver)
  const { id } = req.params; // Sender's ID (User who sent the follow request)

  try {
    const receiver = await User.findById(userId);
    const sender = await User.findById(id);

    if (!receiver || !sender) {
      return res
        .status(404)
        .json({ success: false, message: 'User not found' });
    }

    // Find the follow request in the receiver's action array
    const receiverIndex = receiver.action.findIndex(
      item =>
        item.userId.toString() === id.toString() && item.follow === 'requested'
    );
    const senderIndex = sender.action.findIndex(
      item =>
        item.userId.toString() === userId.toString() &&
        item.follow === 'pending'
    );

    if (receiverIndex === -1 || senderIndex === -1) {
      return res
        .status(400)
        .json({ success: false, message: 'Follow request not found' });
    }

    // Update both users' follow status to "following"
    receiver.action[receiverIndex].follow = 'following';
    sender.action[senderIndex].follow = 'following';

    await receiver.save();
    await sender.save();

    return res
      .status(200)
      .json({ success: true, message: 'Follow request accepted!' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getFeedPosts = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId).populate('action.userId');

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: 'User not found' });
    }

    const followedUserIds = user.action
      .filter(action => action.follow === 'following')
      .map(action => action.userId._id);

    const followedUsersPosts = await Post.find({
      user: { $in: followedUserIds },
    })
      .populate('user', 'fullName profilePic')
      .sort({ createdAt: -1 });

    const publicPosts = await Post.find({
      user: { $nin: followedUserIds },
      'posts.isPrivate': false,
    })
      .populate('user', 'fullName profilePic')
      .sort({ createdAt: -1 });

    const allPosts = [...followedUsersPosts, ...publicPosts];

    return res.status(200).json({ success: true, posts: allPosts });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
