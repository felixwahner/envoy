'use strict';

var express = require('express'),
  router = express.Router(),
  app = require('../../app'),
  access = require('../access'),
  utils = require('../utils'),
  auth = require('../auth');

// Authenticated request to /db/_find
// The user posts their query to /db/_find.
// We modify their query so that it only
// includes their documents.
router.post('/' + app.dbName + '/_find', auth.isAuthenticated, function(req, res) {
  
  // Authenticate the documents requested
  var body = req.body;
  
  // merge the user-supplied query with a search for this user's docs
  if (body && body.selector) {
    var filter = { 
      $and: [
        { 
          '_id':  { '$regex': '^' + access.addOwnerId('', req.session.user.name) }
        },
        body.selector
      ]
    };
    body.selector = filter;
  }

  app.db.find(body)
    .pipe(utils.liner())
    .pipe(access.authRemover(req.session.user.name))
    .pipe(res);

});

module.exports = router;
