const Note = require('../models/note');

module.exports = {};

module.exports.createNote = async (userId, noteObj) => {
    console.log('DAOS - noteobj');
    console.log(noteObj);
  try {
    const savedNote = await Note.create({
      text: noteObj.text,
      userId: userId,
    });
    return savedNote;
  } catch (error) {
    throw new Error(error, message);
  }
};

module.exports.getNote = async (userId, noteId) => {};

module.exports.getUserNotes = async (userId) => {
  try {
    const userNotes = await Note.find({ userId: userId }).lean();
    return userNotes;
  } catch (error) {
    throw new Error(error.message);
  }
};
