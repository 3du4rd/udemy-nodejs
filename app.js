require('dotenv').config();
const path = require('path');
const fs = require('fs');
const https = require('https');

const express = require ('express');
const session = require ('express-session');
const bodyParser = require('body-parser');
const csrf = require('csurf');
const flash = require('connect-flash');
const multer = require('multer');
const helmet = require("helmet");
const compression = require('compression');
const morgan = require('morgan');

const errorController = require('./controllers/error');
const { mongoConnect,mongoUri } = require('./util/database');
const MongoDBStore = require('connect-mongodb-session')(session);

const User = require('./models/user'); 
 
const PORT = process.env.PORT || 5000;

//-> Archivos requeridos para activar SSL/TLS Protocol
//const privateKey = fs.readFileSync('server.key');
//const certificate = fs.readFileSync('server.cert');

const app = express();

//-> Middleware para asegurar la App con la Activación de Headers de seguridad:
app.use(
  helmet({
    contentSecurityPolicy: false, // Se requiere para permitir la descarga de imagenes del CDN
  })
);

//-> Middleware para compresion de assets (con gzip)
app.use(compression());


//-> Middleware para Log Trace
const accessLogStream = fs.createWriteStream(
  path.join(__dirname, 'access.log'),
  { flags: 'a' }
);
app.use(morgan('combined', { stream: accessLogStream }));

//-> Usado para guardar las sesiones de usuario (ExpressSession)
const store = new MongoDBStore({
  uri: mongoUri,
  collection: 'sessions'
});

//-> Middleware para la creación de tokens CSRF (Csurf)
const csrfProtection = csrf();

//-> Especificacion de almacenamiento de imagenes (Multer)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'images');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.originalname); // + '-' + uniqueSuffix)
  }
})

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};


app.set('view engine','ejs');
app.set('views','views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

//app.use(bodyParser.urlencoded({extended: false}));
app.use(multer({ 
  storage: storage, 
  fileFilter: fileFilter 
}).single('image'));
app.use(express.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname,'public')));
app.use('/images', express.static(path.join(__dirname,'images')));

app.use(
  session({ 
    secret: 'my secret', 
    resave: false, 
    saveUninitialized: false, 
    store: store 
  })
);

app.use(csrfProtection);
app.use(flash());

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => {
      next(new Error(err));
    });
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use('/500', errorController.get500);
app.use(errorController.get404);
app.use((error, req, res, next) => {
  console.log('Error: ' + error);
  // res.status(error.httpStatusCode).render(...);
  res.redirect('/500');
});

mongoConnect
.then(result => {
  // https
  //   .createServer({ key: privateKey, cert: certificate }, app)
  //   .listen(PORT, () => console.log(`Listening on ${PORT}`));
  app.listen(PORT, () => console.log(`Listening on ${PORT}`));
})
.catch(err => {
  console.log(err)
});

