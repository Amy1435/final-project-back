import mongoose from "mongoose";
const { Schema, SchemaTypes, model } = mongoose;

const PostSchema = new Schema(
    {
        title: {
            type: String,
            required: [true, `You must insert the title`],
            minLength: 5,
            maxLength: 100,
        },
        post: {
            type: String,
            required: [true, `You must insert your post`],
            minLength: 50,
        },
        city: {
            type: SchemaTypes.ObjectId,
            ref: "City",
            required: [true, `You must insert the city`],
        },
        img: {
            type: String,
            required: [true, `You must insert an image`],
        },
        user: {
            type: SchemaTypes.ObjectId,
            ref: "User",
            required: [true, `You must insert a user Author`],
        },
    },
    {
        timestamps: true,
    }
);

const Post = model("Post", PostSchema);

export default Post;
