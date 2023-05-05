const Token = require('../models/token');
const { v4: uuidv4 } = require('uuid');

module.exports = {};

module.exports.makeTokenForUserId = async (userId) => {
  // console.log('DAOS -  userId')
  // console.log(userId)

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
  console.log('DAOS - tokenString');
  console.log(tokenString);

  try {
    const token = await Token.findById(tokenString).lean();
    console.log('DAOS - userId');
    console.log(token.userId);
    return token.userId;
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports.removeToken = async (tokenString) => {
  console.log('DAOS - tokenString');
  console.log(tokenString);

  try {
    const deleteToken = await Token.findByIdAndDelete(tokenString).lean();
    console.log('DAOS - Deleted token string');
    console.log(deleteToken);
    return deleteToken;
  } catch (error) {
    throw new Error(error.message);
  }
};
