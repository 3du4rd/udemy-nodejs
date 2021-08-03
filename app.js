const path = require('path');

const express = require ('express');
const bodyParser = require('body-parser');
const errorController = require('./controllers/error');
const mongoConnect = require('./util/database');
 
const PORT = process.env.PORT || 5000;

const app = express();

app.set('view engine','ejs');
app.set('views','views');

// const adminRoutes = require('./routes/admin');
// const shopRoutes = require('./routes/shop');
// const apiRoutes = require('./routes/api');

//app.use(bodyParser.urlencoded({extended: false}));
app.use(express.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname,'public')));

// app.use('/admin', adminRoutes);
// app.use(shopRoutes);
// app.use('/api',apiRoutes.routes);

app.use(errorController.get404);

mongoConnect(client => {
    console.log(client);
    app.listen(PORT, () => console.log(`Listening on ${PORT}`));
});

