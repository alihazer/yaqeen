const { default: mongoose } = require("mongoose");
const Prayer = require("../models/Prayer.js");


// create a new prayer
const createPrayer = async (req, res) => {
    try{
        const { title, description, audio, speaker } = req.body;
        const newPrayer = new Prayer({ title, description, audio, speaker });
        await newPrayer.save();
        return res.status(201).json({ message: 'Prayer created successfully' });
    }catch(error){
        console.error('Error creating prayer:', error);
        return res.status(500).json({ message: 'Error creating prayer' });
    }
}

// get all prayers
const getPrayers = async (req, res) => {
    try{
        const prayers = await Prayer.find();
        return res.status(200).json({
            message: 'Prayers retrieved successfully',
            data: prayers
        });
    }catch(error){
        console.error('Error getting prayers:', error);
        return res.status(500).json({ message: 'Error getting prayers' });
    }
}

// get a single prayer
const getPrayer = async (req, res) => {
    try{
        const { id } = req.params;
        console.log(id);
        const prayer = await Prayer.findById(id);
        if(!prayer){
            return res.status(404).json({ message: 'Prayer not found' });
        }
        return res.status(200).json({
            message: 'Prayer retrieved successfully',
            data: prayer
        });
    }catch(error){
        console.error('Error getting prayer:', error);
        return res.status(500).json({ message: 'Error getting prayer' });
    }
}

// edit prayer
const editPrayer = async (req, res) => {
    try{
        const { id } = req.params;
        const { title, description, audio, speaker } = req.body;
        const prayer = await Prayer.findByIdAndUpdate(id, { title, description, audio, speaker }, { new: true });
        if(!prayer){
            return res.status(404).json({ message: 'Prayer not found' });
        }
        return res.status(200).json({ message: 'Prayer updated successfully' });
    }catch(error){
        console.error('Error updating prayer:', error);
        return res.status(500).json({ message: 'Error updating prayer' });
    }
}


const deletePrayer = async (req, res) => {
    try{
        const { id } = req.params;
        const prayer = await Prayer.findByIdAndDelete(id);
        if(!prayer){
            return res.status(404).json({ message: 'Prayer not found' });
        }
        return res.status(200).json({ message: 'Prayer deleted successfully' });
    }catch(error){
        console.error('Error deleting prayer:', error);
        return res.status(500).json({ message: 'Error deleting prayer' });
    }
}


module.exports = { createPrayer, getPrayers, getPrayer, editPrayer, deletePrayer };