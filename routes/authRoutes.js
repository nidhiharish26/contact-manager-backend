const express = require("express");
const { body } = require("express-validator");
const { registerUser, loginUser } = require("../controllers/authController");
const validate = require("../middleware/validate");

const router = express.Router();

// Validation for register and login
const authValidation = [
  body("email").isEmail().withMessage("Invalid email"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
];

// Register
router.post("/register", [
  body("username").notEmpty().withMessage("Username is required"),
  ...authValidation,
  validate,
  registerUser,
]);

// Login
router.post("/login", authValidation, validate, loginUser);

module.exports = router;
