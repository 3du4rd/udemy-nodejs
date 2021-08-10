require('dotenv').config();
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const mailgun = require("mailgun-js");
const { validationResult } = require('express-validator/check');

const User = require('../models/user'); 

exports.getLogin = (req, res, next) => {
  let message = req.flash('error');
  if (message.length >0){
    message = message[0];
  } 
  else {
    message = null;
  }
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    errorMessage: message
  });
};

exports.getSignup = (req, res, next) => {
  let message = req.flash('error');
  if (message.length >0){
    message = message[0];
  } 
  else {
    message = null;
  }
  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Signup',
    errorMessage: message
  });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  User.findOne({ email: email })
      .then(user => {
        if (!user){
          req.flash('error','Invalid email or password');
          return res.redirect('/login');
        }
        bcrypt.compare(password, user.password)
        .then(doMatch =>{
          if (doMatch){
            req.session.isLoggedIn = true;
            req.session.user = user;
            return req.session.save(err =>{
              console.error(err);
              res.redirect('/');
            });
          }
          req.flash('error','Invalid email or password');
          res.redirect('/login');
        })
        .catch(err => {          
          console.error(err);
        });        
      })
      .catch(err => {
          console.log('Usuario no encontrado');
          console.error(err);
      });
};

exports.postSignup = (req, res, next) => {
  //TODO 1. Validate inputs
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors.array());
    return res.status(422).render('auth/signup', {
      path: '/signup',
      pageTitle: 'Signup',
      errorMessage: errors.array()
    });
  }
  User.findOne({ email: email })
    .then(userDoc => {
      if (userDoc) {
        req.flash('error','Email exists already, please pick a different one');
        return res.redirect('/signup');
      }
      return bcrypt.hash(password, 12)
        .then(hashedPassword => {
          const user = new User({
            email: email,
            password: hashedPassword,
            cart: { items: [] }
          });
          return user.save();
        })
        .then(result => {

          res.redirect('/login');

          const mg = mailgun({ apiKey: process.env.MG_APIKEY, 
                               domain: process.env.MG_DOMAIN });
          const data = {
            from: 'NodeJS Shop <3du4rd@gmail.com>',
            to: email,
            subject: 'SignUp Success!',
            text: 'Welcome to my store!'
          };
          mg.messages().send(data, function (error, body) {
            console.log(body);
          });

        })    
        .catch(err => {
          console.log(err);
        });
    })
    .catch(err => {
      console.log(err);
    });
};

exports.postLogout = (req, res, next) => {
  req.session.destroy(err => {
    console.log(err);
    res.redirect('/');
  });
};

exports.getReset = (req, res, next) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render('auth/reset', {
    path: '/reset',
    pageTitle: 'Reset Password',
    errorMessage: message
  });
};

exports.postReset = (req, res, next) => {
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
      return res.redirect('/reset');
    }
    const token = buffer.toString('hex');
    User.findOne({ email: req.body.email })
      .then(user => {
        if (!user) {
          req.flash('error', 'No account with that email found.');
          return res.redirect('/reset');
        }
        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 3600000;
        return user.save();
      })
      .then(result => {
        res.redirect('/');

        const mg = mailgun({ apiKey: process.env.MG_APIKEY, 
                             domain: process.env.MG_DOMAIN
        });

        const data = {
          from: 'NodeJS Shop <3du4rd@gmail.com>',
          to: req.body.email,
          subject: 'Password reset!',
          text: `You requested a password reset ${token}`,
          html: `<p>You requested a password reset</p>
                 <p>Click this <a href="${process.env.URL_PWD_RESET}/${token}">link</a> to set a new password.</p>`
        };
        mg.messages().send(data, function (error, body) {
          console.log(body);
        });
      })
      .catch(err => {
        console.log(err);
      });
  });
};

exports.getNewPassword = (req, res, next) => {
  const token = req.params.token;
  User.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } })
    .then(user => {
      let message = req.flash('error');
      if (message.length > 0) {
        message = message[0];
      } else {
        message = null;
      }
      res.render('auth/new-password', {
        path: '/new-password',
        pageTitle: 'New Password',
        errorMessage: message,
        userId: user._id.toString(),
        passwordToken: token
      });
    })
    .catch(err => {
      console.log(err);
    });
};

exports.postNewPassword = (req, res, next) => {
  const newPassword = req.body.password;
  const userId = req.body.userId;
  const passwordToken = req.body.passwordToken;
  let resetUser;

  User.findOne({
    resetToken: passwordToken,
    resetTokenExpiration: { $gt: Date.now() },
    _id: userId
  })
    .then(user => {
      resetUser = user;
      return bcrypt.hash(newPassword, 12);
    })
    .then(hashedPassword => {
      resetUser.password = hashedPassword;
      resetUser.resetToken = undefined;
      resetUser.resetTokenExpiration = undefined;
      return resetUser.save();
    })
    .then(result => {
      res.redirect('/login');
    })
    .catch(err => {
      console.log(err);
    });
};
