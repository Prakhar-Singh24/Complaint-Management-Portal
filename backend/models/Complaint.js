const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema({

    complaintId: {
        type: String,
        required: true,
        unique: true
    },

    user: {

        type: mongoose.Schema.Types.ObjectId,

        ref: "User",

        required: true

    },

    title: {

        type: String,

        required: true,

        trim: true

    },

    category: {

        type: String,

        required: true

    },

    assignedDepartment: {

        type: String,

        default: "Unassigned",

        trim: true

    },

    description: {

        type: String,

        required: true

    },

    status: {

        type: String,

        enum: [
            "Pending",
            "In Progress",
            "Resolved"
        ],

        default: "Pending"

    },

    progressUpdates: [
        {
            message: {
                type: String,
                required: true,
                trim: true,
                maxlength: 1000
            },

            estimatedResolutionDate: {
                type: Date,
                default: null
            },

            updatedBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                required: true
            },

            createdAt: {
                type: Date,
                default: Date.now
            }
        }
    ]

}, {

    timestamps: true

});

module.exports =
    mongoose.model(
        "Complaint",
        complaintSchema
    );