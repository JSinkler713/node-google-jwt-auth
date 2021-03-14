require('dotenv').config()
const express = require('express')
const passport = require('passport')
const logger = require('morgan')
const cors = require('cors')
const app = express()

app.use(cors())
app.use(logger("dev"))
app.use(express.json())
app.use(express.urlencoded({ extended: false }));

app.use(passport.initialize())
require('./config/passport-google');

/* GET home page. */
app.get("/", function(req, res, next) {
	res.json({ title: "Express" });
});

/* GET Google Authentication API. */
app.get("/auth/google",	passport.authenticate("google", { scope: ["profile", "email"] }));

app.get("/auth/google/callback", passport.authenticate("google", { failureRedirect: "/", session: false }), function(req, res) {
    console.log('this is the callback')
  console.log(req)
    const token = req.user.token;
    console.log(token)
    // res.json({ incallback: "I am ffrom the callback" })
    res.redirect("http://localhost:3000?token=" + token);
  }
);

app.get("/profile", passport.authenticate("google", { scope: ["profile", "email"], failureRedirect: '/login' }), (req, res)=> {
  console.log('in the profile')
  console.log(req)
  console.log('req.user')
  console.log(req.user)
  res.json(req.user)
})

app.listen(8000, console.log('listening on port 8000'))
