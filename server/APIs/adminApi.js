require('dotenv').config();
const express = require('express');
const bcrypt = require('bcryptjs');
const Admin = require('../models/adminModel');
const UserAuthor=require('../models/userAuthorModel.js')

const adminApp = express.Router();

// Admin Login or Registration
adminApp.post('/admin', async (req, res) => {
    try {
        const { email, password, firstName, lastName, profileImageUrl } = req.body;
        const role = 'admin';
        const adminSecretPassword = process.env.ADMIN_SECRET_PASSWORD;

        if (!adminSecretPassword) {
            return res.status(500).json({ message: "Admin secret password not set" });
        }

        // Ensure the email is not present in the UserAuthor collection
        const userExists = await UserAuthor.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "This email is already registered as a User or Author" });
        }

        // Check if admin already exists
        let adminInDb = await Admin.findOne({ email });

        if (adminInDb) {
            return res.status(200).json({ message: "Admin exists", payload: adminInDb });
        }

        if (password !== adminSecretPassword) {
            return res.status(403).json({ message: "Invalid admin password" });
        }

        const newAdmin = new Admin({ role, firstName, lastName, email, profileImageUrl });

        await newAdmin.save();
        res.status(201).json({ message: "Admin created", payload: newAdmin });

    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
});

// Get all users
adminApp.get('/users', async (req, res) => {
    try {
        const users = await UserAuthor.find();
        console.log("Fetched Users:", users); // ✅ Debugging Line
        res.status(200).json({ message: "Users found", payload: users });
    } catch (error) {
        console.error("Error in /users:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
});


// Toggle user block/unblock status
adminApp.put('/users/:email', async (req, res) => {
    try {
        const { email } = req.params;
        const { isActive } = req.body;

        if (typeof isActive !== "boolean") {
            return res.status(400).json({ message: "Invalid isActive value" });
        }

        const updatedUser = await UserAuthor.findOneAndUpdate(
            { email: email },
            { isActive },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "User status updated", payload: updatedUser });

    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
});

module.exports = adminApp;
