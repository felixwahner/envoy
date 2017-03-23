var url = require('url');

// this is Express middleware
module.exports = function() {
  // intercept each request
  return function(req, res, next) {
    var setHeaderIfUndefined = function(header) {
        if(res.get(header.key) === undefined) {
            res.set(header.key, header.value);
        }
    }
    // if the user-agent supplied an origin header (like a browser)
    if (req.headers.origin) {
      var parsed = url.parse(req.headers.origin);
      var headers = [{
        key : 'Access-Control-Allow-Credentials',
        value: 'true'
      },{
        key : 'Access-Control-Allow-Origin',
        value: parsed.protocol + '//' + parsed.host
      },{
        key: 'Access-Control-Allow-Headers',
        value: req.headers['access-control-request-headers']
      }];
      // check if the headers are already set by another middleware
      headers.forEach(setHeaderIfUndefined);
    }

    // continue to the next route handler
    next();
  };
};
