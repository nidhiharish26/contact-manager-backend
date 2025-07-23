const express = require("express");
const { body, query } = require("express-validator");
const {
  getContacts,
  createContact,
  updateContact,
  deleteContact,
  toggleFavorite,
} = require("../controllers/contactController");
const validate = require("../middleware/validate");
const auth = require("../middleware/authMiddleware");

const router = express.Router();

// Validation middleware
const contactValidation = [
  body("name").notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Invalid email"),
  body("phone")
    .isLength({ min: 10, max: 10 })
    .withMessage("Phone number must be 10 digits"),
];

// Query param validation for GET /contacts?page=1&limit=10
const paginationValidation = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer"),
  query("limit")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Limit must be a positive integer"),
];

// Apply validation to routes
router.get("/", auth, paginationValidation, validate, getContacts);
router.post("/", auth, contactValidation, validate, createContact);
// PUT - Update contact by ID with validation
router.put(
  "/:id",
  auth,
  contactValidation, // reuse the same validation middleware
  validate, // middleware to handle validation errors
  updateContact
);
router.delete("/:id", auth, deleteContact);
router.patch("/:id/favorite", auth, toggleFavorite);
router.put("/:id/favorite", auth, toggleFavorite); // optional

module.exports = router;
