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
            products: products
          });
        })
        .catch(e =>
          console.error(e.stack)
        );
    })
    .catch(e =>
      console.error(e.stack)
    );  
};

exports.postCart = (req, res, next) => {
  const productId = req.body.productId;
  let fetchedCart;
  let newQuantity = 1;

  req.user.getCart()
    .then(cart => {
      fetchedCart = cart;
      return cart.getProducts({ where: { id: productId } });
    })
    .then(products => {
      let product;
      
      if (products.length > 0) {
        product = products[0];
      }
      
      if (product) {
        const oldQuantity = product.cartItem.quantity;
        newQuantity = oldQuantity + 1;
        return product; 
      }
      return Product.findByPk(productId);
    })
    .then( product => {
      return fetchedCart.addProduct(product, {
        through: { quantity: newQuantity }
      });
    })
    .then( () =>{
      res.redirect('cart');
    })
    .catch(e =>
      console.error(e.stack)
    );  
};

/**
 * Permite eliminar un producto del carrito de compras
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.postCartDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId;
    req.user.getCart()
    .then(cart =>{
      return cart.getProducts({ where: {id:prodId} });
    })
    .then(products => {
      const product = products[0];
      return product.cartItem.destroy();
    })
    .then(result =>{
      res.redirect('/cart');
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

