const path = require('path');

const express = require ('express');
const bodyParser = require('body-parser');
const expressHbs = require('express-handlebars');
const PORT = process.env.PORT || 5000;

const app = express();
app.engine(
    'hbs',
    expressHbs({
      layoutsDir: 'views/layouts/',
      defaultLayout: 'main-layout',
      extname: 'hbs'
    })
  );
app.set('view engine','hbs');
app.set('views','views');

const adminData = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const apiRoutes = require('./routes/api');

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname,'public')));

app.use('/admin',adminData.routes);
app.use(shopRoutes);
app.use('/api',apiRoutes.routes);

app.use((req, res, next) => {
    res.status(404).render('404', {pageTitle: 'Page Not Found'});
});

app.listen(PORT, () => console.log(`Listening on ${ PORT }`));