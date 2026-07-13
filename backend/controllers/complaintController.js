const mongoose = require("mongoose");

const Complaint = require("../models/Complaint");

// My Complaints
exports.myComplaints = async (req, res) => {

    try {

        const complaints = await Complaint.find({
            user: req.user.id
        }).sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            complaints
        });

    }

    catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Server Error"
        });

    }

};

exports.index = (req, res) => {

    res.send("Get All Complaints");

};


// Create Complaints
exports.create = async (req, res) => {

    try {

        const {

            title,

            category,

            description

        } = req.body;

        const now = new Date();

        const datePart =
            String(now.getDate()).padStart(2, "0") +
            String(now.getMonth() + 1).padStart(2, "0") +
            String(now.getFullYear()).slice(-2);

        const lastComplaint =
            await Complaint.findOne({

                complaintId: {
                    $regex: `^CMP${datePart}`
                }

            }).sort({
                complaintId: -1
            });

        let complaintNumber = 1;

        if (lastComplaint) {

            complaintNumber =
                parseInt(
                    lastComplaint.complaintId.slice(-3)
                ) + 1;

        }

        const complaintId =
            `CMP${datePart}${String(complaintNumber).padStart(3, "0")}`;

        const complaint = await Complaint.create({

            complaintId,

            user: req.user.id,

            title,

            category,

            description

        });

        res.status(201).json({

            success: true,

            message: "Complaint submitted successfully.",

            complaint

        });

    }

    catch (error) {

        console.log(error);

        res.status(500).json({

            success: false,

            message: "Server Error"

        });

    }

};


// Show
exports.show = async (req, res) => {

    try {

        const { id } = req.params;

        // Check if ObjectId is valid
        if (!mongoose.Types.ObjectId.isValid(id)) {

            return res.status(400).json({
                success: false,
                message: "Invalid Complaint ID"
            });

        }

        const complaint = await Complaint.findById(id)
            .populate("user", "name email phone");

        if (!complaint) {

            return res.status(404).json({
                success: false,
                message: "Complaint not found"
            });

        }

        return res.status(200).json({
            success: true,
            complaint
        });

    }

    catch (error) {

        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Server Error"
        });

    }

};


//Update
exports.update = async (req, res) => {

    try {

        const { id } = req.params;

        const {
            title,
            category,
            description
        } = req.body;

        const complaint = await Complaint.findById(id);

        if (!complaint) {

            return res.status(404).json({
                success: false,
                message: "Complaint not found"
            });

        }

        // Owner check
        if (complaint.user.toString() !== req.user.id) {

            return res.status(403).json({
                success: false,
                message: "Access Denied"
            });

        }

        complaint.title = title || complaint.title;
        complaint.category = category || complaint.category;
        complaint.description = description || complaint.description;

        await complaint.save();

        return res.status(200).json({

            success: true,
            message: "Complaint updated successfully",

            complaint

        });

    }

    catch (error) {

        console.log(error);

        return res.status(500).json({

            success: false,
            message: "Server Error"

        });

    }

};


// Delete 
exports.destroy = async (req, res) => {

    try {

        const { id } = req.params;

        // Find Complaint
        const complaint = await Complaint.findById(id);

        if (!complaint) {

            return res.status(404).json({
                success: false,
                message: "Complaint not found"
            });

        }

        // Owner Check
        if (complaint.user.toString() !== req.user.id) {

            return res.status(403).json({
                success: false,
                message: "Access Denied"
            });

        }

        await complaint.deleteOne();

        return res.status(200).json({

            success: true,
            message: "Complaint deleted successfully"

        });

    }

    catch (error) {

        console.log(error);

        return res.status(500).json({

            success: false,
            message: "Server Error"

        });

    }

};


// Track Complaint using Complaint ID
exports.trackComplaint = async (req, res) => {

    try {

        const { complaintId } = req.params;

        const complaint = await Complaint.findOne({ complaintId });

        if (!complaint) {

            return res.status(404).json({
                success: false,
                message: "Complaint not found"
            });

        }

        res.status(200).json({
            success: true,
            complaint
        });

    }

    catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            message: "Server Error"
        });

    }

};