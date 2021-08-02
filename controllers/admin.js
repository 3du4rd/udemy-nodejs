const Product = require('../models/product')

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
    console.log(request.body);

    const title = request.body.title;
    const imageUrl = request.body.imageUrl;
    const description = request.body.description;
    const price = request.body.price;

    const product = new Product(null, title, imageUrl, description, price);
    product.save()
        .then((res) => {
            console.log('Se adiciono el producto exitosamente: '+ res.rows[0]);
            response.redirect('/');
        })
        .catch(e =>
            console.error(e.stack));
};


exports.getEditProduct = (req, res, next) => {
    const editMode = new Boolean(req.query.edit);
    if (!editMode){
        return res.redirect('/');
    }
    const prodId = req.params.productId;
    Product.findById( prodId, product => {
        if(!product){
            return res.redirect('/');
        }
        res.render('admin/edit-product', {
            pageTitle: 'Edit Product (Ejs)',
            path: '/admin/edit-product',
            editing: editMode,
            product: product
        });
    });    
};

exports.postEditProduct = (req, res, next) => {
    const prodId = req.body.productId;
    const updatedTitle = req.body.title;
    const updatedPrice = req.body.price;
    const updatedImageUrl = req.body.imageUrl;
    const updatedDesc = req.body.description;
    const updatedProduct = new Product(
      prodId,
      updatedTitle,
      updatedImageUrl,
      updatedDesc,
      updatedPrice
    );
    updatedProduct.save();
    res.redirect('/admin/products');
  };

  /**
   * 
   * @param {*} req 
   * @param {*} res 
   * @param {*} next 
   */
  exports.postDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId;
    Product.deleteById(prodId);
    res.redirect('/admin/products');
  };


/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.getProducts = (req, res, next) => {
    Product.fetchAll(products => {
        res.render('admin/products', {
            prods: products,
            pageTitle: 'Admin Products',
            path: '/admin/products'
          });
    });
};