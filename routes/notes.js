const { Router } = require('express');
const router = Router();

const noteDAO = require('../daos/note');
const user = require('../models/user');

router.use(async (req, res, next) => {
  if (req.user.isLoggedIn) {
    next();
  } else {
    res.status(401).send('Login required');
  }
});

router.post('/', async (req, res, next) => {
  console.log('Note Test - post / ');
  const note = req.body;
  console.log(note);
  //   console.log(req.user._id)

  try {
    const savedNote = await noteDAO.createNote(req.user._id, note);
    // console.log('savedNote');
    // console.log(savedNote);
    res.status(200).send({ text: savedNote.text });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.get('/:id', async (req, res, next) => {
  console.log('Note Test - /:id');
  const noteId = req.params.id;
  console.log(noteId)
  res.status(400).send('test');
});

router.get('/', async (req, res, next) => {
  console.log('Note Test - get /');

  try {
    const userNotes = await noteDAO.getUserNotes(req.user._id);
    const textNotes = userNotes.map((note) => {
      return { text: note.text };
    });
    // console.log('textNotes');
    // console.log(textNotes);
    res.status(200).send(textNotes);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = router;
