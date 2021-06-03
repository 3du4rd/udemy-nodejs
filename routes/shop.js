const express = require('express');

const router = express.Router();

router.use('/', (req, res, next) => {
    console.log('My home Page!');
    res.send('<h1>Home Page - Express!</h1>');
});

module.exports = router;