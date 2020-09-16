const express = require('express');
const app = express();

// Import other packages
const morgan = require('morgan'); // HTTP request logger middleware for node.js
const dotenv = require('dotenv'); // loads environment variables from a .env file into process.env
const mongoose = require('mongoose'); // MongoDB object modeling tool designed to work in an asynchronous environment
const bodyParser = require('body-parser'); // populate the req.body property with the parsed body 
const cookieParser = require('cookie-parser'); // Parse Cookie header and populate req.cookies with an object keyed by the cookie names
const expressValidator = require('express-validator'); // Validator middleware
const fs = require('fs'); // enables interacting with the file system
const cors = require('cors'); // enable CORS

dotenv.config();

mongoose.connect(process.env.MONGO_URI,
    { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('DB connected')
    });
mongoose.connection.on('error', err => {
    console.log(`DB error: ${err.message}`)
});

// Import Routes
const postRoutes = require('./routes/post');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const seriesRoutes = require('./routes/series');
const catRoutes = require('./routes/cat');

// API docs
app.get("/", (req, res) => {
    fs.readFile('./docs/api.json', (err, data) => {
        if(err) {
            res.status(400).json({
                error: err
            })
        }
        const docs = JSON.parse(data);
        res.json(docs);
    });
});

// Middleware
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(expressValidator());
app.use(cors());
app.use("/", postRoutes);
app.use("/", authRoutes);
app.use("/", userRoutes);
app.use("/", seriesRoutes);
app.use("/", catRoutes);

app.use(function (err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
      res.status(401).json({error: 'Unauthorized!'});
    }
  });

//Server
const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log('Api listening....')
});