import { log } from 'util';
import { Request_Mode } from '../../utils/Request_methods.js';
import { techStack } from '../../utils/tecStacks.js';
import Post from '../models/post.model.js';
import User from '../models/user.model.js';
import cloudinary from '../lib/cloudinary.js';
import { json } from 'stream/consumers';

export const addpost = async (req, res) => {
  const userId = req.user._id;
  const { caption, image, description, visibility } = req.body;

  try {
    let imageUrl;
    if (image) {
      // Upload base64 image to cloudinary
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const postData = {
      caption,
      image: imageUrl,
      description,
      isPrivate: visibility == 'public' ? true : false,

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
    console.log(error);

    return res.status(500).json({ success: false, message: error.message });
  }
};

export const addStory = async (req, res) => {
  const userId = req.user._id;
  const { caption, image } = req.body;

  console.log('req.body', req.body);

  try {
    let imageUrl;
    if (image) {

      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }
    const storyData = {
      caption,

      image: imageUrl ? imageUrl : '',
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
  console.log("Hellooo");

  const userId = req.user._id;
  const { id, type } = req.params; // ID of the user to follow

  console.log(userId, id, type);


  try {
    const sender = await User.findById(userId);
    const receiver = await User.findById(id);

    if (!sender || !receiver) {
      return res
        .status(404)
        .json({ success: false, message: 'User not found' });
    }


    // Add follow request for both users
    if (type === "request") {
      sender.action.push({
        userId: id,
        follow: 'pending',
      });

      receiver.action.push({
        userId: userId,
        follow: 'requested',
      });
    } else {
      var sendeIndex = receiver.action.findIndex(index => index.userId.toString() === userId.toString())
      var recivereIndex = sender.action.findIndex(index => index.userId.toString() === id.toString())

      console.log("sendeIndex", sendeIndex, "recivereIndex", recivereIndex);

    }

    if (type === "followback") {
      console.log("Hiiii", receiver);

      sender.action[recivereIndex].follow = "following"
      receiver.action[sendeIndex].follow = "following"
    }

    if (type === "unblock") {
      sender.action[recivereIndex].follow = "following"
      receiver.action[sendeIndex].follow = "following"
    }


    await sender.save();
    await receiver.save();

    return res
      .status(200)
      .json({ success: true, message: 'Successfully sent follow request' });
  } catch (error) {
    console.log(error);

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

  console.log("type",type);
  

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
    console.log(error);
    
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

    const followedUserIds = (user.action || [])
      .filter(action => action.follow === 'following')
      .map(action => action.userId?._id);
    console.log('followedUserIds', followedUserIds);

    const followedUsersPosts =
      (await Post.find({
        user: { $in: followedUserIds.length ? followedUserIds : [] },
      })
        .populate('user', 'fullName profilePic')
        .sort({ createdAt: -1 })) || [];

    const updatedFollowedUsersPosts = followedUsersPosts.map(item => ({
      ...item._doc, // Spread existing post data
      posts: item.posts.map(post => ({
        ...post._doc, // Spread post data
        isLiked: Array.isArray(post.like) ? post.like.includes(userId) : false, // Add isLiked property to each post
      })),
    }));


    // console.log('followedUserIds', JSON.stringify(followedUsersPosts, null, 2));

    const publicPosts =
      (await Post.find({
        user: {
          $nin: followedUserIds.length ? followedUserIds : [],
          $ne: userId // Exclude the current user's posts
        }
      })
        .populate('user', 'fullName ')
        .sort({ createdAt: -1 })) || [];

    console.log("Public Post", publicPosts);


    //console.log('Pooooooooo', JSON.stringify(publicPosts, null, 2));
    console.log("UserId", userId);

    const allPublic_Postts = publicPosts
      .map(item => {
        const plainItem = item.toObject(); // Convert to plain JS object
        return {
          ...plainItem, // Spread only necessary data
          posts: plainItem.posts
            .filter(post => post.isPrivate === false) // Keep only public posts
            .map(post => ({
              ...post, // Spread post data (already a plain object)
              isLiked: Array.isArray(post.like)
                ? post.like.map(id => id.toString()).includes(userId.toString()) // Convert ObjectIds to strings before checking
                : false,
            }))
        };
      })
      .filter(item => item.posts.length > 0);

    //console.log("Public Post  222", allPublic_Postts);

    //console.log('allPublic_Postts', JSON.stringify(allPublic_Postts, null, 2));


    const allPosts = [...updatedFollowedUsersPosts, ...allPublic_Postts];


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
  const { page = 1, limit = 4 } = req.query; // Default values
  console.log('called');

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: 'User Not found' });
    }

    const userSkills = user.field; // Get current user's skills
    const excludedUserIds = user.action.map(action => action.userId);

    // Count total matching developers (without pagination)
    const totalDevelopers = await User.countDocuments({
      _id: { $ne: userId, $nin: excludedUserIds },
      field: { $in: userSkills },
    });

    // Fetch paginated developers
    const matchedUsers = await User.find(
      {
        _id: { $ne: userId, $nin: excludedUserIds },
        field: { $in: userSkills },
      },
      'fullName email profilePic field _id' // <-- Select only these fields
    )
      .skip((page - 1) * limit)
      .limit(Number(limit));

    return res.status(200).json({
      success: true,
      developers: matchedUsers,
      totalDevelopers, // Send total count
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const searchtecStack = (req, res) => {
  const { searchkey } = req.params;
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

export const getDeveloperProfile = async (req, res) => {
  const { devId } = req.params;
  const userId = req.user._id;

  try {
    let postsWithLikeStatus = [];


    const userData = await User.findOne({ _id: devId }, "-password");


    if (!userData) {
      return res
        .status(404)
        .json({ success: false, message: 'User Not Found' });
    }

    const postData = await Post.findOne({ user: devId }).populate('user');


    var isFollowing = userData?.action?.some(
      (action) => action.userId.toString() === userId.toString() && action.follow === "following"
    ) || false;



    if (postData?.posts) {
      const filteredPosts = postData.posts.filter(post => !post.isPrivate || isFollowing);
      postsWithLikeStatus = filteredPosts.map(post => ({
        ...post.toObject(),
        isLiked: Array.isArray(post.like) ? post.like.includes(userId) : false,
        postCollectionId: postData._id,
      }));
    }

    console.log("Developer Data:", postData);

    const followingCount = userData.action?.filter(
      (item) => item.follow === "pending" || item.follow === "following"
    ).length || 0;

    console.log("Following Count:", followingCount);

    const followersCount = await User.countDocuments({
      "action.userId": devId,
      "action.follow": { $in: ["following", "requested"] }
    });

    console.log("Followers Count:", followersCount);
    var requestUserStatus = userData?.action
      ?.find(item => item.userId.toString() === userId.toString())?.follow || 'sendRequest';

    console.log("requestUserStatus:", requestUserStatus);




    return res.status(200).json({
      success: true,
      user: userData,
      posts: postsWithLikeStatus,
      followingCount,
      followersCount,

      status: requestUserStatus,
      isYou: devId.toString() === userId.toString(),

    });
  } catch (error) {
    console.error('Error fetching profile:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};


export const getAccountInteractions = async (req, res) => {
  const userId = req.user._id;

  try {
    const user = await User.findById(userId)
      .populate('action.userId')
      .select('-password');
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: 'User not found' });
    }

    const interactedUsers = user.action

    console.log("interactedUsers", JSON.stringify(interactedUsers, null, 2))


    return res.status(200).json({ success: true, interactedUsers })

  } catch (e) {
    return res.status(500).json({ success: false, message: e.message });

  }
}

export const getfollowingDevelopers = async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id
  try {

    const Useres = await User.findOne({ _id: id }).populate("action.userId")

    const GetFollwingdev = Useres.action.filter(item => (
      item.userId._id.toString() != id.toString() && item.follow === "following" || item.follow === "pending"
    ));

    console.log("GetFollwingdev", GetFollwingdev);


    return res.status(200).json({ success: true, GetFollwingdev })

  } catch (e) {
    return res.status(500).json({ success: false, message: e.message });
  }
}

export const getfollowers = async (req, res) => {
  const { id } = req.params;  // The user whose followers we need
  const userId = req.user._id
  try {
    console.log("User ID:", id);

    // Fetch all users
    const allUsers = await User.find({}, "-password  -field")

    // Find users who have sent a follow request to the given user
    const followers = [];
    const filterfollowers = []

    allUsers.forEach(item => {
      item.action.forEach(actionItem => {
        if (actionItem.userId.toString() === id && actionItem.userId.toString() != userId.toString()) {
          followers.push(item);
        }
      });
    });

    followers.forEach(item => {
      item.action.forEach(actionItem => {
        if (actionItem.follow === "following" || actionItem.follow === "requested") {
          filterfollowers.push(item);
        }
      });
    });



    console.log("Followers:", filterfollowers);

    return res.status(200).json({ success: true, followers });

  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const DoPostLike = async (req, res) => {
  const { postId, collectionId } = req.params;
  const userId = req.user._id;

  try {
    const DevPost = await Post.findOne({ _id: collectionId });

    if (!DevPost) {
      return res.status(404).json({ success: false, message: "Collection not found" });
    }


    const post = DevPost.posts.find(post => post._id.toString() === postId.toString());

    if (!post) {
      return res.status(404).json({ success: false, message: "Post not found" });
    }


    const likeIndex = post.like.findIndex(like => like.toString() === userId.toString());

    if (likeIndex === -1) {

      post.like.push(userId);
    } else {

      post.like = post.like.filter(like => like.toString() !== userId.toString());
    }


    await DevPost.save();

    return res.status(200).json({ success: true, message: "Like status updated", likes: post.like.length });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};




