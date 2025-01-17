const bcrypt = require("bcrypt");
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// **************----REGISTER USER----**************
/*  
    -Encrypt the password -save it -when user tries to login andn provides password
    - salt that again and make sure its correct one -give them jsonwebtoken 
*/
const registerController = async (req,res) => {
    try {
        const { firstName, lastName, email, password, picturePath, friends, location, occupation } = req.body;

        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password, salt);

        const newUser = new User({
            firstName,
            lastName, 
            email, 
            password: passwordHash, 
            picturePath, 
            friends, 
            location, 
            occupation,
            viewedProfile: Math.floor(Math.random()*10000),
            impressions: Math.floor(Math.random()*10000),
        })

        const savedUser = await newUser.save();

/*      send the user back status 201(something has been created)
        create a json version of saved user so that frontend can recieve this response
*/
        res.status(201).json(savedUser);
    } catch (err) {
        res.status(500).json({error: err.message })
    }

}


// **************----LOGGING IN USER----**************

const loginController = async (req,res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({email: email});
        if(!user) return res.status(400).json({ msg: "User does not exist!"});

        const isMatch = await bcrypt.compare(password, user.password );
        if(!isMatch) return res.status(400).json({ msg: "Invalid Credentials!"});

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET );
        delete user.password;
        res.status(200).json({ token, user });
    } catch (err) {
        res.status(500).json({error: err.message });
    }
}

module.exports = { registerController, loginController };



