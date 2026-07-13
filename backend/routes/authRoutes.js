const express = require("express");

const router = express.Router();

const {
    register,
    login,
    forgotPassword
} = require("../controllers/authController");

const { auth } = require("../middleware/authMiddleware");

router.post("/register", register);

router.post("/login", login);

router.put("/forgot-password", forgotPassword);

//Test Protected Routes
router.get("/test", auth, (req, res) => {

    res.status(200).json({
        success: true,
        message: "Protected Route Accessed Successfully",
        user: req.user
    });

});

module.exports = router;