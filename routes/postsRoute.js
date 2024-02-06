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
        const posts = await Post.find({});
        res.status(200).json(posts);
    } catch (error) {
        console.error(error.stack);
        res.status(500).json({ message: error.message });
    }
});

//GET single post
router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const post = await Post.findById(id);
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
        const post = await Post.findByIdAndUpdate(id, req.body);
        if (!post) {
            return res
                .status(404)
                .json({ message: `cant find Post with ID ${id}` });
        }
        const updatedPost = await Post.findById(id);
        res.status(200).json(updatedPost);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

//DELETE the post
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        await Post.findByIdAndDelete(id);
        res.status(200).json({
            message: `The Post ID${id} was erased from database`,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
export default router;
