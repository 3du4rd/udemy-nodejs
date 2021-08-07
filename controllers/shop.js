const Product = require('../models/product')
const Order = require('../models/order')

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
        productCSS: true,
        isAuthenticated: req.session.isLoggedIn 
      });
    })
    .catch(e =>
      console.error(e.stack)
    );
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
        path: '/products',
        isAuthenticated: req.session.isLoggedIn 
      });
    })
    .catch(e =>
      console.error(e.stack));
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
  .catch(e => 
    console.error(e.stack)
  );
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
        products: products,
        isAuthenticated: req.session.isLoggedIn
      });
    })
    .catch(e =>
      console.error(e.stack)
    );
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
    .catch(e =>
      console.error(e.stack)
    );  
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
    .catch(err => { 
      console.log(err)
    });
};

 exports.getOrders = (req, res, next) => {
   Order.find({'user.userId': req.user._id})
   .then(orders => {
    res.render('shop/orders', {
      path: '/orders',
      pageTitle: 'Your Orders',
      orders: orders,
      isAuthenticated: req.session.isLoggedIn
    });
  })
  .catch(err => console.log(err));
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
        path: '/checkout',
        isAuthenticated: req.session.isLoggedIn
    });
}
