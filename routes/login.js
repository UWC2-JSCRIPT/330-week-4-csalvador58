const { Router } = require('express');
const router = Router();

const userDAO = require('../daos/user');
const tokenDAO = require('../daos/token');

// POST / - find the user with the provided email. Use bcrypt to compare stored password with the incoming password. If they match, generate a random token with uuid and return it to the user.

router.use(async (req, res, next) => {
  console.log('Test use - checks valid email and password');
  const { email, password } = req.body;
  console.log(`Email: ${email}, Password: ${password}`);

  // Check if login data is valid
  if (!password || JSON.stringify(password) === '{}') {
    res.status(400).send('Password is invalid or missing');
  } else if (!email || JSON.stringify(email) === '{}') {
    res.status(400).send('Email is invalid or missing');
  } else {
    next();
  }
});

router.use(async (req, res, next) => {
  console.log('Test use - retrieve user from db');
  // check if user exists
  try {
    console.log('req.body.email');
    console.log(req.body.email);
    const user = await userDAO.findUser(req.body.email);
    req.user = user;
    next();
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.post('/signup', async (req, res, next) => {
  console.log('Test post /signup');
  console.log('req.user');
  console.log(req.user);

  // create new user if not already in db
  if (!req.user) {
    try {
      console.log('req.body.email');
      console.log(req.body.email);
      console.log('req.body.password');
      console.log(req.body.password);
      const storedUser = await userDAO.createUser(
        req.body.email,
        req.body.password
      );
      console.log('storedUser status: ');
      console.log(storedUser);
      res.status(200).send('New user created successfully');
    } catch (error) {
      res.status(500).send(error.message);
    }
  } else {
    res.status(409).send('User email already exists.');
  }
});

router.post('/password', async (req, res, next) => {
  console.log('Test post /password');
  const { email, password } = req.body;
  console.log(`Email: ${email}, Password: ${password}`);
  res.status(401).send('Test');
});

router.post('/logout', async (req, res, next) => {
  console.log('Test post /logout');
  res.status(401).send('Test');
});

router.post('/', async (req, res, next) => {
  console.log('Test post /');
  const { email, password } = req.body;
  console.log(`Email: ${email}, Password: ${password}`);
  res.status(401).send('Test');
});

module.exports = router;
