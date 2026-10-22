// Import 
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


// Register
exports.register = async (req, res) => {

    try {

        const { name, email, phone, password } = req.body;

        if (!name || !email || !phone || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }


        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                field: "email",
                message: "Email is already registered."
            });
        }

        const existingPhone = await User.findOne({ phone });

        if (existingPhone) {
            return res.status(409).json({
                success: false,
                field: "phone",
                message: "This mobile number is already registered."
            });
        }


        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            phone,
            password: hashedPassword
        });

        return res.status(201).json({
            success: true,
            message: "Registration successful",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role
            }
        });

    }


    catch (error) {

        console.log(error);

        if (error.code === 11000) {
            const field = Object.keys(error.keyPattern || {})[0];

            return res.status(409).json({
                success: false,
                field: field || "phone",
                message: field === "email"
                    ? "Email is already registered."
                    : "This mobile number is already registered."
            });
        }

        return res.status(500).json({
            success: false,
            message: "Server Error"
        });

    }


};


// Login 

exports.login = async (req, res) => {
    
    try {
        const { identifier, password } = req.body;

        if (!identifier || !password) {
            return res.status(400).json({
                success: false,
                message: "Email or mobile number and password are required"
            });
       
        }

        const value = identifier.trim();

        // Check whether the input is an email or mobile number
        const isEmail = value.includes("@");

        const user = await User.findOne(
            isEmail
                ? { email: value }
                : { phone: value }
        );

        if (!user) {
       
            return res.status(401).json({
                success: false,
                field: "identifier",
                message: "No account found with this email or mobile number"
            });
       
        }

        const isMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!isMatch) {
       
            return res.status(401).json({
                success: false,
                field: "password",
                message: "Incorrect password"
            });
       
        }

        const token = jwt.sign(
            
            {
                id: user._id,
                role: user.role
            },
            
            process.env.JWT_SECRET,
            
            {
                expiresIn: "1d"
            }

        );

        return res.status(200).json({
            
            success: true,
            message: "Login successful",
            token,

            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role
            }

        });

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Server Error"
        });

    }

};



// Forgot Password
exports.forgotPassword = async (req, res) => {

    try {

        const { email, password } = req.body;

        const user =
            await User.findOne({ email });

        if (!user) {

            return res.status(404).json({

                success: false,

                message: "No account found with this email."

            });

        }

        const hashedPassword =
            await bcrypt.hash(password, 10);

        user.password =
            hashedPassword;

        await user.save();

        return res.status(200).json({

            success: true,

            message: "Password updated successfully."

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