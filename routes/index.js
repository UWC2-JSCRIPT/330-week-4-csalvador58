const { Router } = require("express");
const router = Router();


router.use('/login', require('./'))

module.exports = router;