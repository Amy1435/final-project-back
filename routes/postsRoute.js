import express from "express";
import Post from "../models/postModel.js";
import { controlAuthorization } from "../helpers/authHelper.js";
const router = express.Router();

//POST post
router.post("/", controlAuthorization, async (req, res) => {
    const postUser = req.body.user;
    console.log(`postuser` + postUser);
    console.log(req.user._id);
    try {
        if (req.user._id === postUser) {
            const { _id } = await Post.create(req.body);
            const newPost = await Post.findById(_id);
            return res.status(201).json(newPost);
        } else {
            res.status(401).json(`Request not authorized`);
        }
    } catch (error) {
        console.error(error.stack);
        res.status(500).json({ message: error.message });
    }
});

//GET all post
router.get("/", async (req, res) => {
    try {
        const { user, city } = req.query;

        if (user) {
            const userPosts = await Post.find({ user }).populate({
                path: "city",
                select: "name",
            });
            if (userPosts.length === 0) {
                res.status(404).json({ message: "No posts found" });
            } else {
                res.status(200).json(userPosts);
            }
        } else if (city) {
            const usersPosts = await Post.find({ city }).populate({
                path: "user",
                select: "city username",
            });
            if (usersPosts.length === 0) {
                res.status(404).json({ message: "No posts found" });
            } else {
                res.status(200).json(usersPosts);
            }
        } else {
            const posts = await Post.find({})
                .populate({
                    path: "user",
                    select: "username city",
                })
                .populate({
                    path: "city",
                    select: "name",
                });
            res.status(200).json(posts);
        }
    } catch (error) {
        console.error(error.stack);
        res.status(500).json({ message: error.message });
    }
});

//GET single post
router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const post = await Post.findById(id)
            .populate({
                path: "user",
                select: "city username",
            })
            .populate({
                path: "city",
                select: "name",
            });

        if (!post) {
            return res
                .status(404)
                .json({ message: `Post with ID ${id} not found` });
        }
        res.status(200).json(post);
    } catch (error) {
        console.error(error.stack);
        res.status(500).json({ message: error.message });
    }
});

//Patch the post
router.patch("/:id", controlAuthorization, async (req, res) => {
    try {
        const { id } = req.params;
        const post = await Post.findById(id);
        if (!post) {
            return res
                .status(404)
                .json({ message: `Cant find Post with ID ${id}` });
        }
        console.log(req.user._id);
        console.log(post.user.toString());
        if (req.user._id === post.user.toString()) {
            try {
                const updatedPost = await Post.findByIdAndUpdate(id, req.body);
                const newPost = await Post.findById(id);
                res.status(200).json(newPost);
            } catch (error) {
                res.status(500).json({ message: error.message });
            }
        } else {
            res.status(401).json(`Request not authorized`);
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

//DELETE the post
router.delete("/:id", controlAuthorization, async (req, res) => {
    try {
        const { id } = req.params;
        const post = await Post.findById(id);
        console.log(req.user._id);
        console.log(post.user.toString());
        if (req.user._id === post.user.toString()) {
            try {
                await Post.findByIdAndDelete(id);
                res.status(200).json({
                    message: `The Post ID${id} was erased from database`,
                });
            } catch (error) {
                res.status(500).json({ message: error.message });
            }
        } else {
            res.status(401).json(`Request not authorized`);
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
export default router;
