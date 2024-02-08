import mongoose from "mongoose";
const { Schema, model } = mongoose;

const citySchema = new Schema({
    name: {
        type: String,
        required: [true, `You must insert the name of the city`],
        minLength: 2,
        maxLength: 21,
    },
    country: {
        type: String,
        require: true,
        maxLength: 21,
        required: [true, `You must insert the name of the country`],
    },
    continent: {
        type: String,
        require: true,
        minLength: 5,
        maxLength: 10,
        required: [true, `You must insert the name of the continent`],
    },
    city_population: {
        type: Number,
        required: [true, `You must insert the population number of the city`],
    },
    img_url: {
        type: String,
        require: true,
        required: [true, `You must insert an image of the city`],
    },
    internet_speed: {
        type: Number,
        required: [true, `You must insert the internet speed`],
    },
    sefety_level: {
        type: Number,
        required: [true, `You must insert safety speed`], //! What is safety speed? 120mph?!
    },
    avarage_salary: {
        type: Number,
        required: [true, `You must insert the average salary`],
    },
});

const City = model("City", citySchema);

export default City;
