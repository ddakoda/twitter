var express = require('express');
var Twitter = require('node-twitter-api');
var config = require('config');
var twitterCredentials = config.get('Twitter');
var app = express();

app.set('view engine', 'ejs');

var twitter = new Twitter({
  consumerKey: twitterCredentials.consumerKey,
  consumerSecret: twitterCredentials.consumerSecret,
  callback: twitterCredentials.callback
});

var _secret;

app.get('/', function(req, res) {
  res.render('index');
});

app.get("/request-token", function(req, res) {
    twitter.getRequestToken(function(err, token, secret) {
        if (err) {
            res.render(error);
        } else {
            _secret = secret;
            res.redirect("https://api.twitter.com/oauth/authenticate?oauth_token=" + token);
        }
    });
});

app.get("/exchange-token", function(req, res) {
  var token = req.query.oauth_token,
  verifier = req.query.oauth_verifier;
  twitter.getAccessToken(token, _secret, verifier, function(err, token, secret) {
    if (err) {
      res.render(error);
    } else {
      twitter.verifyCredentials(token, secret, function(err, user) {
        if (err) {
          res.render(error);
        } else {
          res.render('authenticated', {user: user})
        }
      });
    }
  });
});

app.listen(3000, function() {
  console.log("listening");
});
