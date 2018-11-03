'use strict';
var express = require('express');
var exception = require('./middlewares/exception');
var bodyParser = require('body-parser');

var app = express();
var port = process.env.PORT || 1337;

var home = require('./routes/home');
var auth = require('./routes/auth');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))

app.use('/', home);
app.use('/auth', auth);

app.use(exception.setmiddleware);

app.listen(port, function () {
    console.log("server is started !");
});
