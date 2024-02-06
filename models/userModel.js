import mongoose from "mongoose";
const { Schema, model } = mongoose;

const UserSchema = new Schema(
    {
        username: {
            type: String,
            required: [true, `You must insert a username`],
            unique: true,
        },
        profile_img: {
            type: String,
        },
        from_city: {
            type: String,
            maxLength: 28,
            mixLength: 2,
            required: [true, `You must insert your city of origin`],
        },
        age: {
            type: Number,
            max: 100,
            min: 18,
            required: [true, `You must insert your age`],
        },
        bio: {
            type: String,
            trim: true,
            maxLength: 200,
            mixLength: 10,
            required: [true, `You must insert a bio`],
        },
    },
    {
        timestamps: true,
    }
);

const User = model("User", UserSchema);

export default User;
