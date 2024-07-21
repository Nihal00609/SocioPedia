const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
    {
        userId : {
            type: String,
            required: true,            
        },
        firstName : {
            type: String,
            required: true,
        },
        lastName : {
            type: String,
            required: true,
        },
        location: String,
        description: String,
        picturePath: String,
        userPicturePath: String,
        likes : {
            type: Map,
            of: Boolean,
        },
        comments : {
            type: Array,
            default: [],
        },
    }, {timestamps: true} //Automatically gives when created, updated etc. (dates, time)
);

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
