const { TelegramClient } = require('telegram');
const { StringSession } = require('telegram/sessions');
const { NewMessage } = require('telegram/events');
const News = require('../models/News.js')
require('dotenv').config();


const apiId = parseInt(process.env.TELEGRAM_API_ID);
const apiHash = process.env.TELEGRAM_API_HASH;
const session = new StringSession(process.env.TELEGRAM_SESSION_STRING);
const client = new TelegramClient(session, apiId, apiHash, {
     connectionRetries: 5,
   });


async function startTelegramSync() {
     await client.start();
     console.log('🤖 Telegram client started');

  client.addEventHandler(async (event) => {
    const message = event.message.message;
    const chat = await event.message.getChat();
    const fromChannel = chat?.username || chat?.title || 'Unknown';

    
    // Avoid duplicates
    const exists = await News.findOne({ content: message });
    if (exists) return;
    const title = message.split(' ').slice(0, 5).join(' ') + '...';
    // Save to DB
    await News.create({
      title: title,
      content: message,
      source: fromChannel,
    });

    console.log(`🆕 [${fromChannel}] New urgent news saved.`);
  }, new NewMessage({ chats: ['almayadeen'] })); // username without @
}

module.exports =  startTelegramSync;
