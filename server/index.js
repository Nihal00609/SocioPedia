const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const multer = require('multer');
const helmet = require('helmet');
const morgan = require('morgan');

// Properly set the paths when we configure directories...
const path = require("path");
const { fileURLToPath } = require("url"); 
const { registerController } = require('./controllers/auth');
const authRoutes = require('./routes/authRoutes');
const postRoutes = require('./routes/postRoutes');
const userRoutes = require('./routes/userRoutes');
const verifyToken = require('./middleware/authorization');
const { createPostController } = require('./controllers/postController');
const User = require('./models/User');
const Post = require('./models/PostModel');
const { users, posts } = require('./data/index');

const { GridFsStorage } = require('multer-gridfs-storage');

// CONFIGURATION

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin"}));
app.use(morgan("common"));
app.use(bodyParser.json({ limit : "30mb", extended : true }));
app.use(bodyParser.urlencoded({ limit : "30mb", extended : true }));

//  Cross origin resource sharing policy
app.use(cors());

/* set the directory of where we keep our assets(eg. images that we store), 
we're going to store this locally , 
so this will set the directory of where we keep our ASSETS in(which we'll store locally)
in real live production app we would want to store in actual storagefile directory or cloud storage.
*/
app.use("/assets", express.static(path.join(__dirname, 'public/assets')));


// Create a storage object with a given configuration
// const storage = new GridFsStorage({
//     url: 'mongodb://yourhost:27017/database', // Your MongoDB connection URL
// });

// -*--------------FILE STORAGE-----------------*-
/* configuration from package instructions... this is how you save your files... 
    Anytime someone uploads a file onto your website... 
    then its going to say destination its going to be saved into this particular folder(public/assets)
*/
const storage = multer.diskStorage({
    destination : function(req, file, cb){
        cb(null, "public/assets");
    },
    filename : function(req, file, cb){
        cb(null, file.originalname);
    },

})

// Set multer storage engine to the newly created object
/* Anytime we're going to upload a file by using this variable */
const upload = multer({ storage });

//  ************************---ROUTES WITH FILES----***********************
/*  
    upload our picture locally into public/assets folder and 
    this is what called middleware because its in between and occurs before our actual logic.
*/
app.post('/auth/register', upload.single("picture"), registerController);
// To allow the user to upload a picture.
app.post("/posts", verifyToken, upload.single("picture"), createPostController)

// **********----ROUTES----***********
app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/posts", postRoutes);

//Static Files
// app.use(express.static(path.join(__dirname, '../client/build')))

// app.get('*', function (req,res) { 
//     res.sendFile(path.join(__dirname, "../client/build/index.html"))
//  })

// **************MONGOOSE SETUP*************
const PORT = process.env.PORT || 6001;
mongoose.connect(process.env.MONGO_URL, {
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
}).then(() => {
    app.listen(PORT, () => console.log(`Server Port: ${PORT}`));

    /* Manually injecting the data information .Add this DATA only one time. Then COMMENT OUT */
    // User.insertMany(users);
    // Post.insertMany(posts);

}).catch((error) => console.log(`${error} Did Not Connect`));

/*
// Upload your files as usual
app.post('/profile', upload.single('avatar'), (req, res, next) => {
    // Handle the uploaded file
    // ...
});

app.post('/photos/upload', upload.array('photos', 12), (req, res, next) => {
    // Handle multiple uploaded files
    // ...
});

app.post('/cool-profile', upload.fields([
    { name: 'avatar', maxCount: 1 },
    { name: 'gallery', maxCount: 8 }
]), (req, res, next) => {
    // Handle different fields with different max counts
    // ...
});

// Start your Express server
app.listen(PORT, () => {
    console.log('Server running on port 3000');
});
*/