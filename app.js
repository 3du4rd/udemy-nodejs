const path = require('path');

const express = require ('express');
const session = require ('express-session');
const bodyParser = require('body-parser');
const errorController = require('./controllers/error');
const {mongoConnect} = require('./util/database');

const User = require('./models/user'); 
 
const PORT = process.env.PORT || 5000;

const app = express();

app.set('view engine','ejs');
app.set('views','views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');
// const apiRoutes = require('./routes/api');

//app.use(bodyParser.urlencoded({extended: false}));
app.use(express.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname,'public')));
app.use(
  session({ secret: 'my secret', resave: false, saveUninitialized: false })
);

app.use((req, res, next) => {
    User.findById('610b576921367994107d617d')
      .then(user => { 
        console.log(user);
        req.user = user;
        next();
      })
      .catch(err => console.log(err));
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

// app.use('/api',apiRoutes.routes);

app.use(errorController.get404);

mongoConnect
.then(result => {
  User.findOne()
  .then(user => {
    if (!user){
      const user = new User({
        name: 'Eduard',
        email: 'eduardleandro@hotmail.com',
        cart: {
          items: []
        }
      });
      user.save();
    }
  });  
  app.listen(PORT, () => console.log(`Listening on ${PORT}`));
})
.catch(err => {
  console.log(err)
});;

