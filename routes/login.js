const { Router } = require('express');
const router = Router();
const { v4: uuidv4 } = require('uuid');
const userDAO = require('../daos/user');
const tokenDAO = require('../daos/token');

// POST / - get the user with the provided email. Use bcrypt to compare stored password with the incoming password. If they match, generate a random token with uuid and return it to the user.

router.use(async (req, res, next) => {
  console.log('Test use - is user logged in');

  if (req.headers.authorization) {
    console.log('Verifying token...');

    const tokenString = req.headers.authorization.split(' ');

    console.log('tokenString: ');
    console.log(tokenString);
    const userId = await tokenDAO.getUserIdFromToken(tokenString[1]);
    console.log(`userId from token: ${userId}`);
    req.user = await userDAO.getUser({ _id: userId });
    req.user.isLoggedIn = true;
    next();
  } else {
    req.user = {};
    req.user.isLoggedIn = false;
    console.log('req.user: ')
    console.log(req.user)
    next();
  }
});

router.post('/logout', async (req, res, next) => {
  console.log('Test post /logout');

  if (!req.user.isLoggedIn) {
    res.status(401).send('Login required');
  }
});

router.post('/password', async (req, res, next) => {
  console.log('Test post /password');
  //   const { email, password } = req.body;
  //   console.log(`Email: ${email}, Password: ${password}`);

  if (!req.user.isLoggedIn) {
    res.status(401).send('Login required');
  }
});

router.post('/', async (req, res, next) => {
  console.log('Test post /');

  //   POST / - find the user with the provided email. Use bcrypt to compare stored password with the incoming password. If they match, generate a random token with uuid and return it to the user.

  // Check if login data is valid
  const { email, password } = req.body;
  if (
    !password ||
    JSON.stringify(password) === '{}' ||
    !email ||
    JSON.stringify(email) === '{}'
  ) {
    res.status(400).send(`Invalid Email/Passowrd`);
  } else {
    // check if user email already exists
    const user = await userDAO.getUser({ email: req.body.email });

    if (user) {
      // validate login with bcrypt
      console.log('Checking password with bcrypt...')
      const isValid = await userDAO.validateLogin(password, user.password);

      if (isValid) {
        // create a login token
        const newToken = await tokenDAO.makeTokenForUserId(user._id);

        console.log(
          `User: ${user.email} is now logged in. Token: ${newToken._id}`
        );

        res.status(200).send({ token: newToken._id });
      } else {
        res.status(401).send('Password does not match');
      }
    } else {
      res.status(401).send('User does not exist, signup is required.');
    }
  }
});

router.post('/signup', async (req, res, next) => {
  console.log('Test post /signup');

  // Check if login data is valid
  const { email, password } = req.body;
  if (
    !password ||
    JSON.stringify(password) === '{}' ||
    !email ||
    JSON.stringify(email) === '{}'
  ) {
    res.status(400).send(`Invalid Email/Passowrd`);
  } else {
    // check if user email already exists
    const userEmail = await userDAO.getUser({ email: req.body.email });

    if (!userEmail) {
      // create new user
      try {
        const storedUser = await userDAO.createUser(
          req.body.email,
          req.body.password
        );
        console.log(`storedUser: ${storedUser}`);
        res.status(200).send('New user created successfully');
      } catch (error) {
        res.status(500).send(error.message);
      }
    } else {
      res.status(409).send('User email already exists.');
    }
  }
});

module.exports = router;
