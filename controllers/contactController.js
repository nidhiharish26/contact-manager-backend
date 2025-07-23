const Contact = require("../models/contact");
const { validationResult } = require("express-validator");

// GET /api/contacts?page=1&limit=10// GET /api/contacts?page=1&limit=10&search=abc&sort=name
const getContacts = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "", sort, favorite } = req.query;
    const skip = (page - 1) * limit;

    const query = {
      userId: req.userId,
      $or: [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
      ],
    };

    if (favorite === "true") {
      query.favorite = true;
    }

    let sortOption = { name: 1 }; // default: A-Z
    if (sort === "createdAt") sortOption = { createdAt: 1 };
    else if (sort === "-createdAt") sortOption = { createdAt: -1 };

    const contacts = await Contact.find(query)
      .skip(skip)
      .limit(limit)
      .sort(sortOption);

    const total = await Contact.countDocuments(query);
    const totalPages = Math.ceil(total / limit);

    res.json({
      contacts,
      total,
      page: parseInt(page),
      totalPages,
    });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// POST /api/contacts
const createContact = async (req, res) => {
  try {
    const { name, email, phone, favorite } = req.body;

    const contact = new Contact({
      userId: req.userId,
      name,
      email,
      phone,
      favorite,
    });

    await contact.save();
    res.status(201).json({ contact });
  } catch (err) {
    console.error("Error in createContact:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// @desc    Delete a contact
// @route   DELETE /api/contacts/:id
// @access  Public
const deleteContact = async (req, res) => {
  try {
    const contact = await Contact.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!contact) {
      return res
        .status(404)
        .json({ error: "Contact not found or unauthorized" });
    }

    res.json({ message: "Contact deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// @desc    Update a contact
// @route   PUT /api/contacts/:id
// @access  Public
const updateContact = async (req, res) => {
  try {
    const contact = await Contact.findOne({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!contact) {
      return res
        .status(404)
        .json({ error: "Contact not found or unauthorized" });
    }

    const { name, email, phone, favorite } = req.body;

    contact.name = name;
    contact.email = email;
    contact.phone = phone;
    contact.favorite = favorite;

    await contact.save();

    res.json({ message: "Contact updated successfully", contact });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

const toggleFavorite = async (req, res) => {
  try {
    const contact = await Contact.findOne({
      _id: req.params.id,
      user: req.userId, // ensure user owns this contact
    });

    if (!contact) {
      return res.status(404).json({ message: "Contact not found" });
    }

    contact.favorite = !contact.favorite;
    await contact.save();

    res.status(200).json({ message: "Favorite status updated", contact });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getContacts,
  createContact,
  deleteContact,
  updateContact,
  toggleFavorite,
};
