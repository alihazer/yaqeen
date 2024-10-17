const News = require('../models/News');
const admin = require('firebase-admin');
const Token = require('../models/token');

// Get all news
const getNews = async (req, res) => {
  try {
    const news = await News.find().sort({ createdAt: -1 });
    res.status(200).json({
      status: true,
      data: news
    });
  } catch (err) {
    return res.status(500).json({
      "error": "Server error",
      "message": err?.message
    })
  }
};

const getNewById = async (req, res) => {
  try {
    const news = await News.findById(req.params.id);
    if(!news){
      return res.status(404).json({
        status: false,
        message: 'News not found'
      });
    }
    res.status(200).json({
      status: true,
      data: news
    });
  } catch (err) {
    return res.status(500).json({
      "error": "Server error",
      "message": err?.message
    })
  }
}

// Create a new news entry
const createNews = async (req, res) => {
  const { title, content, source } = req.body;
  if (!title || !content || !source) {
    return res.status(400).json({ message: 'Please provide all required fields' });
  }

  // Create a new news document
  try {
    const newNews = await News.create({ title, content, source });

    if (newNews) {
      console.log('News created successfully:', newNews);

      // Fetch all active tokens from the database
      const tokens = await Token.find({ isActive: true }).select('token -_id');
      if (tokens.length > 0) {
        const tokensArray = tokens.map(token => token.token);

        // Prepare the message payload
        const message = {
          notification: {
            title: title,
            body: content.split(' ').slice(0, 10).join(' ') + '...',
          },
          data: {
            title: title,
          },
          tokens: tokensArray,
        };

        // Send notification to all tokens
        const response = await admin.messaging().sendEachForMulticast(message);
        console.log('Notification sent successfully:', response);
        console.log(response.responses);

        // Check for failures
        if (response.failureCount > 0) {
          response.responses.forEach((result, index) => {
            if (result.error) {
              console.error(`Error sending notification to ${tokensArray[index]}: ${result.error.message}`);
              console.error(`Error details: ${JSON.stringify(result.error, null, 2)}`);  // Log full error details
            }
          });
        }

        return res.status(201).json({
          status: true,
          message: 'News created successfully and notification sent.',
        });
      } else {
        console.log('No active tokens available to send notifications.');
        return res.status(200).json({
          status: false,
          message: 'No active tokens available.',
        });
      }
    } else {
      return res.status(400).json({
        status: false,
        message: 'Failed to create news.',
      });
    }
  } catch (error) {
    console.error('Error creating news or sending notification:', error.message);
    console.error('Error stack trace:', error.stack);

    return res.status(500).json({
      status: false,
      message: 'An error occurred while creating news or sending notification.',
      error: error.message,
    });
  }
};


// edit news
const editNews = async (req, res)=>{
  const { title, content, source } = req.body;
  if (!title || !content || !source) {
    return res.status(400).json({ message: 'Please provide all required fields' });
  }
  try {
    const news = await News.findByIdAndUpdate(req.params.id, { title, content, source }, { new: true });
    if(!news){
      return res.status(404).json({
        status: false,
        message: 'News not found'
      });
    }
    return res.status(200).json({
      status: true,
      data: news
    });
  } catch (err) {
    return res.status(500).json({
      "error": "Server error",
      "message": err?.message
    })
  }
}

// delete news
const deleteNews = async (req, res)=>{
  try {
    const news = await News.findByIdAndDelete(req.params.id);
    if(!news){
      return res.status(404).json({
        status: false,
        message: 'News not found'
      });
    }
    return res.status(200).json({
      status: true,
      message: 'News deleted successfully'
    });
  }catch(err){
    return res.status(500).json({
      "error": "Server error",
      "message": err?.message
    })
  }
}


module.exports = {
  getNews,
  createNews,
  getNewById,
  editNews,
  deleteNews
};
