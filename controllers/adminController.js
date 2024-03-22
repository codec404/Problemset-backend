import questions from "../models/questions.js";

export const createProblemController = async (req, res) => {
  try {
    const name = req.body.problemName;
    const existing_problem = await questions.findOne({ problemName: name });
    if (existing_problem) {
      return res.status(401).send({
        success: false,
        message: "Problem exists with the same name",
      });
    }
    const question = new questions(req.body);
    await question.save();
    return res.status(200).send({
      success: true,
      message: "Successfully created the problem",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Something went wrong",
    });
  }
};

export const getAllProblemsController = async (req, res) => {
  try {
    const problems = await questions.find({});
    return res.status(200).send({
      success: true,
      message: "Successfully got the problems",
      problems,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Something went wrong",
    });
  }
};

export const getProblemById = async (req, res) => {
  try {
    const { id } = req.params;
    const problem = await questions.findOne({ _id: id });
    if (problem) {
      return res.status(200).send({
        success: true,
        message: "Fetched Successfully",
        problem,
      });
    } else {
      return res.status(404).send({
        success: false,
        message: "Couldn't find problem",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Something went wrong!!!",
    });
  }
};
