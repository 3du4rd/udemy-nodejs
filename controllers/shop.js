const Product = require('../models/product')

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.getProducts = (req, res, next) => {
    Product.fetchAll(products => {
        res.render('shop/product-list', {
            prods: products,
            pageTitle: 'Shop (Ejs)',
            path: '/',
            hasProducts: products.length > 0,
            activeShop: true,
            productCSS: true
          });
    });
};

exports.getIndex = (req, res, next) => {
    Product.fetchAll(products => {
        res.render('shop/index', {
            prods: products,
            pageTitle: 'Shop Index',
            path: '/'
          });
    });
};

exports.getCart= (req, res, next) => {
    res.render('shop/cart', {
        pageTitle: 'Your Cart',
        path: '/cart'
    });
};

exports.getCheckout = (req, res, next) => {
    res.render('shop/checkout', {
        pageTitle: 'Checkout',
        path: '/checkout',
    });
}

