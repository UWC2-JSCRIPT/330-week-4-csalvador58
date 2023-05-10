const mongoose = require('mongoose');
const Note = require('../models/note');

module.exports = {};

module.exports.createNote = async (userId, noteObj) => {
  //   console.log('DAOS - noteobj');
  //   console.log(noteObj);
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

module.exports.getNote = async (noteId, userId) => {
  if (!mongoose.Types.ObjectId.isValid(noteId)) {
    throw new BadDataError('Note ID is invalid.');
  }
  try {
    const note = await Note.findById(noteId).lean();

    // Check note's associated userId with current userId and throw an error if does not match
    if (note.userId == userId) {
      return note;
    } else {
      throw new Error('Restricted access.');
    }
  } catch (error) {
    if (error.message.includes('Restricted access')) {
      throw new UnauthorizedError(error.message);
    } else {
      throw new Error(error.message);
    }
  }
};

module.exports.getUserNotes = async (userId) => {
  try {
    const userNotes = await Note.find({ userId: userId }).lean();

    // Check note's associated userId with current userId and throw an error if does not match
    userNotes.forEach((note) => {
      //   console.log(note.userId, ' ', userId)
      if (note.userId != userId) throw new Error('Restricted access.');
    });
    return userNotes;
  } catch (error) {
    if (error.message.includes('Restricted access')) {
      throw new UnauthorizedError(error.message);
    } else {
      throw new Error(error.message);
    }
  }
};

class BadDataError extends Error {}
module.exports.BadDataError = BadDataError;

class UnauthorizedError extends Error {}
module.exports.UnauthorizedError = UnauthorizedError;
