const path = require('path');
const express = require('express');
const { body } = require('express-validator');

const adminController = require('../controllers/admin');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.use('/users', (req, res, next) => {
    console.log('Users Page');
    res.send('<h1>The Users Pages</h1>');
});

router.get('/add-product', isAuth, adminController.getAddProduct);

router.post(
    '/add-product',
    [
      body('title')
        .isString()
        .isLength({ min: 3 })
        .trim(),
      body('price').isFloat().custom(value => { 
          if (value<10){
            return Promise.reject('Price must be greater than 1M');
          }
          return true;
      }),
      body('description')
        .isLength({ min: 5, max: 400 })
        .trim()
    ],
    isAuth,
    adminController.postAddProduct
  );

router.get('/products', isAuth, adminController.getProducts);

router.get('/edit-product/:productId', isAuth, adminController.getEditProduct);

router.post(
  '/edit-product',
  [
    body('title')
      .isString()
      .isLength({ min: 3 })
      .trim(),
    body('price').isFloat().custom(value => { 
      if (value<10){
        return Promise.reject('Product Price must be greater than $1000000');
      }
      return true;
    }),
    body('description')
      .isLength({ min: 5, max: 400 })
      .trim()
  ],
  isAuth,
  adminController.postEditProduct
);

//router.post('/delete-product', isAuth, adminController.postDeleteProduct);
router.delete('/product/:productId', isAuth, adminController.deleteProduct);

module.exports = router;