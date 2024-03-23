import express from "express";
import {
  createProblemController,
  deleteProblemController,
  getAllProblemsController,
  getProblemById,
  updateProblemController,
} from "../controllers/adminController.js";

const router = express.Router();

router.post("/create-problem", createProblemController);
router.get("/problems", getAllProblemsController);
router.get("/problem/:id", getProblemById);
router.put("/problem/:id",updateProblemController)
router.delete("/problem/:id",deleteProblemController)

export default router;
