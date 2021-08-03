const path = require('path');

const express = require ('express');
const bodyParser = require('body-parser');
const errorController = require('./controllers/error');
const sequelize = require('./util/database');

const Product = require('./models/product');
const User = require('./models/user');
 
const PORT = process.env.PORT || 5000;

const app = express();

app.set('view engine','ejs');
app.set('views','views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const apiRoutes = require('./routes/api');

//app.use(bodyParser.urlencoded({extended: false}));
app.use(express.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname,'public')));

/**
 * Almacenar el usuario en todos los request de la aplicacion
 */
app.use((req,res,next) => {
    User.findByPk(1)
    .then(user => {
        req.user = user;
        next();
    })
    .catch(e =>
        console.error(e.stack));
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use('/api',apiRoutes.routes);

app.use(errorController.get404);


//-> DB relationship
Product.belongsTo(User,{
    constraints: true,
    onDelete: 'CASCADE'
});
User.hasMany(Product);

sequelize.sync({ 
    alter: true
})
.then(result => {    
    return User.findByPk(1);    
})
.then(user =>{
    if(!user){
       return User.create({ name: 'Eduard', email: '3du4rd@gmail.com' }); 
    }
    return user;
})
.then(user =>{
    console.log('Dummy User: ' + JSON.stringify(user));
    app.listen(PORT, () => console.log(`Listening on ${PORT}`));
})
.catch(err => {
    console.error(err);
});

