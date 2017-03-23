var url = require('url');

// this is Express middleware
module.exports = function() {

  // intercept each request
  return function(req, res, next) {

    // if the user-agent supplied an origin header (like a browser)
    if (req.headers.origin) {

      // send CORS HTTP headers
      var parsed = url.parse(req.headers.origin);
      if(res.get('Access-Control-Allow-Credentials') === undefined) {
        res.set('Access-Control-Allow-Credentials', 'true');
      }
      if(res.get('Access-Control-Allow-Origin') === undefined) {
        res.set('Access-Control-Allow-Origin',
                    parsed.protocol + '//' + parsed.host);
      }
      if(res.get('Access-Control-Allow-Headers') === undefined) {
        res.set('Access-Control-Allow-Headers',
                    req.headers['access-control-request-headers']);
      }
    }

    // continue to the next route handler
    next();
  };

};
