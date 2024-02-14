import mongoose from "mongoose";
const { Schema, SchemaTypes, model } = mongoose;

const PostSchema = new Schema(
    {
        title: {
            type: String,
            required: [true, `You must insert the title`],
            minLength: 5,
            maxLength: 50,
        },
        post: {
            type: String,
            required: [true, `You must insert your post`],
            minLength: 50,
        },
        city: {
            type: String,
            required: [true, `You must insert the city`],
        },
        img: {
            type: String,
            required: [true, `You must insert an image`],
        },
        user: {
            // only if the user exist
            type: SchemaTypes.ObjectId,
            ref: "User",
            required: [true, `You must insert a user Author`],
            // validate: {
            //     validator: async function (value) {
            //         const user = await model("User").findOne({
            //             username: value,
            //         });
            //         return user !== null;
            //     },
            //     message: "User does not exist",
            // },
        },
    },
    {
        timestamps: true,
    }
);
// PostSchema.pre("save", function (next) {
//     this.city = this.city.toLowerCase();
//     // this.username = this.username.toLowerCase();
//     next();
// });
const Post = model("Post", PostSchema);

export default Post;
