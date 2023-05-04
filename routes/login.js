const { Router } = require('express');
const router = Router();

const userDAO = require('../daos/user');
const tokenDAO = require('../daos/token');

// POST / - find the user with the provided email. Use bcrypt to compare stored password with the incoming password. If they match, generate a random token with uuid and return it to the user.

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
    try {
      const user = await userDAO.findUser(email);

      // create new user if not already in db
      if (!user) {
        try {
          const storedUser = await userDAO.createUser(email, password);
          console.log('storedUser status: ')
          console.log(storedUser)
          res.status(200).send('New user created successfully')
        } catch (error) {
          res.status(500).send(error.message);
        }
      } else {
        res.status(409).send('User email already exists.');
      }
    } catch (error) {
      res.status(500).send(error.message);
    }
  }
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
