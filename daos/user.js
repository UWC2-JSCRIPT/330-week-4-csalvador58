const User = require('../models/user');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
const saltRounds = 1;

module.exports = {};

module.exports.findUser = async (userEmail) => {
  try {
    const user = await User.findOne({ email: userEmail }).lean();
    // console.log('DAO - user: ');
    // console.log(user);
    return user;
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports.createUser = async (userEmail, userPassword) => {
  return new Promise((resolve, reject) => {
    // generate new userId
    const id = uuidv4();

    // encrypt password and store user in db
    bcrypt.hash(userPassword, saltRounds).then(async (hashedPassword) => {
    //   console.log(`DAOS - hashedPassword: ${hashedPassword}`);

      try {
        const storedUser = await User.create({
          email: userEmail,
          userId: id,
          password: hashedPassword,
        });
        // console.log('DAO - storedUser: ');
        // console.log(storedUser);
        resolve(true);
      } catch (error) {
        reject(new Error(error.message));
      }
    });
  });
};

module.exports.validateLogin = async (password, hashedPassword) => {
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, hashedPassword).then((result) => {
        console.log('DAO - result')
        console.log(result)
      resolve(result);
    });
  });
};

class BadDataError extends Error {}
module.exports.BadDataError = BadDataError;
