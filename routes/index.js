const { Router } = require('express');
const router = Router();
const userDAO = require('../daos/user');
const tokenDAO = require('../daos/token');

// router.use((req, res, next) => {
//   console.log(`${req.method} ${req.url} at ${new Date()}`);
//   next();
// });

router.use(async (req, res, next) => {
  //   console.log('Test use - is user logged in');

  if (req.headers.authorization) {
    const tokenString = req.headers.authorization.split(' ');
    try {
      const userId = await tokenDAO.getUserIdFromToken(tokenString[1]);
      //   console.log(`userId from token: ${userId}`);

      // retrieve user from db
      if (userId) {
        req.user = await userDAO.getUser({ _id: userId });
        req.user.isLoggedIn = true;
      } else {
        // if no user, set isLoggedIn flag as false
        req.user = { isLoggedIn: false };
      }
      next();
    } catch (error) {
      if (error instanceof tokenDAO.BadDataError) {
        res.status(401).send(error.message);
      } else {
        res.status(500).send(error.message);
      }
    }
  } else {
    // console.log('Request has no token data, isLoggedIn set as false');
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
