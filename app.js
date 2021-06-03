const express = require ('express');
const bodyParser = require('body-parser');

const app = express();

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

// app.use( (req, res, next) => {
//     console.log('In the middleware 1!');
//     next();
// });

// app.use( (req, res, next) => {
//     console.log('In the middleware 2!');
//     res.send('<h1>My First Express Assigment !</h1>');
// });

// app.use('/users', (req, res, next) => {
//     console.log('Users Page');
//     res.send('<h1>The Users Pages</h1>');
// });

// app.use('/add-product', (req, res, next) => {
//     console.log('Add Product');
//     res.send('<form action="/product" method="POST"><input type="text" name="title"><button type="submit"/>Add Product</button></form>');
// }); 

// app.post('/product', (req, res, next) => {
//     console.log(req.body);
//     res.redirect('/');
// });

app.use(bodyParser.urlencoded({extended: false}));

app.use(adminRoutes);
app.use(shopRoutes);

app.use( (req,res,next) => {
    res.status(404).send('<h1>Page Not Found</h1>');
});

app.listen(3000);