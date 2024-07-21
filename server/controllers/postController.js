const Post = require('../models/PostModel');
const User = require('../models/User');


// CREATE 
/* This will have an image getting passed through to the middleware*/
const createPostController = async (req,res ) => {
    try {
        const { userId, description, picturePath } = req.body;
        const user = await User.findById(userId);

        const newPost = new Post({
            userId,
            firstName : user.firstName,
            lastName: user.lastName,
            location: user.location,
            description,
            userPicturePath: user.picturePath,
            picturePath,
            likes: {},
            comments: [],
        })
        await newPost.save();

        const post = await Post.find(); // to show updated list of all posts with the latet ones.

        res.status(201).json(post);
    } catch (err) {
        res.status(409).json({ message: err.message});
        
    }
}

// READ
/* Grab all the posts of everyone like newsfeed for user. */
const getFeedPostController = async (req,res ) => {
    try {
        const post = await Post.find();
        res.status(200).json(post);
    } catch (err) {
        res.status(404).json({ message: err.message});
        
    }
}

const getUserPostController = async (req,res ) => {
    try {
        const { userId } =req.params;
        const post = await Post.find({userId});
        res.status(200).json(post);
    } catch (err) {
        res.status(404).json({ message: err.message});
        
    }
}

// UPDATE
/*  */
const likePostController = async (req,res ) => {
    try {
        const { id } = req.params; // to grab the relevant post
        const { userId } = req.body; // to grab the relevant user

        const post = await Post.findById(id);
        const isLiked = post.likes.get(userId); // Check if post has been liked by that particular userId

        if (isLiked) {
            post.likes.delete(userId); // Unlike
        } else {
            post.likes.set(userId, true); // Like
        }

        const updatedPost = await Post.findByIdAndUpdate(
            id, //  Find the post which got likes
            {likes: post.likes }, // Update the list of Likes.
            { new: true },
        )

        res.status(200).json(updatedPost);
    } catch (err) {
        res.status(404).json({ message: err.message});
        
    }
}

module.exports = { createPostController,getFeedPostController, getUserPostController, likePostController };