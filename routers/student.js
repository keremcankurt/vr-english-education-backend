const express = require("express");
const {
  checkUserExists,
  checkTeacherExists,
} = require("../middlewares/database/databaseErrorHelpers");
const { addCourse, addGame, addExam, getStudents } = require("../controllers/student");

const router = express.Router();

//ADD
router.post("/add-course", [checkUserExists],addCourse);
router.post("/add-game", [checkUserExists],addGame);
router.post("/add-exam", [checkUserExists],addExam);

//GET
router.get("/students",checkTeacherExists, getStudents)

module.exports = router;
