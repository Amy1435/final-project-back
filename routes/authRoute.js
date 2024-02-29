import express from "express";
const router = express.Router();
import User from "../models/userModel.js";
import {
    hashPassword,
    comparePassword,
    createToken,
} from "../helpers/authHelper.js";
import dotenv from "dotenv";
dotenv.config();

// //SIGN UP
router.post("/sign-up", async (req, res) => {
    try {
        const { email, password, username, profile_img, city, age, bio } =
            req.body;
        if (!email || !password || !username) {
            return res
                .status(400)
                .json("You must insert email, password, and username");
        }

        await User.signUpControl(email, password, username);

        const newUser = new User({
            username: username,
            email: email,
            password: await hashPassword(password),
            profile_img: profile_img,
            city: city,
            age: age,
            bio: bio,
        });

        //create token
        const token = createToken(newUser._id);

        const { _id } = await User.create(newUser);
        const user = await User.findById(_id);

        return res.status(201).json({ user, token });
    } catch (error) {
        console.error(error);
        //fai vedere anche queli di signupcontrol
        res.status(error.status || 500).json(error.message || error);
    }
});

//LOGIN
router.post("/log-in", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json("You must insert email or password");
        }

        const user = await User.logInControl(email);
        await comparePassword(password, user.password);
        //create token
        const token = createToken(user._id);
        return res.status(202).json({ user, token });
    } catch (error) {
        console.error(error);
        res.status(error.status || 500).json(error.message || error);
    }
});

export default router;
