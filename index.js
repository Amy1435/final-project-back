import mongoose from "mongoose";
import express from "express";
import morgan from "morgan";
import cors from "cors";
import usersRoute from "./routes/usersRoute.js";
import postsRoute from "./routes/postsRoute.js";
import dotenv from "dotenv";
dotenv.config();
const { MONGODB_URI } = process.env;
const PORT = process.env.PORT || 3000;

//CONFIGURATIONS
const app = express();
app.use(express.json());
app.use(cors({ origin: "*" }));
app.use(morgan("dev"));

//ROUTES

app.use("/users", usersRoute);
app.use("/posts", postsRoute);
//SERVER
mongoose
    .connect(MONGODB_URI)
    .then(() => {
        console.log(`Connected to MongoDb`);
        app.listen(PORT, () => {
            console.log(`Server on port ${PORT}`);
        });
    })
    .catch((err) => console.log(err));
