const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true },
  userId: { type: String, required: true, unique: true },
  token: { type: String },
});

module.exports = mongoose.model('users', userSchema);
