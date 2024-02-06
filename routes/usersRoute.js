import express from "express";
import User from "../models/userModel.js";
import Post from "../models/postModel.js";
const router = express.Router();

//POST User
router.post("/", async (req, res) => {
    try {
        const { _id } = await User.create(req.body);
        const newUser = await User.findById(_id);
        return res.status(201).json(newUser);
    } catch (error) {
        console.error(error.stack);
        res.status(500).json({ message: error.message });
    }
});

//GET all users
router.get("/", async (req, res) => {
    try {
        const users = await User.find({});
        res.status(200).json(users);
    } catch (error) {
        console.error(error.stack);
        res.status(500).json({ message: error.message });
    }
});

//GET single user
router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);
        res.status(200).json(user);
    } catch (error) {
        console.error(error.stack);
        res.status(500).json({ message: error.message });
    }
});

//Patch the user
router.patch("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByIdAndUpdate(id, req.body);
        if (!user) {
            return res
                .status(404)
                .json({ message: `cant find user with ID ${id}` });
        }
        const updatedUser = await User.findById(id);
        res.status(200).json(updatedUser);
    } catch (error) {
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
            await Post.deleteMany({ username: user.username });
            await User.findByIdAndDelete(id);
            res.status(200).json({
                message: `The user ID${id} was erased from database`,
            });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    } catch (error) {
        res.status(404).json({ message: `User with ID${id} not found` });
    }
});
export default router;
