const Token = require('../models/token');
const { v4: uuidv4 } = require('uuid');

module.exports = {};

module.exports.makeTokenForUserId = async (userId) => {
  try {
    const storedToken = await Token.create({
      userId: userId,
    });
    // console.log('DAOS - storedToken')
    // console.log(storedToken)
    return storedToken.toObject();
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports.getUserIdFromToken = async (tokenString) => {
  try {
    const token = await Token.findById(tokenString).lean();
    if (!token) {
      throw new Error('Invalid token - userId not found');
    }
    return token.userId;
  } catch (error) {
    if (
      error.message.includes('Cast to ObjectId failed') ||
      error.message.includes('Invalid token - userId not found')
    ) {
      throw new BadDataError(error.message);
    } else {
      throw new Error(error.message);
    }
  }
};

module.exports.removeToken = async (token) => {
  try {
    const deleteToken = await Token.findOneAndDelete({ _id: token }).lean();
    // console.log('DAOS - Deleted token string');
    // console.log(deleteToken);
    return deleteToken;
  } catch (error) {
    throw new Error(error.message);
  }
};

class BadDataError extends Error {}
module.exports.BadDataError = BadDataError;
