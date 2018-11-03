'use strict';
var express = require('express');
var errorCatcher = require('./middlewares/error-catcher');
var validateRequest = require('./middlewares/validate-request');
var bodyParser = require('body-parser');

var app = express();
var port = process.env.PORT || 1337;

var home = require('./routes/home');
var auth = require('./routes/auth');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//in development, please comment out validateRequest middleware
app.use(validateRequest.setmiddleware);

app.use('/', home);
app.use('/auth', auth);

//in development, please comment out errorCatcher middleware
app.use(errorCatcher.setmiddleware);

app.listen(port, function () {
    console.log("server is started !");
});
