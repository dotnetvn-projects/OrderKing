'use strict';
var express = require('express');
var app = express();
var port = process.env.PORT || 1337;

var home = require('./routes/home');
var auth = require('./routes/auth');

app.use('/', home);
app.use('/auth', auth);

app.listen(port, function () {
    console.log("server is started !");
});
