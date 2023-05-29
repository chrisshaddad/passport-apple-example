const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const passport = require("passport");
const AppleStrategy = require("passport-apple");
const fs = require("fs");
const https = require("https");

const APPLE_STRATEGY_VALUES = {
  clientID: "",
  teamID: "",
  callbackURL: "",
  keyID: "",
  privateKeyLocation: "",
};

app.get("/", (req, res) => {
  res.send('<a href="/login">Sign in with Apple</a>');
});

app.use(passport.initialize());
app.use(passport.session());

app.use(bodyParser.urlencoded({ extended: true }));

passport.serializeUser(function (user, cb) {
  cb(null, user);
});

passport.deserializeUser(function (obj, cb) {
  cb(null, obj);
});

passport.use(
  new AppleStrategy(APPLE_STRATEGY_VALUES, function (
    req,
    accessToken,
    refreshToken,
    idToken,
    profile,
    cb
  ) {
    // Here, check if the idToken.sub exists in your database!
    if (req.body && req.body.user) {
      // Register your user here!
      console.log(req.body.user);
    }
    cb(null, idToken);
  })
);

app.get("/login", passport.authenticate("apple"));
app.post("/auth/apple/callback", function (req, res, next) {
  passport.authenticate("apple", function (err, user, info) {
    if (err) {
      if (err == "AuthorizationError") {
        res.send(
          'Oops! Looks like you didn\'t allow the app to proceed. Please sign in again! <br /> \
				<a href="/login">Sign in with Apple</a>'
        );
      } else if (err == "TokenError") {
        res.send(
          "Oops! Couldn't get a valid token from Apple's servers! <br /> \
				<a href=\"/login\">Sign in with Apple</a>"
        );
      } else {
        res.send(err);
      }
    } else {
      if (req.body.user) {
        res.json({
          user: req.body.user,
          idToken: user,
        });
      } else {
        res.json(user);
      }
    }
  })(req, res, next);
});

https
  .createServer(
    {
      key: fs.readFileSync("./localhost.key"),
      cert: fs.readFileSync("./localhost.crt"),
    },
    app
  )
  .listen(3000, () => {
    console.log("server is runing at port 3000");
  });
