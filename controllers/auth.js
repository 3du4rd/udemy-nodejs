require('dotenv').config();
const bcrypt = require('bcryptjs');
const nodemailer = require("nodemailer");
const User = require('../models/user'); 

//sgMail.setApiKey(process.env.SENDGRID_API_KEY);

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

          // create reusable transporter object using the default SMTP transport
          let transporter = nodemailer.createTransport({
            host: process.env.SMTP_SERVER,
            port: process.env.SMTP_PORT,
            secure: true, // true for 465, false for other ports
            auth: {
              user: process.env.SMTP_USER, // generated ethereal user
              pass: process.env.SMTP_PASSWORD // generated ethereal password
            },
          });

          // send mail with defined transport object
          transporter.sendMail({
            from: '3du4rd@gmail.com', // sender address
            to: email, // list of receivers
            subject: "SignUp Success ✔", // Subject line
            text: "Welcome to my Shop?", // plain text body
            html: "<b>Welcome to my Shop?</b>", // html body
          })
          .then(result => {
            console.log("Message sent: %s", result.messageId);
          })
          .catch(err =>{
            console.error(err);
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
