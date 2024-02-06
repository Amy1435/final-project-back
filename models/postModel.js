import mongoose from "mongoose";
const { Schema, model } = mongoose;

const PostSchema = new Schema(
    {
        title: {
            type: String,
            required: [true, `You must insert the title`],
            minLength: 5,
            maxLength: 30,
        },
        post: {
            type: String,
            required: [true, `You must insert your post`],
            minLength: 50,
            maxLength: 1000,
        },
        city: {
            type: String,
            required: [true, `You must insert the city`],
        },
        img: {
            type: String,
            required: [true, `You must insert an img`],
        },
        username: {
            //only if the user exist
            type: String,
            required: [true, `You must insert a user Author`],
            validate: {
                validator: async function (value) {
                    const user = await model("User").findOne({
                        username: value,
                    });
                    return user !== null;
                },
                message: "User does not exist",
            },
        },
    },
    {
        timestamps: true,
    }
);

const Post = model("Post", PostSchema);

export default Post;
