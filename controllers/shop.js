const fs = require('fs');
const path = require('path');

const Product = require('../models/product');
const Order = require('../models/order');

/**
 * Permite obtener todos los productos de la base de datos 
 * MongoDB
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.getProducts = (req, res, next) => {

  Product.find()
    .then(products => {
      res.render('shop/product-list', {
        prods: products,
        pageTitle: 'Shop - Product List (Sequelize)',
        path: '/products',
        hasProducts: products > 0,
        activeShop: true,
        productCSS: true
      });
    })
    .catch(err =>{
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
   });
};

/**
 * 
 * @param {*} request 
 * @param {*} response 
 * @param {*} next 
 */
exports.getProduct = (req, res, next) => {
    const productId = req.params.productId;
    console.log('getProduct '+productId);

    Product.findById(productId)
    .then(product => {
      res.render('shop/product-detail', {
        product: product,
        pageTitle: 'My Shop (Sequelize) - '+ product.title,
        path: '/products'
      });
    })
    .catch(err =>{
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};


/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.getIndex = (req, res, next) => {
  Product.find()
  .then(products => {
    res.render('shop/index', {
      prods: products,
      pageTitle: 'Shop Index - NoSQL with MongoDB',
      path: '/'
    });
  })
  .catch(err =>{
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  });
};

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.getCart = (req, res, next) => {
  req.user
    .populate('cart.items.productId')
    .execPopulate()
    .then(user => {
      const products = user.cart.items;
      res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Your Cart',
        products: products
      });
    })
    .catch(err =>{
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postCart = (req, res, next) => {
  const productId = req.body.productId;
  
  Product.findById(productId)
    .then(product => {
      return req.user.addToCart(product);
    })
    .then(result => {
      console.log(result);
      res.redirect('/cart');
    });
};

/**
 * Permite eliminar un producto del carrito de compras
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.postCartDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId;
    req.user.removeFromCart(prodId)
    .then(result =>{
      res.redirect('/cart');
    })
    .catch(err =>{
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });  
};


exports.postOrder = (req, res, next) => {
  req.user
    .populate('cart.items.productId')
    .execPopulate()
    .then(user => {
      const products = user.cart.items.map (i => {
        return { quantity: i.quantity, product: { ...i.productId._doc } };
      });
      const order = new Order({
        user: {
          email: req.user.email,
          userId: req.user
        },
        products: products
      });
      return order.save();      
    })
    .then(result => {
      return req.user.clearCart();
    })
    .then(() => {
      res.redirect('/orders');
    })       
    .catch(err =>{
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

 exports.getOrders = (req, res, next) => {
   Order.find({'user.userId': req.user._id})
   .then(orders => {
    res.render('shop/orders', {
      path: '/orders',
      pageTitle: 'Your Orders',
      orders: orders
    });
  })
  .catch(err =>{
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  });
};

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.getCheckout = (req, res, next) => {
    res.render('shop/checkout', {
        pageTitle: 'Checkout',
        path: '/checkout'
    });
}

exports.getInvoice = (req, res, next) => {
  const orderId = req.params.orderId;
  console.log('Downloading Invoice # ' + orderId);
  Order.findById(orderId)
    .then(order => {
      if (!order) {
        return next(new Error('No order found.'));
      }
      if (order.user.userId.toString() !== req.session.user._id.toString()) {
        return next(new Error('Unauthorized'));
      }
      const invoiceName = 'invoice-' + orderId + '.pdf';
      const invoicePath = path.join('data', 'invoices', invoiceName);
      // fs.readFile(invoicePath, (err, data) => {
      //   if (err) {
      //     return next(err);
      //   }
      //   res.setHeader('Content-Type', 'application/pdf');
      //   res.setHeader(
      //     'Content-Disposition',
      //     'inline; filename="' + invoiceName + '"'
      //   );
      //   res.send(data);
      // });
      const file = fs.createReadStream(invoicePath);
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader(
        'Content-Disposition',
        'inline; filename="' + invoiceName + '"'
      );
      file.pipe(res);
    })
    .catch(err => next(err));
};
