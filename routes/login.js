const { Router } = require('express');
const router = Router();

const tokenDAO = require('../daos/token');

// POST / - find the user with the provided email. Use bcrypt to compare stored password with the incoming password. If they match, generate a random token with uuid and return it to the user.
router.post('/', async (req, res, next) => {
  console.log('Test post /');
  const { email, password } = req.body;
  console.log(`Email: ${email}, Password: ${password}`);
  res.status(401).send('Test');
});

router.post('/password', async (req, res, next) => {
  console.log('Test post /password');
  const { email, password } = req.body;
  console.log(`Email: ${email}, Password: ${password}`);
  res.status(401).send('Test');
});

router.post('/signup', async (req, res, next) => {
  console.log('Test post /signup');
  const { email, password } = req.body;
  console.log(`Email: ${email}, Password: ${password}`);

  // Check if password is valid
  if (!password || JSON.stringify(password) === '{}') {
    res.status(400).send('Password is invalid or missing');
  } else {
    // Password is valid
    res.status(200).send('Test');
  }
});

router.post('/logout', async (req, res, next) => {
  console.log('Test post /logout');
  res.status(401).send('Test');
});

module.exports = router;
