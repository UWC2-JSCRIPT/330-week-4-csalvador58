const { Router } = require('express');
const router = Router();

const noteDAO = require('../daos/note');

router.use(async (req, res, next) => {
  // require a logged in user before moving on to next routes
  if (req.user.token) {
    next();
  } else {
    res.status(401).send('Login required');
  }
});

router.post('/', async (req, res, next) => {
  //   console.log('Note Test - post / ');
  const note = req.body;

  try {
    const savedNote = await noteDAO.createNote(req.user._id, note);
    res.status(200).send(savedNote);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.get('/:noteId', async (req, res, next) => {
  //   console.log('Note Test - /:noteId');
  const noteId = req.params.noteId;

  try {
    const note = await noteDAO.getNote(noteId, req.user._id);
    res.status(200).send(note);
  } catch (error) {
    if (error instanceof noteDAO.BadDataError) {
      res.status(400).send(error.message);
    } else if (error instanceof noteDAO.UnauthorizedError) {
      res.status(404).send(error.message);
    } else {
      res.status(500).send(error.message);
    }
  }
});

router.get('/', async (req, res, next) => {
    // console.log('Note Test - get /');

  try {
    const userNotes = await noteDAO.getUserNotes(req.user._id);

    res.status(200).send(userNotes);
  } catch (error) {
    if (error instanceof noteDAO.UnauthorizedError) {
      res.status(404).send(error.message);
    }
    res.status(500).send(error.message);
  }
});

module.exports = router;
