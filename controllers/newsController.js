const News = require('../models/News');
const admin = require('firebase-admin');
const sendNotification = require('../utils/sendNotification.js');


// Get all news
const getNews = async (req, res) => {
  try {
    const pinnedNewsId = '67141898c3a9fc0377de6bcb';

    // Fetch the pinned news separately
    const pinnedNews = await News.findById(pinnedNewsId);

    // Fetch the rest of the news, excluding the pinned one, and sort them by createdAt
    const otherNews = await News.find({ _id: { $ne: pinnedNewsId } }).sort({ createdAt: -1 });

    // Combine the pinned news at the beginning of the array
    const news = pinnedNews ? [pinnedNews, ...otherNews] : otherNews;

    res.status(200).json({
      status: true,
      data: news
    });
  } catch (err) {
    return res.status(500).json({
      error: "Server error",
      message: err?.message
    });
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
      const notifications = await sendNotification(newNews.content, newNews.title, '/news');
      if (!notifications) {
        console.log('No active tokens available to send notifications.');
      }
      return res.status(201).json({
        status: true,
        message: 'News created successfully and notification sent.',
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
