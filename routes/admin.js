const path = require('path');
const express = require('express');
const adminController = require('../controllers/admin');

const router = express.Router();

router.use('/users', (req, res, next) => {
    console.log('Users Page');
    res.send('<h1>The Users Pages</h1>');
});

// /admin/add-product => GET
router.get('/add-product', adminController.getAddProduct);

// /admin/products => GET
router.get('/products', adminController.getProducts);

// /admin/add-product => POST
router.post('/add-product', adminController.postAddProduct);

// /admin/edit-product => GET
router.get('/edit-product/:productId', adminController.getEditProduct);

router.post('/edit-product', adminController.postEditProduct);

module.exports = router;