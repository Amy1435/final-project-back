import express from "express";
const router = express.Router();
import User from "../models/userModel.js";
import bcrypt from "bcrypt";

// //SIGN UP
router.post("/sign-up", async (req, res) => {
    try {
        if (!req.body.email || !req.body.password || !req.body.username) {
            return res
                .status(400)
                .json("You must insert email, password, and username");
        }

        await User.signUpControl(
            req.body.email,
            req.body.password,
            req.body.username
        );

        //salt and pepper
        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(req.body.password, salt);

        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPass,
        });

        const { _id } = await User.create(newUser);
        const user = await User.findById(_id);
        return res.status(201).json(user);
    } catch (error) {
        console.error(error);
        //fai vedere anche queli di signupcontrol
        res.status(error.status || 500).json(error.message || error);
    }
});

//LOGIN
router.post("/log-in", async (req, res) => {
    try {
        if (!req.body.email || !req.body.password) {
            return res.status(400).json("You must insert email or password");
        }
        const user = await User.logInControl(req.body.email, req.body.password);

        //compara passwords
        const isValidPass = await bcrypt.compare(
            req.body.password,
            user.password
        );
        if (!isValidPass) {
            return res.status(401).json("wrong email or password");
        }

        return res.status(202).json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json(error);
    }
});

export default router;
