import passport from "passport";
import Strategy from "passport-google-oauth20";
const GoogleStrategy = Strategy.Strategy;
import dotenv from "dotenv"
dotenv.config()

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:8080/api/v1/sessions/oauth/google",
      passReqToCallback: true,
    },
    function (accessToken, refreshToken, profile, cb) {
      //   User.findOrCreate({ googleId: profile.id }, function (err, user) {
      //     return cb(err, user);
      //   });
      cb(null, profile);
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user,done) => {
    done(null,user)
})