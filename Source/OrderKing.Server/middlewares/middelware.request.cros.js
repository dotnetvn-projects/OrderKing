//allow cross
var allowCrosRequest = async (req, res, next) => {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
   // res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');

   // res.setHeader('Access-Control-Expose-Headers', 'referer, apikey');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
   // res.setHeader('Access-Control-Allow-Credentials', true);


    // Request methods you wish to allow
   // req.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
   // req.s('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Referer, Apikey');

    // Set to true if you need the website to include cookies in the requests sent

    // Pass to next layer of middleware
    next();
};

exports.setmiddleware = allowCrosRequest;