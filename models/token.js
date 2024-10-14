const mongoose = require('mongoose');
const tokenSchema = new mongoose.Schema({
    token: { type: String, required: true },
    isActive: { type: Boolean, default: true}
});
const Token = mongoose.model('Token', tokenSchema);
// Export the model for use in other files
module.exports = Token;
