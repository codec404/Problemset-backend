import express from "express";
import {
  registerController,
  loginController,
  currentUserController,
  forgotPasswordController,
} from "../controllers/authControllers.js";
import { authMiddleWare } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerController);
router.post("/login", loginController);

// FORGOT USER
router.post("/forgot-password",forgotPasswordController)

//GET USER
router.get("/current-user", authMiddleWare, currentUserController);

export default router;
