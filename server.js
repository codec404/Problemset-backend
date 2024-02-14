import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import { connectDb } from "./config/db.js";
import morgan from "morgan";
import "./config/oauth.js";
import passport from "passport";

dotenv.config();
connectDb();

const app = express();

//MIDDLEWARES
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));
app.use("/api/v1/auth", authRoutes);

// GOOGLE LOGIN
app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile'] }));

app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });

const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`You are listening at port number ${process.env.PORT}`);
});
