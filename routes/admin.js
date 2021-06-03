const path = require('path');
const express = require('express');
const rootDir = require('../util/path');

const router = express.Router();

router.use('/users', (req, res, next) => {
    console.log('Users Page');
    res.send('<h1>The Users Pages</h1>');
});

router.get('/add-product', (req, res, next) => {
    console.log('Add Product');
    res.sendFile(path.join(rootDir,'views','add-product.html'));
}); 

router.post('/add-product', (req, res, next) => {
    console.log(req.body);
    res.redirect('/');
});

module.exports = router;