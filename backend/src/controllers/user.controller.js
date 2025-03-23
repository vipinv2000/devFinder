import { log } from 'util';
import { Request_Mode } from '../../utils/Request_methods.js';
import { techStack } from '../../utils/tecStacks.js';
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

export const addStory = async (req, res) => {
  const userId = req.user._id;
  const { caption, image } = req.body;

  try {
    const storyData = {
      caption,
      image,
      date: new Date(),
    };

    let post = await Post.findOne({ user: userId });

    if (post) {
      post.story.push(storyData);
      await post.save();
    } else {
      post = new Post({
        user: userId,
        story: [storyData],
      });
      await post.save();
    }

    return res.status(201).json({ success: true, message: 'Story uploaded' });
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
  const { id, type } = req.params; // Sender's ID (User who sent the follow request)

  try {
    if (type === 'following') {
      Request_Mode('following', 'following', req, res);
    } else if (type === 'block') {
      Request_Mode('rejected', 'blocked', req, res);
    }

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

    const followedUserIds = (user.action || []) // Ensure it's an array
      .filter(action => action.follow === 'following')
      .map(action => action.userId?._id);
    console.log('followedUserIds', followedUserIds);

    const followedUsersPosts =
      (await Post.find({
        user: { $in: followedUserIds.length ? followedUserIds : [] },
      })
        .populate('user', 'fullName ')
        .sort({ createdAt: -1 })) || []; // Ensure it's an array

   // console.log('followedUserIds', JSON.stringify(followedUsersPosts, null, 2));

    const publicPosts =
      (await Post.find({
        user: { $nin: followedUserIds.length ? followedUserIds : [] },
        // Corrected query
      })
        .populate('user', 'fullName ')
        .sort({ createdAt: -1 })) || []; // Ensure it's an array

    //console.log('Pooooooooo', JSON.stringify(publicPosts, null, 2));

    const allPublic_Postts = publicPosts
      .map(item => ({
        ...item, // Keep user and other details
        posts: item.posts.filter(post => post.isPrivate === false), // Keep only public posts
      }))
      .filter(item => item.posts.length > 0);

    //console.log('allPublic_Postts', JSON.stringify(allPublic_Postts, null, 2));

    const allPosts = [...followedUsersPosts, ...allPublic_Postts];

    console.log('allPosts', JSON.stringify(allPosts, null, 2));


    return res.status(200).json({ success: true, posts: allPosts });
  } catch (error) {
    console.error('Error in getFeedPosts:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getStory = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId).populate('action.userId');

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: 'User not found' });
    }

    const followedUserIds = (user.action || [])
      .filter(action => action.follow === 'following' && action.userId)
      .map(action => action.userId._id);

    console.log('Followed User IDs:', followedUserIds);

    const followedUsersStory = followedUserIds.length
      ? await Post.find({ user: { $in: followedUserIds } })
          .select('story user')
          .populate('user', 'fullName profilePic')
          .sort({ createdAt: -1 })
      : [];

    console.log('Followed Users Story:', followedUsersStory);

    return res.status(200).json({ success: true, story: followedUsersStory });
  } catch (error) {
    console.error('Error in getStory:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getDevelopers = async (req, res) => {
  const userId = req.user._id; // Get logged-in user's ID
  const { page = 1, limit = 10 } = req.query; // Default page = 1, limit = 10

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: 'User Not found' });
    }

    const userSkills = user.field; // Get current user's skills

    // Extract all userIds from the action array (ignoring follow status)
    const excludedUserIds = user.action.map(action => action.userId);

    // Find users who have at least one matching skill, exclude the current user & users in action array
    const matchedUsers = await User.find({
      _id: { $ne: userId, $nin: excludedUserIds }, // Exclude current user & action users
      field: { $in: userSkills }, // Match at least one skill
    })
      .skip((page - 1) * limit) // Skip previous records
      .limit(Number(limit)); // Limit number of users

    return res.status(200).json({ success: true, developers: matchedUsers });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const searchtecStack = (req, res) => {
  const { searchkey } = req.params;
  console.log('reacvjhg', searchkey);

  try {
    if (!searchkey) {
      return res
        .status(400)
        .json({ success: false, message: 'Search key is required' });
    }

    const regex = new RegExp(searchkey, 'i'); // Case-insensitive match
    const regexStart = new RegExp(`^${searchkey}`, 'i'); // Match from start

    console.log('Regex:', regex);
    console.log('Regex Start:', regexStart);

    // Example tech stack array (Make sure you have this defined)

    // Filter items that match the regex
    const filteredResults = techStack.filter(item => regex.test(item));
    console.log('Filtered Results:', filteredResults);

    let priorityFirst = [];
    let prioritySecond = [];

    filteredResults.forEach(item => {
      if (regexStart.test(item)) {
        priorityFirst.push(item);
      } else {
        prioritySecond.push(item);
      }
    });

    // Remove duplicates and limit results to 12
    const searchResult = [
      ...new Set([...priorityFirst, ...prioritySecond]),
    ].slice(0, 12);

    console.log('Search Result:', searchResult);

    return res.status(200).json({ success: true, searchResult });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
