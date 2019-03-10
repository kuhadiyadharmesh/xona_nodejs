// app.js

const express = require('express');
const bodyParser = require('body-parser');
var path = require('path');

const route = require('./routes/route'); // Imports routes for the products
const nroute = require('./routes/nroute');
const app = express();

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    //res.header("Content-Type","Application/json");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept,token"
    );
    next();
});

//app.use(express.static(__dirname + 'public'));
//app.use('/uploads', express.static(__dirname + '/uploads'));
//app.use('/static', express.static('public'));
//app.listen(3000);

// Set up mongoose connection
const mongoose = require('mongoose');
let dev_db_url = 'mongodb://xona_user:X0nA2Mong0@104.211.77.157:27017/xona?authSource=admin';
//let dev_db_url = 'mongodb://root:netdroidtech123@ds147044.mlab.com:47044/xona';
//let dev_db_url = 'mongodb://@localhost:27017/xona';
const mongoDB = process.env.MONGODB_URI || dev_db_url;
mongoose.connect(mongoDB);
mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use('/xona', route);
app.use('/xona_user',nroute);

var publicDir = require('path').join(__dirname,'/public');
app.use(express.static(publicDir));

let port = 82;
app.listen(port, () => {
    console.log('Server is up and running on port numner ' + port);
});