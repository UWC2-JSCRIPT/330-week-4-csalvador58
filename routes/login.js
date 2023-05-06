const { Router } = require('express');
const router = Router();
const { v4: uuidv4 } = require('uuid');
const userDAO = require('../daos/user');
const tokenDAO = require('../daos/token');

router.use(async (req, res, next) => {
  console.log('Test use - is user logged in');

  // Check if user has a token
  if (req.headers.authorization) {
    console.log('Verifying token...');

    const tokenString = req.headers.authorization.split(' ');
    console.log('tokenString: ');
    console.log(tokenString);
    try {
      const userId = await tokenDAO.getUserIdFromToken(tokenString[1]);
      console.log(`userId from token: ${userId}`);
      // retrieve user from db to be used in other routes
      if (userId) {
        req.user = await userDAO.getUser({ _id: userId });
        req.user.isLoggedIn = true;
      } else {
        req.user = { isLoggedIn: false };
      }
      next();
    } catch (error) {
      if (error instanceof tokenDAO.BadDataError) {
        res.status(401).send(error.message);
      } else {
        res.status(400).send(error.message);
      }
    }
  } else {
    // request has no token data
    console.log('Request has no token data');
    req.user = { isLoggedIn: false };
    next();
  }
});

router.post('/logout', async (req, res, next) => {
  console.log('Test post /logout');

  if (req.user.isLoggedIn) {
    const tokenString = req.headers.authorization.split(' ');
    console.log(`Logout - token string: ${tokenString[1]}`);
    try {
      const logoutUser = await tokenDAO.removeToken(tokenString[1]);
      console.log('logoutUser');
      console.log(logoutUser);
      res.status(200).send('User token removed');
    } catch (error) {
      res.status(500).send(error.message);
    }
  } else {
    res.status(401).send('Login required');
  }
});

router.post('/password', async (req, res, next) => {
  console.log('Test post /password');
  const { password } = req.body;
  console.log(`Password: ${password}`);

  if (req.user.isLoggedIn && password !== '') {
    // change password
    // console.log('Change password for: ');
    // console.log(req.user);
    try {
      const updatedPassword = await userDAO.updateUserPassword(
        req.user._id,
        password
      );
      res.status(200).send('User password is now updated.');
    } catch (error) {
      res.status(400).send(error.message);
    }
  } else if (password === '') {
    res.status(400).send('Password invalid');
  } else {
    res.status(401).send('Login required');
  }
});

router.post('/', async (req, res, next) => {
  console.log('Test post /');

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
      try {
        // validate login with bcrypt
        //   console.log('Checking password with bcrypt...');
        const isValid = await userDAO.validateLogin(password, user.password);

        // create a login token
        const newToken = await tokenDAO.makeTokenForUserId(user._id);
        // console.log(
        //   `User: ${user.email} is now assigned to Token: ${newToken._id}`
        // );
        res.status(200).send({ token: newToken._id });
      } catch (error) {
        if (error instanceof userDAO.BadDataError) {
          res.status(401).send('Password does not match');
        } else {
          res.status(500).send(error.message);
        }
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
        // console.log(`storedUser: ${storedUser}`);
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
