const Product = require('../models/product');
const mongodb = require('mongodb');
/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
 exports.getAddProduct = (req, res, next) => {
    res.render('admin/edit-product', {
        pageTitle: 'Add Product (Ejs)',
        path: '/admin/add-product',
        editing: false
    });
};

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.postAddProduct = (request, response, next) => {
    const title = request.body.title;
    const imageUrl = request.body.imageUrl;
    const description = request.body.description;
    const price = request.body.price;
    //const userId = request.user.id;

    const product = new Product(title, price, description, imageUrl);
    product.save()
    .then(result=>{
        console.log('Producto creado: ' + result);
        response.redirect('/admin/products');
    })
    .catch(err =>{
        console.error(err.stack);
    });
};

exports.getProducts = (request, response, next) => {
    Product.fetchAll()
        .then(products => {
            response.render('admin/products', {
                prods: products,
                pageTitle: 'Admin Products',
                path: '/admin/products'
            });
        })
        .catch(e =>
            console.error(e.stack)
        );
};


exports.getEditProduct = (req, res, next) => {
    const editMode = new Boolean(req.query.edit);
    if (!editMode){
        return res.redirect('/');
    }
    const prodId = req.params.productId;

    Product.findById(prodId)
        .then(product => {
            if (!product) {
                return res.redirect('/');
            }
            res.render('admin/edit-product', {
                pageTitle: 'Edit Product (Ejs)',
                path: '/admin/edit-product',
                editing: editMode,
                product: product
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
exports.postEditProduct = (req, res, next) => {
    const prodId = req.body.productId;
    const updatedTitle = req.body.title;
    const updatedPrice = req.body.price;
    const updatedImageUrl = req.body.imageUrl;
    const updatedDesc = req.body.description;

    const product = new Product(updatedTitle, updatedPrice, updatedDesc, updatedImageUrl, new mongodb.ObjectId(prodId));
    product.save()
        .then(result => {
            console.log('Producto actualizado exitosamente!');
            res.redirect('/admin/products');
        })
        .catch(e =>
            console.error(e.stack));
};

/*
exports.postDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId;

      Product.destroy({
          where: { id: prodId }
      }).then(result => {
          console.log('Producto eliminado exitosamente!');
          res.redirect('/admin/products');
      }).catch(e =>
              console.error(e.stack));    
  };



*/