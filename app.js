const path = require('path');

const express = require ('express');
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
// const apiRoutes = require('./routes/api');

//app.use(bodyParser.urlencoded({extended: false}));
app.use(express.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname,'public')));

// app.use((req, res, next) => {
//     User.findByName('admin')
//       .then(user => {
//         console.log(user);
//         req.user = new User(user.name, user.email, user.cart, user._id);
//         next();
//       })
//       .catch(err => console.log(err));
// });

app.use('/admin', adminRoutes);
app.use(shopRoutes);

// app.use('/api',apiRoutes.routes);

app.use(errorController.get404);

mongoConnect
.then(result => {
  app.listen(PORT, () => console.log(`Listening on ${PORT}`));
})
.catch(err => {
  console.log(err)
});;

