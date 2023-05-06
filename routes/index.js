const { Router } = require('express');
const router = Router();
const userDAO = require('../daos/user');
const tokenDAO = require('../daos/token');

router.use((req, res, next) => {
  console.log(`${req.method} ${req.url} at ${new Date()}`);
  next();
});

router.use(async (req, res, next) => {
  console.log('Test use - is user logged in');

  // Check if user has a token
  if (req.headers.authorization) {
    console.log('Verifying token...');

    const tokenString = req.headers.authorization.split(' ');
    // console.log('tokenString: ');
    // console.log(tokenString);
    try {
      const userId = await tokenDAO.getUserIdFromToken(tokenString[1]);
      console.log(`userId from token: ${userId}`);
      // retrieve user from db
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
    // console.log('Request has no token data');
    req.user = { isLoggedIn: false };
    next();
  }
});

router.use('/login', require('./login'));
router.use('/notes', require('./notes'));

router.use((err, req, res, next) => {
  console.log('Error detected: ', err);
});

module.exports = router;
