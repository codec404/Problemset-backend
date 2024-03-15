import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import { connectDb } from "./config/db.js";
import morgan from "morgan";
import session from "express-session";

dotenv.config();
connectDb();

// Google imports
import passport from "passport";
import strategy from "passport-google-oauth20";
const GoogleStrategy = strategy.Strategy;
const client_id = process.env.GOOGLE_CLIENT_ID;
const client_secret = process.env.GOOGLE_CLIENT_SECRET;

const app = express();

//MIDDLEWARES
app.use(express.json());
app.use(cors());
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
        
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`You are listening at port number ${process.env.PORT}`);
});
