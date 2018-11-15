'use strict';
const express = require('express');
const router = express.Router();

router.get('/', function (req, res) {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end('<center><b>Order King Server v1.0</b></center>');   
});

module.exports = router;