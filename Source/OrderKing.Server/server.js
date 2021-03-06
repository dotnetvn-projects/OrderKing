'use strict';
var express = require('express');
var errorCatcher = require('./middlewares/middleware.error.catcher');
var cors = require('cors');
var validateRequest = require('./middlewares/middleware.request.validate');
var cronJob = require('./services/service.cronjob');
var bodyParser = require('body-parser');

var app = express();
var port = process.env.PORT || 1337;

var homeApi = require('./routes/api.public/route.api.home');
var authApi = require('./routes/route.api.auth');
var catalogApi = require('./routes/api.public/route.api.catalog');
var orderApi = require('./routes/api.public/route.api.order');
var reportApi = require('./routes/api.public/route.api.report');
var storeApi = require('./routes/api.public/route.api.store');
var userApi = require('./routes/api.public/route.api.user');
var paymentApi = require('./routes/api.public/route.api.payment');
var auditApi = require('./routes/api.public/route.api.audit');
var sysNotifyApi = require('./routes/api.public/route.api.sysnotify');

//apply default middleware for body message format
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

//in development mode, please comment out validateRequest middleware
app.use(validateRequest.setmiddleware);

//route api
app.use('/', homeApi);
app.use('/api/public/auth', authApi);
app.use('/api/public/catalog', catalogApi);
app.use('/api/public/order', orderApi);
app.use('/api/public/report', reportApi);
app.use('/api/public/store', storeApi);
app.use('/api/public/user', userApi);
app.use('/api/public/payment', paymentApi);
app.use('/api/public/audit', auditApi);
app.use('/api/public/sysnotify', sysNotifyApi);

//in development mode, please comment out errorCatcher middleware
app.use(errorCatcher.setmiddleware);

app.set('title', 'Order King Server v1.0');
//Start listening connection from remote client
app.listen(port, function () {
    cronJob.updateTokenStatusJob();
    console.log("server is started !, host : http://localhost:" + port);
    console.log("Press Ctrl + C to stop server !");
});
