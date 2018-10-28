'use strict';
const express = require('express');
const router = express.Router();
const log = require('../services/logservice');

router.get('/', function (req, res) {
    log.Debug('àaf');
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end('<center><b>Order King Server v1.0</b></center>');
    
});

module.exports = router;