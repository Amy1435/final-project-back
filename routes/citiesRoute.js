import express from "express";
import City from "../models/cityModel.js";

const router = express.Router();

//POST city
router.post("/", async (req, res) => {
    try {
        const { _id } = await City.create(req.body);
        const newCity = await City.findById(_id);
        res.status(201).json(newCity);
    } catch (error) {
        console.error(error.stack);
        res.status(500).json({ message: error.message });
    }
});

//GET all cities
router.get("/", async (req, res) => {
    try {
        const cities = await City.find({});
        res.status(200).json(cities);
    } catch (error) {
        console.error(error.stack);
        res.status(500).json({ message: error.message });
    }
});

//GET single city
router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const city = await City.findById(id);
        res.status(200).json(city);
    } catch (error) {
        console.error(error.stack);
        res.status(500).json({ message: error.message });
    }
});

//Patch the city
router.patch("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const city = await City.findByIdAndUpdate(id, req.body);
        if (!city) {
            return res
                .status(404)
                .json({ message: `cant find City with ID ${id}` });
        }
        const updatedCity = await City.findById(id);
        res.status(200).json(updatedCity);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

//DELETE city
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        await City.findById(id);
        try {
            await City.findByIdAndDelete(id);
            res.status(200).json({
                message: `The City ID${id} was erased from database`,
            });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    } catch (error) {
        res.status(404).json({ message: `City with ID${id} not found` });
    }
});

export default router;
