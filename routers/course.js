const express = require("express");
const {
  checkUserExists,
} = require("../middlewares/database/databaseErrorHelpers");
const { course, studentCourse } = require("../controllers/course");

const router = express.Router();

router.post("/:content",checkUserExists,course);


module.exports = router;
