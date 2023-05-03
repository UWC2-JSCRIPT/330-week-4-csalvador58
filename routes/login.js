const { Router } = require('express');
const router = Router();

router.post('/', async (req, res, next) => {
    console.log('Test post /')
})