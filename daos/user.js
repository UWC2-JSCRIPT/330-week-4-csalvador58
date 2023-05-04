const User = require('../models/user');

module.exports = {};

module.exports.findUser = async (userEmail) => {
  return await User.find({ email: userEmail });
};

module.exports.createUser = async (userObj) => {
  const { email, password } = userObj;
  const userExist = await User.find({ email: email });
  if (!userExist) {
    // create user
    return true;
  } else {
    // respond with error
    return false;
  }
};
