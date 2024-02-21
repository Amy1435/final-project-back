import express from "express";
const router = express.Router();
import User from "../models/userModel.js";
import City from "../models/cityModel.js";
import { hashPassword, comparePassword } from "../helpers/authHelper.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
const { PEPPER_KEY, SECRET_KEY } = process.env;

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
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json("You must insert email or password");
        }

        const user = await User.logInControl(email);
        await comparePassword(password, user.password);

        //generate token
        // const token = jwt.sign({ id: user._id }, SECRET_KEY, {
        //     expiresIn: "1d",
        // });

        return res.status(202).json(user);
    } catch (error) {
        console.error(error);
        res.status(error.status || 500).json(error.message || error);
    }
});

export default router;
