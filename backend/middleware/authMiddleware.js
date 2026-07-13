// Import JWT 
const jwt = require("jsonwebtoken");

const User = require("../models/User");

// Middleware 
exports.auth = async (req, res, next) => {

    try {

        const token =
            req.header("Authorization")?.replace("Bearer ", "");

        if (!token) {

            return res.status(401).json({
                success: false,
                message: "Token Missing"
            });

        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        const user = await User.findById(decoded.id);

        if (!user) {

            return res.status(401).json({
                success: false,
                message: "User no longer exists"
            });

        }

        req.user = decoded;

        next();

    }

    catch (error) {

        return res.status(401).json({
            success: false,
            message: "Invalid Token"
        });

    }

};


// Admin Middleware
exports.isAdmin = (req, res, next) => {

    try {

        if (req.user.role !== "admin") {

            return res.status(403).json({
                success: false,
                message: "Access Denied. Admin Only."
            });

        }

        next();

    }

    catch (error) {

        return res.status(500).json({
            success: false,
            message: "Server Error"
        });

    }

};