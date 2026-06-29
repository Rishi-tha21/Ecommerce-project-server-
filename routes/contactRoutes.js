const express = require("express");
const router = express.Router();
const {
  submitContact,
  getContacts,
  getContactById,
  updateContactStatus,
} = require("../controllers/contactController");
const { protect, admin } = require("../middleware/auth");

router.post("/", submitContact);
router.get("/", protect, admin, getContacts);
router.get("/:id", protect, admin, getContactById);
router.put("/:id/status", protect, admin, updateContactStatus);

module.exports = router;
