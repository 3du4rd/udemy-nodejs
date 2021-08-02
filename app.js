const path = require('path');

const express = require ('express');
const bodyParser = require('body-parser');
const errorController = require('./controllers/error');
const db = require('./util/database');
 
const PORT = process.env.PORT || 5000;

const app = express();

app.set('view engine','ejs');
app.set('views','views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const apiRoutes = require('./routes/api');

//
db.query('SELECT NOW()', (err, res) => {
    console.log(err, res);
    db.end();
});

db
  .query('SELECT * FROM PRODUCTS')
  .then(res => console.log(res.rows[0]))
  .catch(e => console.error(e.stack));

//app.use(bodyParser.urlencoded({extended: false}));
app.use(express.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname,'public')));

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use('/api',apiRoutes.routes);

app.use(errorController.get404);

app.listen(PORT, () => console.log(`Listening on ${ PORT }`));