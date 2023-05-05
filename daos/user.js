const User = require('../models/user');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
const saltRounds = 5;

module.exports = {};

module.exports.getUser = async (userObj) => {
//   console.log('DAOS - userObj');
//   console.log(userObj);
  try {
    const user = await User.findOne(userObj).lean();
    // console.log('DAO - user: ');
    // console.log(user);
    return user;
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports.createUser = async (userEmail, userPassword) => {
  return new Promise((resolve, reject) => {
    // encrypt password and store user in db
    bcrypt.hash(userPassword, saltRounds).then(async (hashedPassword) => {
      //   console.log(`DAOS - hashedPassword: ${hashedPassword}`);

      try {
        const storedUser = await User.create({
          email: userEmail,
          password: hashedPassword,
        });
        // console.log('DAO - storedUser: ');
        // console.log(storedUser);
        resolve(storedUser);
      } catch (error) {
        reject(new Error(error.message));
      }
    });
  });
};

module.exports.updateUserPassword = async (userId, newPassword) => {
  return new Promise((resolve, reject) => {
    // encrypt new password and store in db
    bcrypt.hash(newPassword, saltRounds).then(async (hashedPassword) => {
    //   console.log(`DAOS - New hashed password: ${hashedPassword}`);
      try {
        const updatedPassword = await User.findOneAndUpdate(
          { _id: userId },
          {
            password: hashedPassword,
          },
          { new: true }
        ).lean();
        // console.log('DAO - updatedPassword: ');
        // console.log(updatedPassword);
        resolve(updatedPassword);
      } catch (error) {
        reject(new Error(error.message));
      }
    });
  });
};

module.exports.validateLogin = async (password, hashedPassword) => {
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, hashedPassword).then((result) => {
    //   console.log('DAO - result');
    //   console.log(result);
      resolve(result);
    });
  });
};

class BadDataError extends Error {}
module.exports.BadDataError = BadDataError;
