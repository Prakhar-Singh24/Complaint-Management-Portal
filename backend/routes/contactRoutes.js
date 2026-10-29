const express = require("express");
const router = express.Router();

const contactController = require("../controllers/contactController");
const { auth, isAdmin } = require("../middleware/authMiddleware");

// Public route: Submit a contact message
router.post(
    "/",
    contactController.submitContactMessage
);

// Admin route: Get all contact messages
router.get(
    "/admin/messages",
    auth,
    isAdmin,
    contactController.getContactMessages
);

// Admin route: Get unread message count
router.get(
    "/admin/unread-count",
    auth,
    isAdmin,
    contactController.getUnreadMessageCount
);

// Admin route: Get one contact message
router.get(
    "/admin/messages/:id",
    auth,
    isAdmin,
    contactController.getContactMessageById
);

// Admin route: Delete a contact message
router.delete(
    "/admin/messages/:id",
    auth,
    isAdmin,
    contactController.deleteContactMessage
);

module.exports = router;