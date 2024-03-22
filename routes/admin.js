import express from "express";
import {
  createProblemController,
  getAllProblemsController,
  getProblemById,
} from "../controllers/adminController.js";

const router = express.Router();

router.post("/create-problem", createProblemController);
router.get("/problems", getAllProblemsController);
router.get("/problem/:id", getProblemById);

export default router;
