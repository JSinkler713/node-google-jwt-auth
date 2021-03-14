const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy
const db = require('../models')

passport.serializeUser((user,done)=> {
  done(null, user)
})
passport.deserializeUser((user,done)=> {
  done(null, user)
})

passport.use(
  new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: 'http://localhost:8000/auth/google/callback'
    //this is where google responds to?
  },
    async (accessToken, refreshToken, profile, done)=> {
      const userData = {
        email: profile.emails[0].value,
        name: profile.displayName,
        token: accessToken,
        refreshToken: refreshToken //we want this only gets sent on first attempt
      };
      const foundUser = await db.User.findOne({email: userData})
      if (!foundUser) {
        // we got back validated data from google can safely save a new user
        const newUser = await db.User.create(userData)
        done(null, newUser)
        //sign JWT
      } else {
        //might want to update refreshToken
        //might want to change to pass the user from the db back
        done(null, foundUser)
        //there was a user
        //check the tokens are up to date,
        //sign a jwt and pass it through
      }
      // this is what it was
      //done(null, userData)
    }
  )
)
