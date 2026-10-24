const express = require("express");

const router = express.Router();

const {
    auth,
    isAdmin
} = require("../middleware/authMiddleware");

const adminController =
    require("../controllers/adminController");

// Get All Complaints
router.get(
    "/complaints",
    auth,
    isAdmin,
    adminController.getAllComplaints
);

// Update Complaint Status
router.put(
    "/complaints/:id/status",
    auth,
    isAdmin,
    adminController.updateComplaintStatus
);

// Update Complaint Department
router.put(
    "/complaints/:id/department",
    auth,
    isAdmin,
    adminController.updateComplaintDepartment
);

// Update Progress Comment
router.post(
    "/complaints/:id/progress",
    auth,
    isAdmin,
    adminController.addProgressUpdate
);

// Delete Complaint
router.delete(
    "/complaints/:id",
    auth,
    isAdmin,
    adminController.deleteComplaint
);

// Get All Users
router.get(
    "/users",
    auth,
    isAdmin,
    adminController.getAllUsers
);

// Get Single User
router.get(
    "/users/:id",
    auth,
    isAdmin,
    adminController.getUser
);

// Delete User
router.delete(
    "/users/:id",
    auth,
    isAdmin,
    adminController.deleteUser
);

module.exports = router;