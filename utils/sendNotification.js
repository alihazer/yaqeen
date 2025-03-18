const Token = require('../models/token');
const notification = require('../models/notification');
const admin = require('firebase-admin');

const sendNotification = async (message, title, route)=>{
     try{
          const tokens = await Token.find({ isActive: true }).select('token -_id');
          if(tokens.length == 0){
               return false;
          }
          const tokensArray = tokens.map(token => token.token);
          const message = {
               notification: {
                    title: title,
                    body: message.split(' ').slice(0, 20).join(' ') + '...',
               },
               data: {
                    title: title,
                    route: route
               },
               tokens: tokensArray,
          };
          const response = await admin.messaging().sendEachForMulticast(message);
          const notification1 = await notification.create({ title, message, totalSent: tokensArray.length, totalDelivered: response.successCount, totalFailed: response.failureCount });
          return true;
     }
     catch(error){
          console.error('Error sending notification:', error);
          return false;
     }
}