const { TelegramClient } = require('telegram');
const { StringSession } = require('telegram/sessions');
const input = require('input');



const generateSession = async  () => {
     const api_id = parseInt(process.env.TELEGRAM_API_ID);
     const api_hash = process.env.TELEGRAM_API_HASH;
     console.log(api_id, api_hash);
     const stringSession = new StringSession('');
     console.log('Creating session..');
     const client = new TelegramClient(stringSession, api_id, api_hash, { 
          connectionRetries: 5 
     });

await client.start({
     phoneNumber: async () => await input.text('Please enter your phone number:'),
     phoneCode: async () => await input.text('Please enter the code you received:'),
     onError: (err) => console.log(err),
});

console.log('You should now have a working Telegram session. Please store the following string somewhere safe:');
console.log(stringSession.save());
console.log('You can now use this string to login as your user without the need of a password. Keep it safe!');
await client.sendMessage('me', { message: 'Hello, World!' });
await client.disconnect();
};

module.exports = generateSession;