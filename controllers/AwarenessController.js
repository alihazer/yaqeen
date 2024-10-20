const Awareness = require('../models/Awareness');
const notification = require('../models/notification');
const Token = require('../models/token');
const admin = require('firebase-admin');
const notificaion = require('../models/notification')

// create a new Awarenes
const createAwar = async (req, res) => {
    try{
        const { title, content} = req.body;
        const image = req.file ? `/images/${req.file.filename}` : null;
        const newAwarenes = new Awareness({ title, content,image});

        // send notificaion
        await newAwarenes.save();

        // Fetch all active tokens from the database
      const tokens = await Token.find({ isActive: true }).select('token -_id');
      if (tokens.length > 0) {
        const tokensArray = tokens.map(token => token.token);

        // Prepare the message payload
        const message = {
          notification: {
            title: title,
            body: content.split(' ').slice(0, 20).join(' ') + '...',
          },
          data: {
            title: title,
          },
          tokens: tokensArray,
        };

        // Send notification to all tokens
        const response = await admin.messaging().sendEachForMulticast(message);
        const notification1 = await notification.create({ title, message:content, totalSent: tokensArray.length, totalDelivered: response.successCount ,totalFailed: response.failureCount });
        return res.status(201).json({
          status: true,
          message: 'Awar created successfully and notification sent.',
        });
      } else {
        console.log('No active tokens available to send notifications.');
        return res.status(200).json({
          status: false,
          message: 'No active tokens available.',
        });
      }
    }catch(error){
        console.error('Error creating Awarenes:', error);
        return res.status(500).json({ message: 'Error creating Awarenes' });
    }
}

// get all Aareness
const getAwareness = async (req, res) => {
    try{
        const AWareness = await Awareness.find().sort({ createdAt: -1 });
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
        const image = req.file ? `/images/${req.file.filename}` : null;

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