const { Router } = require('express');
const router = Router();
const { v4: uuidv4 } = require('uuid');
const userDAO = require('../daos/user');
const tokenDAO = require('../daos/token');

router.post('/logout', async (req, res, next) => {
  //   console.log('Login Test post /logout');

  if (req.user.token) {

    try {
      const logoutUser = await tokenDAO.removeToken(req.user.token);
      res.status(200).send('User logged out, token removed');
    } catch (error) {
      res.status(500).send(error.message);
    }
  } else {
    res.status(401).send('Login required');
  }
});

router.post('/password', async (req, res, next) => {
  //   console.log('Login Test post /password');
  const { password } = req.body;

  if (req.user.token && password !== '') {
    try {
      const updatedPassword = await userDAO.updateUserPassword(
        req.user._id,
        password
      );
      res.status(200).send('User password is now updated.');
    } catch (error) {
      res.status(500).send(error.message);
    }
  } else if (password === '') {
    res.status(400).send('Password invalid');
  } else {
    res.status(401).send('Login required');
  }
});

// Check if login data is valid before login and signup routes
router.use(async (req, res, next) => {
  //   console.log('Test use - check login data');
  const { email, password } = req.body;
  if (
    !password ||
    JSON.stringify(password) === '{}' ||
    !email ||
    JSON.stringify(email) === '{}'
  ) {
    res.status(400).send(`Invalid Email/Password`);
  } else {
    next();
  }
});

router.post('/', async (req, res, next) => {
  //   console.log('Login Test post /');
  const { email, password } = req.body;

  // Get user from db, validate password with bcrypt, then create new login token
  try {
    const user = await userDAO.getUser({ email: email });

    if (user) {
      try {
        // BadDataError is thrown if password does not match
        const isValid = await userDAO.validateLogin(password, user.password);

        // Create token if password is valid
        const newToken = await tokenDAO.makeTokenForUserId(user._id);
        // console.log(
        //   `User: ${user.email} is now assigned to Token: ${newToken._id}`
        // );
        res.status(200).send({ token: newToken._id });
      } catch (error) {
        if (error instanceof userDAO.BadDataError) {
          res.status(401).send(error.message);
        } else {
          res.status(500).send(error.message);
        }
      }
    } else {
      res.status(401).send('User does not exist, signup is required.');
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.post('/signup', async (req, res, next) => {
  //   console.log('Login Test post /signup');
  const { email, password } = req.body;

  // create new user if email is unique
  try {
    const storedUser = await userDAO.createUser(email, password);
    res.status(200).send('New user created successfully');
  } catch (error) {
    if (error instanceof userDAO.BadDataError) {
      res.status(409).send(error.message);
    } else {
      res.status(500).send(error.message);
    }
  }
});

module.exports = router;
