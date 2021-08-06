const path = require('path');

const express = require ('express');
const session = require ('express-session');
const bodyParser = require('body-parser');
const errorController = require('./controllers/error');
const {mongoConnect,mongoUri} = require('./util/database');
const MongoDBStore = require('connect-mongodb-session')(session);

const User = require('./models/user'); 
 
const PORT = process.env.PORT || 5000;

const app = express();
const store = new MongoDBStore({
  uri: mongoUri,
  collection: 'sessions'
});

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
  session({ 
    secret: 'my secret', 
    resave: false, 
    saveUninitialized: false, 
    store: store 
  })
);

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then(user => {
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

