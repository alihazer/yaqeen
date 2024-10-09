const mongoose = require('mongoose');
const tokenSchema = new mongoose.Schema({
    token: { type: String, required: true },
    userId: { type: String},
});
const Token = mongoose.model('Token', tokenSchema);
// Export the model for use in other files
module.exports = Token;
