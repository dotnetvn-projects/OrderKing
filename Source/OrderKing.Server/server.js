'use strict';
var express = require('express');
var errorCatcher = require('./middlewares/middleware.error.catcher');
var validateRequest = require('./middlewares/middleware.request.validate');
var bodyParser = require('body-parser');

var app = express();
var port = process.env.PORT || 1337;

var homeApi = require('./routes/route.api.home');
var authApi = require('./routes/route.api.auth');
var catalogApi = require('./routes/route.api.catalog');
var orderApi = require('./routes/route.api.order');
var reportApi = require('./routes/route.api.report');
var storeApi = require('./routes/route.api.store');

//apply default middleware for body message format
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//in development mode, please comment out validateRequest middleware
app.use(validateRequest.setmiddleware);

//route api
app.use('/', homeApi);
app.use('/api/auth', authApi);
app.use('/api/catalog', catalogApi);
app.use('/api/order', orderApi);
app.use('/api/report', reportApi);
app.use('/api/store', storeApi);

//in development mode, please comment out errorCatcher middleware
app.use(errorCatcher.setmiddleware);

//Start listening connection from remote client
app.listen(port, function () {
    console.log("server is started !");
});