const User = require('../model/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const registerUser = async (req, res) => {
    try {
        const { email, password, name } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "User already exists" });
        }
        
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ email, password: hashedPassword, name });

        // Generate token for automatic login
        const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d' });

        // Don't send password in response
        const userResponse = {
            id: user._id,
            email: user.email,
            name: user.name,
            isAdmin: user.isAdmin || false
        };

        res.status(201).json({ message: "User registered successfully", token, user: userResponse });
    } catch (error) {
        res.status(400).json({ message: "Error registering user", error: error.message });
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d' });
        
        // Don't send password in response
        const userResponse = {
            id: user._id,
            email: user.email,
            name: user.name,
            isAdmin: user.isAdmin || false
        };
        
        res.status(200).json({ message: "Login successful", token, user: userResponse });
        
    } catch (error) {
        res.status(500).json({ message: "Error during login", error: error.message });
    }
};

module.exports = { registerUser, loginUser };