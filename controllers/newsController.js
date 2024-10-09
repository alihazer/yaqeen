const News = require('../models/News');
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



// Create a new news entry
const createNews = async (req, res) => {

    const { title, content, source } = req.body;
    if (!title || !content || !source) {
      // If validation fails, return immediately to prevent further code execution
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    // Create a new news document
    try{
    const newNews = await News.create({ title, content, source });
    if(newNews){
      console.log('News created successfully:', newNews);
      return res.status(201).json({
        status: true,
        message: 'News created successfully',
      });
    }


//     // If you need to send notifications, uncomment the code below
//     // Fetch all tokens from the database
//     // const tokens = await Token.find().select('token -_id');

//     // Prepare the notification payload
//     // const payload = {
//     //     notification: {
//     //         title: 'New News: ' + title,
//     //         body: content,
//     //     },
//     // };

//     // const tokensArray = tokens.map(token => token.token);

//     // Send notification to all tokens
//     // const response = await admin.messaging().sendToDevice(tokensArray, payload);
//     // console.log('Notification sent successfully:', response); 



  } catch (err) {
    console.error('Error creating news:', err);
  }
};





module.exports = {
  getNews,
  createNews,
};
