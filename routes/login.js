const { Router } = require('express');
const router = Router();
const { v4: uuidv4 } = require('uuid');
const userDAO = require('../daos/user');
const tokenDAO = require('../daos/token');

// POST / - get the user with the provided email. Use bcrypt to compare stored password with the incoming password. If they match, generate a random token with uuid and return it to the user.

router.use(async (req, res, next) => {
  console.log('Test use - retrieve user from db');

  if (req.body.email) req.user = await userDAO.getUser(req.body.email);

  next();
});

router.post('/logout', async (req, res, next) => {
  console.log('Test post /logout');

  if (!req.user) {
    res.status(401).send('Signup required');
  }
});

router.post('/password', async (req, res, next) => {
  console.log('Test post /password');
  //   const { email, password } = req.body;
  //   console.log(`Email: ${email}, Password: ${password}`);

  if (!req.user) {
    res.status(401).send('Signup required');
  }
});

router.post('/', async (req, res, next) => {
  console.log('Test post /');

  if (req.user) {
    const { email, password } = req.body;
    // console.log(`Email: ${email}, Password: ${password}`);

    // Check if login data is valid
    if (!password || JSON.stringify(password) === '{}') {
      res.status(400).send('Password is invalid or missing');
    } else if (!email || JSON.stringify(email) === '{}') {
      res.status(400).send('Email is invalid or missing');
    } else {
      // validate login
      const isValid = await userDAO.validateLogin(password, req.user.password);

      if (isValid) {
        const newToken = await tokenDAO.makeTokenForUserId(req.user._id);
        res.status(200).send({ token: newToken._id });
      } else {
        res.status(401).send('Password does not match');
      }
    }
  } else {
    res.status(401).send('Signup required');
  }
});

router.post('/signup', async (req, res, next) => {
  console.log('Test post /signup');
  //   console.log('req.user');
  //   console.log(req.user);

  // create new user if not already in db
  if (!req.user) {
    // Check if login data is valid
    const { email, password } = req.body;
    if (!password || JSON.stringify(password) === '{}') {
      res.status(400).send('Password is invalid or missing');
    } else if (!email || JSON.stringify(email) === '{}') {
      res.status(400).send('Email is invalid or missing');
    } else {
      try {
        const storedUser = await userDAO.createUser(
          req.body.email,
          req.body.password
        );
        // console.log(`storedUser: ${storedUser}`);
        res.status(200).send('New user created successfully');
      } catch (error) {
        res.status(500).send(error.message);
      }
    }
  } else {
    res.status(409).send('User email already exists.');
  }
});

module.exports = router;
