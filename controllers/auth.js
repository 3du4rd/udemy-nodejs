const User = require('../models/user'); 

exports.getLogin = (req, res, next) => {
  //console.log(req.get('Cookie'));
  console.log('User isLoggedIn: ' + req.session.isLoggedIn);
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    isAuthenticated: false
  });
};

exports.getSignup = (req, res, next) => {
  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Signup',
    isAuthenticated: false
  });
};

exports.postLogin = (req, res, next) => {
  //res.setHeader('Set-Cookie','loggedIn=true; Max-Age=60; HttpOnly');
  console.log(req.body.email + ' ' + req.body.password);
  const email = req.body.email;
  const password = req.body.password;
  if (email) {
    User.findById('610b576921367994107d617d')
      .then(user => {
        console.log(user);
        req.session.isLoggedIn = true;
        req.session.user = user;
        req.session.save(err =>{
          console.error(err);
          res.redirect('/');
        });        
      })
      .catch(err => {
          console.log('Usuario no encontrado');
          console.error(err);
        });
  }
};

exports.postSignup = (req, res, next) => {

};

exports.postLogout = (req, res, next) => {
  req.session.destroy(err => {
    console.log(err);
    res.redirect('/');
  });
};
