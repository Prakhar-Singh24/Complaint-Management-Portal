const mongoose = require("mongoose");

const ContactMessage = require("../models/contactMessage");

exports.submitContactMessage = async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;

        // Validate required fields
        if (
            typeof name !== "string" ||
            typeof email !== "string" ||
            typeof subject !== "string" ||
            typeof message !== "string" ||
            !name.trim() ||
            !email.trim() ||
            !subject.trim() ||
            !message.trim()
        ) {
            return res.status(400).json({
                success: false,
                message: "All fields are required."
            });
        }

        // Validate field lengths
        if (
            name.trim().length > 100 ||
            email.trim().length > 254 ||
            subject.trim().length > 150 ||
            message.trim().length > 2000
        ) {
            return res.status(400).json({
                success: false,
                message: "One or more fields exceed the allowed length."
            });
        }

        // Basic email format validation
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(email.trim())) {
            return res.status(400).json({
                success: false,
                message: "Please enter a valid email address."
            });
        }

        // Save message to MongoDB
        const contactMessage = await ContactMessage.create({
            name: name.trim(),
            email: email.trim().toLowerCase(),
            subject: subject.trim(),
            message: message.trim()
        });

        return res.status(201).json({
            success: true,
            message: "Your message has been sent successfully.",
            contactMessageId: contactMessage._id
        });

    } catch (error) {
        console.error("Contact message submission error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to submit your message. Please try again later."
        });
    }
};


// Get all contact messages
exports.getContactMessages = async (req, res) => {
    try {
        const messages = await ContactMessage.find()
            .sort({ createdAt: -1 })
            .select("name email subject status createdAt");

        return res.status(200).json({
            success: true,
            messages
        });

    } catch (error) {
        console.error("Fetch contact messages error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to fetch contact messages."
        });
    }
};


// Get unread message count
exports.getUnreadMessageCount = async (req, res) => {
    try {
        const count = await ContactMessage.countDocuments({
            status: "Unread"
        });

        return res.status(200).json({
            success: true,
            count
        });

    } catch (error) {
        console.error("Unread message count error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to fetch unread message count."
        });
    }
};


// Get one contact message and mark it as read
exports.getContactMessageById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid message ID."
            });
        }

        const contactMessage = await ContactMessage.findByIdAndUpdate(
            id,
            { $set: { status: "Read" } },
            { returnDocument: "after" }
        );

        if (!contactMessage) {
            return res.status(404).json({
                success: false,
                message: "Contact message not found."
            });
        }

        return res.status(200).json({
            success: true,
            contactMessage
        });

    } catch (error) {
        console.error("Fetch contact message error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to fetch contact message."
        });
    }
};


// Delete a contact message
exports.deleteContactMessage = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid message ID."
            });
        }

        const contactMessage = await ContactMessage.findByIdAndDelete(id);

        if (!contactMessage) {
            return res.status(404).json({
                success: false,
                message: "Contact message not found."
            });
        }

        return res.status(200).json({
            success: true,
            message: "Contact message deleted successfully."
        });

    } catch (error) {
        console.error("Delete contact message error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to delete contact message."
        });
    }
};