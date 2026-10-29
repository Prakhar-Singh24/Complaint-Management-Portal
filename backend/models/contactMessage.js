const mongoose = require("mongoose");

const contactMessageSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            maxlength: 100
        },

        email: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
            maxlength: 254
        },

        subject: {
            type: String,
            required: true,
            trim: true,
            maxlength: 150
        },

        message: {
            type: String,
            required: true,
            trim: true,
            maxlength: 2000
        },

        status: {
            type: String,
            enum: ["Unread", "Read", "Replied"],
            default: "Unread"
        },

        replies: [
            {
                message: {
                    type: String,
                    required: true,
                    trim: true,
                    maxlength: 2000
                },

                sentAt: {
                    type: Date,
                    default: Date.now
                },

                sentBy: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User",
                    required: true
                }
            }
        ]
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model(
    "ContactMessage",
    contactMessageSchema
);