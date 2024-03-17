import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import { connectDb } from "./config/db.js";
import morgan from "morgan";
import session from "express-session";
import jwt from "jsonwebtoken";
import { LocalStorage } from "node-localstorage";

dotenv.config();
connectDb();

// Google imports
import passport from "passport";
import strategy from "passport-google-oauth2";
import users from "./models/users.js";
import { client_id, client_secret } from "./passwords.js";
const GoogleStrategy = strategy.Strategy;
const localStorage = new LocalStorage("./scratch");

const app = express();

//MIDDLEWARES
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(morgan("dev"));
app.use("/api/v1/auth", authRoutes);

//setup session
app.use(
  session({
    secret: process.env.SESSION_SECRET.toString(),
    resave: false,
    saveUninitialized: true,
  })
);

//Google Oauth
app.use(passport.initialize());
app.use(passport.session());

passport.use(
  new GoogleStrategy(
    {
      clientID: client_id,
      clientSecret: client_secret,
      callbackURL: "/auth/google/callback",
      scope: ["profile", "email"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // console.log(profile);
        let user = await users.findOne({ googleId: profile.id });
        if (!user) {
          user = await users.findOne({ email: profile.emails[0].value });
          user.googleId = profile.id;
          user.save();
        }
        if (!user) {
          user = new users({
            googleId: profile.id,
            username: profile.displayName,
            email: profile.emails[0].value,
            password: process.env.DEMO.toString(),
          });
          await user.save();
        }
        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((user, done) => {
  done(null, user);
});

app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    successRedirect: "http://localhost:5173/",
    failureRedirect: "http://localhost:5173/login",
  })
);

app.get("/login/success", async (req, res) => {
  try {
    // console.log("user:", req.user);
    if (req.user) {
      const token = jwt.sign({ userId: req.user._id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });
      return res.status(200).send({
        success: true,
        message: "Welcome",
        user: req.user,
        token,
      });
    } else {
      return res.status(400).send({
        success: true,
        message: "Not Logged in",
      });
    }
  } catch (error) {
    console.log(error);
  }
});

app.get("/googleLogout", async (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.status(200).send({
      success: true,
      message: "Logged out Successfully!!!",
    });
  });
});

const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`You are listening at port number ${process.env.PORT}`);
});
