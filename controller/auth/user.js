const User = require("../../models/auth/user");
const bcrypt = require("bcryptjs");

exports.Signup = async (req, res) => {
    try {
        const { username, email, password, role } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ success: false, message: "User already exists" });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const user = new User({ username, email, password: hashedPassword, role });
        await user.save();
        const userWithoutPassword = user.toObject();
        delete userWithoutPassword.password;
        res.status(201).json({ success: true, message: "User created successfully", user: userWithoutPassword });
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

exports.Signin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }
        const userWithoutPassword = user.toObject();
        delete userWithoutPassword.password;
        res.status(200).json({ success: true, message: "User logged in successfully", user: userWithoutPassword });
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

exports.GetAllUsers = async (req, res) => {
    try {
        const users = (await User.find()).map((user) => {
            const { password, ...userWithoutPassword } = user.toObject();
            return userWithoutPassword;
        });
        res.status(200).json({ success: true, users });
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal server error" });
    }  
}

exports.GetUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);    
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        const { password, ...userWithoutPassword } = user.toObject();
        res.status(200).json({ success: true, user: userWithoutPassword });
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

exports.UpdateUser = async (req, res) => {
    try {
        const { username, email, role } = req.body;
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        const updatedUser = await User.findByIdAndUpdate(req.params.id, { username, email, role }, { new: true });
        const { password, ...userWithoutPassword } = updatedUser.toObject();
        res.status(200).json({ success: true, user: userWithoutPassword });
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}
