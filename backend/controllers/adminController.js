const Complaint = require("../models/Complaint");
const User = require("../models/User");

// Get All Complaints
exports.getAllComplaints = async (req, res) => {

    try {

        const complaints = await Complaint.find()
            .populate("user", "name email phone")
            .sort({ createdAt: -1 });

        const validComplaints = complaints.filter(complaint => complaint.user);

        const orphanCount = complaints.length - validComplaints.length;

        if (orphanCount > 0) {
            console.warn(`${orphanCount} orphan complaint(s) ignored.`);
        }

        return res.status(200).json({
            success: true,
            complaints: validComplaints
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

// Update Complaint Stauts
exports.updateComplaintStatus = async (req, res) => {

    try {

        const { id } = req.params;

        const { status } = req.body;

        // Check if complaint exists
        const complaint = await Complaint.findById(id);

        if (!complaint) {

            return res.status(404).json({
                success: false,
                message: "Complaint not found"
            });

        }

        // Allowed Status
        const allowedStatus = [
            "Pending",
            "In Progress",
            "Resolved"
        ];

        if (!allowedStatus.includes(status)) {

            return res.status(400).json({
                success: false,
                message: "Invalid Status"
            });

        }

        complaint.status = status;

        await complaint.save();

        return res.status(200).json({

            success: true,

            message: "Complaint status updated successfully",

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


// Reassign Complaint Department
exports.updateComplaintDepartment = async (req, res) => {

    try {

        const { id } = req.params;
        const { assignedDepartment } = req.body;

        // Check if complaint exists
        const complaint = await Complaint.findById(id);

        if (!complaint) {
            return res.status(404).json({
                success: false,
                message: "Complaint not found"
            });
        }

        // Department can only be changed while Pending
        if (complaint.status !== "Pending") {
            return res.status(409).json({
                success: false,
                message: "Department cannot be changed after work has started."
            });
        }

        // Allowed departments
        const allowedDepartments = [
            "Electricity Department",
            "Water Supply Department",
            "Roads & Transport Department",
            "Sanitation Department",
            "IT Department",
            "Public Works Department",
            "Security Department",
            "Administration Department",
            "Support Department",
            "Unassigned"
        ];

        if (!allowedDepartments.includes(assignedDepartment)) {
            return res.status(400).json({
                success: false,
                message: "Invalid department selected."
            });
        }

        // Update department
        complaint.assignedDepartment = assignedDepartment;

        await complaint.save();

        return res.status(200).json({
            success: true,
            message: "Complaint department updated successfully.",
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


// Delete Complaints
exports.deleteComplaint = async (req, res) => {

    try {

        const { id } = req.params;

        const complaint = await Complaint.findById(id);

        if (!complaint) {

            return res.status(404).json({
                success: false,
                message: "Complaint not found"
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


// Get All Users (Admin)
exports.getAllUsers = async (req, res) => {

    try {

        const users = await User.find()
            .select("-password");

        res.status(200).json({

            success: true,
            users

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


// Get Single User (Admin)
exports.getUser = async (req, res) => {

    try {

        const { id } = req.params;

        const user =
            await User.findById(id)
                .select("-password");

        const complaintCount =
            await Complaint.countDocuments({
                user: id
            });

        if (!user) {

            return res.status(404).json({

                success: false,
                message: "User not found"

            });

        }

        res.status(200).json({

            success: true,

            user,

            complaintCount

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


// Delete User (Admin)
exports.deleteUser = async (req, res) => {

    try {

        const { id } = req.params;

        const user =
            await User.findById(id);

        if (!user) {

            return res.status(404).json({

                success: false,
                message: "User not found"

            });

        }

        await Complaint.deleteMany({
            user: id
        });

        await User.findByIdAndDelete(id);

        res.status(200).json({

            success: true,
            message: "User deleted successfully"

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


// Add Progress Update to Complaint (Admin)
exports.addProgressUpdate = async (req, res) => {

    try {

        const { id } = req.params;

        const {
            message,
            estimatedResolutionDate
        } = req.body;

        // Validate progress message
        if (
            typeof message !== "string" ||
            !message.trim()
        ) {
            return res.status(400).json({
                success: false,
                message: "Progress message is required."
            });
        }

        if (message.trim().length > 1000) {
            return res.status(400).json({
                success: false,
                message: "Progress message cannot exceed 1000 characters."
            });
        }

        // Check whether complaint exists
        const complaint = await Complaint.findById(id);

        if (!complaint) {
            return res.status(404).json({
                success: false,
                message: "Complaint not found."
            });
        }

        // Validate optional estimated resolution date
        let resolutionDate = null;

        if (estimatedResolutionDate) {

            resolutionDate = new Date(estimatedResolutionDate);

            if (Number.isNaN(resolutionDate.getTime())) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid estimated resolution date."
                });
            }

            if (resolutionDate.getTime() < Date.now()) {
                return res.status(400).json({
                    success: false,
                    message: "Estimated resolution date cannot be in the past."
                });
            }
        }

        // Add progress update
        complaint.progressUpdates.push({
            message: message.trim(),
            estimatedResolutionDate: resolutionDate,
            updatedBy: req.user.id
        });

        await complaint.save();

        return res.status(201).json({
            success: true,
            message: "Progress update added successfully.",
            progressUpdate: complaint.progressUpdates[
                complaint.progressUpdates.length - 1
            ]
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