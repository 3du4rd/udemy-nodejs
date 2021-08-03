const Product = require('../models/product')
const Cart = require('../models/cart')

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.getProducts = (request, response, next) => {

  Product.findAll()
    .then(products => {
      response.render('shop/product-list', {
        prods: products,
        pageTitle: 'Shop - Product List (Sequelize)',
        path: '/products',
        hasProducts: products > 0,
        activeShop: true,
        productCSS: true
      });
    })
    .catch(e =>
      console.error(e.stack)
    );
};

exports.getProduct = (request, response, next) => {
    const productId = request.params.productId;
    console.log('getProduct '+productId);

    Product.findByPk(productId)
    .then(product => {
      response.render('shop/product-detail', {
        product: product,
        pageTitle: 'My Shop (Sequelize) - '+ product.title,
        path: '/products'
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
exports.getIndex = (request, response, next) => {
  Product.findAll()
  .then(products => {
    response.render('shop/index', {
      prods: products,
      pageTitle: 'Shop Index (Sequelize)',
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
  req.user.getCart()
    .then(cart => {
      console.log(cart);
      return cart.getProducts()
        .then(products => {
          res.render('shop/cart', {
            path: '/cart',
            pageTitle: 'Your Cart',
            products: cartProducts
          });
        })
        .catch(e =>
          console.error(e.stack)
        );
    })
    .catch(e =>
      console.error(e.stack)
    );

  /*const cartProducts = [];
  Cart.getCart(cart => {
    if (cart && cart.products) {      
      Product.findAll()
        .then(products => {
          for (product of products) {
            const cartProductData = cart.products.find(
              prod => prod.id === product.id
            );
            if (cartProductData) {
              cartProducts.push({ productData: product, qty: cartProductData.qty });
            }
          }
          res.render('shop/cart', {
            path: '/cart',
            pageTitle: 'Your Cart',
            products: cartProducts
          });
        })
        .catch(e =>
          console.error(e.stack)
        );
    }
    else {
      res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Your Cart',
        products: cartProducts
      });
    }
  });*/
};


exports.postCart= (req, res, next) => {
    const productId = req.body.productId;
    console.log(productId);
    Product.findById(productId, (product) => {
        Cart.addProduct(productId,product.price);
    });
    res.redirect('cart');
};

exports.postCartDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId;
    Product.findById(prodId, product => {
        Cart.deleteProduct(prodId, product.price);
        res.redirect('/cart');
    });
};

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
 exports.getOrders = (req, res, next) => {
    res.render('shop/orders', {
        pageTitle: 'Your Orders',
        path: '/orders'
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
        path: '/checkout',
    });
}

