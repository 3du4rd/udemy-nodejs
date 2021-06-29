const path = require('path');
const express = require('express');
const productsController = require('../controllers/products');

const router = express.Router();

router.use('/users', (req, res, next) => {
    console.log('Users Page');
    res.send('<h1>The Users Pages</h1>');
});

// /admin/add-product => GET
router.get('/add-product', productsController.getAddProduct);

router.post('/add-product', productsController.postAddProduct);

module.exports = router;