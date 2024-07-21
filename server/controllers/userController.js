const User= require('../models/User');


const getUserController = async (req,res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);
        res.status(200).json(user);
    } catch (err) {
        res.status(404).json({ message: err.message});
    }
};

const getUserFriendsController = async (req,res)=>{
    try {
        const { id } = req.params;
        const user = await User.findById(id);

/*      we're using promise.all because we'll make multiple API calls to the database */
        const friends = await Promise.all(
            user.friends.map((id) => User.findById(id))
        );
        
/*      Format the friends in proper way for the FrontEnd. */
        const formattedFriends = friends.map(
            ({ _id, firstName, lastName, occupation, location, picturePath }) => {
                return { _id, firstName, lastName, occupation, location, picturePath};
            }
        );

        res.status(200).json(formattedFriends);
    } catch (err) {
        res.status(404).json({ message: err.message});
    }
};

//  UPDATE
const addRemoveFriendController = async (req,res)=>{
    try {
        const { id, friendId } = req.params;
        const user = await User.findById(id);
        const friend = await User.findById(friendId);

        /* IF friendId is included in user's friends list then remove it or else if Add it.  */
        if (user.friends.includes(friendId)) {
            /* Removing Friend from user profile */
            user.friends = user.friends.filter((id) => id !== friendId);
            /* Removing Friend from friend's profile */
            friend.friends = friend.friends.filter((id) => id !== friendId);
        } else {
            /* Adding Friend to user profile */
            user.friends.push(friendId);
            /* Adding Friend to friend profile */
            friend.friends.push(id);
        }
        await user.save();
        await friend.save();

/*      we're using promise.all because we'll make multiple API calls to the database */
        const friends = await Promise.all(
            user.friends.map((id) => User.findById(id))
        );

/*      Format the friends in proper way for the FrontEnd. */
        const formattedFriends = friends.map(
            ({ _id, firstName, lastName, occupation, location, picturePath }) => {
                return { _id, firstName, lastName, occupation, location, picturePath};
            }
        );

        res.status(200).json(formattedFriends);
    } catch (err) {
        res.status(404).json({ message: err.message});
    }
}

module.exports = { getUserController, getUserFriendsController, addRemoveFriendController };