const express = require("express");

const router = express.Router();

const { auth } = require("../middleware/authMiddleware");

const complaintController =
    require("../controllers/complaintController");

router.get("/", complaintController.index);

router.post("/", auth, complaintController.create);

//User's own Complaint
router.get("/my", auth, complaintController.myComplaints);

// Track Complaint
router.get("/track/:complaintId", complaintController.trackComplaint);

router.get("/:id", auth, complaintController.show);

router.put("/:id", auth, complaintController.update);

router.delete("/:id", auth, complaintController.destroy);

module.exports = router;