import express from "express";
import User from "../models/userModel.js";
import Post from "../models/postModel.js";
const router = express.Router();
import { hashPassword } from "../helpers/authHelper.js";

//GET all users
router.get("/", async (req, res) => {
    try {
        const { city } = req.query;
        if (city) {
            const cityUsers = await User.find({ city: city });
            res.status(200).json(cityUsers);
        } else {
            const users = await User.find({});
            return res.status(200).json(users);
        }
    } catch (error) {
        console.error(error.stack);
        res.status(500).json({ message: error.message });
    }
});

//GET single user
router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const doc = await User.findById(id).populate({
            path: "city",
            select: "name",
        });

        const user = doc.toObject();
        const posts = await Post.find({ user: doc._id }).select("title");
        user.posts = posts;
        return res.status(200).json(user);
    } catch (error) {
        console.error(error.stack);
        res.status(500).json({ message: error.message });
    }
});

//Patch the user
router.patch("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { password } = req.body;
        //hash nuova password
        if (password) {
            const hashedPassword = await hashPassword(password);
            req.body.password = hashedPassword;
        }

        const user = await User.findByIdAndUpdate({ _id: id }, req.body, {
            new: true,
            runValidators: true,
        });

        if (!user) {
            return res
                .status(404)
                .json({ message: `cant find user with ID ${id}` });
        }
        const updatedUser = await User.findById(id);
        return res.status(200).json(updatedUser);
    } catch (error) {
        console.error(error.stack);
        res.status(500).json({ message: error.message });
    }
});

//DELETE the user
//Delete all the posts as well
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);
        try {
            await Post.deleteMany({ user: user._id });
            await User.findByIdAndDelete(id);
            return res.status(200).json({
                message: `The user ID${id} was erased from database`,
            });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    } catch (error) {
        console.error(error.stack);
        res.status(404).json({ message: `User with ID${id} not found` });
    }
});
export default router;
