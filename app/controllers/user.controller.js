const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
const authConfig = require('../config/auth.config');

// Generate JWT token
const generateToken = (user) => {
    return jwt.sign({ id: user._id }, authConfig.secret, {
        expiresIn: authConfig.expiresIn
    });
};

// Register a new user
exports.register = async (req, res) => {
    try {
        const { name, email, password, address, bio, profilePicture } = req.body;

        // Check if user with email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User with this email already exists' });
        }

        // Create a new user
        const user = new User({
            name,
            email,
            password,
            address,
            bio: bio || '',
            profilePicture: profilePicture || ''
        });

        await user.save();

        // Create token
        const token = generateToken(user);

        // Return user data (excluding password)
        const userData = {
            _id: user._id,
            name: user.name,
            email: user.email,
            address: user.address,
            bio: user.bio,
            profilePicture: user.profilePicture,
            createdAt: user.createdAt
        };

        res.status(201).json({
            message: 'User registered successfully',
            token,
            user: userData
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Login user
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Check password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Create token
        const token = generateToken(user);

        // Return user data (excluding password)
        const userData = {
            _id: user._id,
            name: user.name,
            email: user.email,
            address: user.address,
            bio: user.bio,
            profilePicture: user.profilePicture,
            createdAt: user.createdAt
        };

        res.json({
            message: 'Login successful',
            token,
            user: userData
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get user profile
exports.getProfile = async (req, res) => {
    try {
        // User is already available from auth middleware
        res.json({
            message: 'Profile retrieved successfully',
            user: req.user
        });
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Update user profile
exports.updateProfile = async (req, res) => {
    try {
        const { name, address, bio, profilePicture } = req.body;
        const userId = req.user._id;

        // Find user by ID and update
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            {
                $set: {
                    name: name || req.user.name,
                    address: address || req.user.address,
                    bio: bio !== undefined ? bio : req.user.bio,
                    profilePicture: profilePicture !== undefined ? profilePicture : req.user.profilePicture
                }
            },
            { new: true }
        ).select('-password');

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({
            message: 'Profile updated successfully',
            user: updatedUser
        });
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}; 