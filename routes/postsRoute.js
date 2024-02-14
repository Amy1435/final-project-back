import express from "express";
import Post from "../models/postModel.js";
const router = express.Router();

//POST post
router.post("/", async (req, res) => {
    try {
        const { _id } = await Post.create(req.body);
        const newPost = await Post.findById(_id);
        return res.status(201).json(newPost);
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
            const userPosts = await Post.find({ user });
            // .populate({
            //     path: "user",
            //     select: "from_city username",
            // });
            res.status(200).json(userPosts);
        } else if (city) {
            const userPosts = await Post.find({ city }).populate({
                path: "user",
                select: "from_city username",
            });
            res.status(200).json(userPosts);
        } else {
            const posts = await Post.find({}).populate({
                path: "user",
                select: "from_city username",
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
        // console.log("Received ID:", id);
        const post = await Post.findById(id).populate({
            path: "user",
            select: "from_city username",
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
router.patch("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const post = await Post.findById(id);
        if (!post) {
            return res
                .status(404)
                .json({ message: `cant find Post with ID ${id}` });
        }
        if (post.username === req.body.username) {
            try {
                const updatedPost = await Post.findByIdAndUpdate(id, req.body);
                const newPost = await Post.findById(id);
                res.status(200).json(newPost);
            } catch (error) {
                res.status(500).json({ message: error.message });
            }
        } else {
            res.status(401).json(`you can modify only your posts`);
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

//DELETE the post
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const post = await Post.findById(id);
        try {
            await Post.findByIdAndDelete(id);
            res.status(200).json({
                message: `The Post ID${id} was erased from database`,
            });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
export default router;
