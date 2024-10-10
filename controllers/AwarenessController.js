const Awareness = require('../models/Awareness');

// create a new Awarenes
const createAwar = async (req, res) => {
    try{
        const { title, content} = req.body;
        const image = req.file ? req.file.filename : null; 

        const newAwarenes = new Awareness({ title, content,image});
        await newAwarenes.save();

        return res.status(201).json({ message: 'Awarenes created successfully' });
    }catch(error){
        console.error('Error creating Awarenes:', error);
        return res.status(500).json({ message: 'Error creating Awarenes' });
    }
}

// get all Aareness
const getAwareness = async (req, res) => {
    try{
        const AWareness = await Awareness.find();
        return res.status(200).json({
            message: 'Awareness retrieved successfully',
            data: AWareness
        });
    }catch(error){
        console.error('Error getting Awareness:', error);
        return res.status(500).json({ message: 'Error getting Awareness' });
    }
}

// get a single Awarenes
const getAwarenes = async (req, res) => {
    try{
        const { id } = req.params;
        const Awarenes = await Awareness.findById(id);
        if(!Awarenes){
            return res.status(404).json({ message: 'Awarenes not found' });
        }
        return res.status(200).json({
            message: 'Awarenes retrieved successfully',
            data: Awarenes
        });
    }catch(error){
        console.error('Error getting Awareness:', error);
        return res.status(500).json({ message: 'Error getting Awareness' });
    }
}

// edit Awarenes
const editAwarenes = async (req, res) => {
    try{
        const { id } = req.params;
        const { title, content } = req.body;
        const image = req.file ? req.file.filename : null; 

        const Awarenes = await Awareness.findByIdAndUpdate(id, { title, content ,image}, { new: true });
        if(!Awarenes){
            return res.status(404).json({ message: 'Awarenes not found' });
        }
        return res.status(200).json({ message: 'Awarenes updated successfully' });
    }catch(error){
        console.error('Error updating Awarenes:', error);
        return res.status(500).json({ message: 'Error updating Awarenes' });
    }
}


const deleteAwarenes = async (req, res) => {
    try{
        const { id } = req.params;
        const Awarenes = await Awareness.findByIdAndDelete(id);
        if(!Awarenes){
            return res.status(404).json({ message: 'Awarenes not found' });
        }
        return res.status(200).json({ message: 'Awarenes deleted successfully' });
    }catch(error){
        console.error('Error Awarenes prayer:', error);
        return res.status(500).json({ message: 'Error deleting Awarenes' });
    }
}


module.exports = { createAwar, getAwareness, getAwarenes,editAwarenes, deleteAwarenes  };