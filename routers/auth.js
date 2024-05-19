const express = require("express");
const {
  checkUserExists,
} = require("../middlewares/database/databaseErrorHelpers");
const { login, register } = require("../controllers/auht");

const router = express.Router();

router.post("/register", register);
router.post(
  "/login",
  [checkUserExists],
  login
);
module.exports = router;
