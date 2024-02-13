import mongoose from "mongoose";
const { Schema, model } = mongoose;
import validator from "validator";
const { isStrongPassword, isEmail } = validator;

const validPassword = {
    minLength: 8,
    minLoweCase: 1,
    minUpperCase: 1,
    minNumbers: 1,
    minSymbols: 1,
};

const UserSchema = new Schema(
    {
        username: {
            type: String,
            required: [true, `You must insert a username`],
            unique: true,
        },
        email: {
            type: String,
            required: [true, `You must insert an email`],
            unique: true,
        },
        password: {
            type: String,
            required: [true, `You must insert an password`],
        },
        profile_img: {
            type: String,
            default: "",
        },
        from_city: {
            type: String,
            maxLength: 28,
            minLength: 2,
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
            minLength: 10,
            required: [true, `You must insert a bio`],
        },
    },
    {
        timestamps: true,
    }
);
UserSchema.statics.signUpControl = async function (email, password, username) {
    if (!isEmail(email)) {
        const error = new Error(`Please use a valid email for authentication.`);
        error.status = 400;
        throw error;
    }

    if (!isStrongPassword(password)) {
        const error = new Error(`Your password is not strong enough.`);
        error.status = 400;
        throw error;
    }

    const usedEmail = await this.exists({ email });
    const usedUsername = await this.exists({ username });

    if (usedEmail) {
        const error = new Error(`Please use a valid email for authentication.`);
        error.status = 400;
        throw error;
    }
    if (usedUsername) {
        const error = new Error(`Your password is not strong enough.`);
        error.status = 400;
        throw error;
    }
};

UserSchema.statics.logInControl = async function (email) {
    const user = await this.findOne({ email: email });
    if (!user) {
        const error = new Error("The email or password entered is incorrect.");
        error.status = 400;
        throw error;
    }

    if (!user.password) {
        const error = new Error("The user password is missing.");
        error.status = 500;
        throw error;
    }

    return user;
};

// UserSchema.pre("save", function (next) {
//     this.username = this.username.toLowerCase();
//     next();
// });

const User = model("User", UserSchema);

export default User;
