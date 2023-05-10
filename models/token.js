const mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema({
  userId: { type: mongoose.Types.ObjectId, ref: 'users', required: true },
  created: { type: Date, default: Date.now, required: true },
});

module.exports = mongoose.model('tokens', tokenSchema);
