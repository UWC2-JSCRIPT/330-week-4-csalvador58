const { Router } = require('express');
const router = Router();

const noteDAO = require('../daos/note');

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
    console.log('savedNote');
    console.log(savedNote);
    res.status(200).send(savedNote);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.get('/:noteId', async (req, res, next) => {
  console.log('Note Test - /:noteId');
  const noteId = req.params.noteId;
  console.log(noteId);

  try {
    const note = await noteDAO.getNote(noteId, req.user._id);
    console.log('note from noteId: ');
    console.log(note);
    res.status(200).send(note);
  } catch (error) {
    if (error instanceof noteDAO.BadDataError) {
      console.log('400 error.message');
      console.log(error.message);
      res.status(400).send(error.message);
    } else if (error instanceof noteDAO.UnauthorizedError) {
      res.status(404).send(error.message);
    } else {
      console.log(error.message);
      res.status(500).send(error.message);
    }
  }
});

router.get('/', async (req, res, next) => {
  console.log('Note Test - get /');

  try {
    const userNotes = await noteDAO.getUserNotes(req.user._id);
    console.log('userNotes');
    console.log(userNotes);
    res.status(200).send(userNotes);
  } catch (error) {
    if (error instanceof noteDAO.UnauthorizedError) {
      res.status(404).send(error.message);
    }
    res.status(500).send(error.message);
  }
});

module.exports = router;
