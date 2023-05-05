const Token = require('../models/token');
const { v4: uuidv4 } = require('uuid');

module.exports = {};

module.exports.makeTokenForUserId = async (userId) => {
    // console.log('DAOS -  userId')
    // console.log(userId)

    try {
        const storedToken = await Token.create({
            userId: userId
        });
        // console.log('DAOS - storedToken')
        // console.log(storedToken)
        return storedToken.toObject();
    } catch (error) {
        throw new Error(error.message)
    }
}
