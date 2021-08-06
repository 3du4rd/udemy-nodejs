exports.getLogin = (req, res, next) => {
  //console.log(req.get('Cookie'));
  console.log('User isLoggedIn: ' + req.session.isLoggedIn);
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    isAuthenticated: req.isLoggedIn
  });
};

exports.postLogin = (req, res, next) => {
  //res.setHeader('Set-Cookie','loggedIn=true; Max-Age=60; HttpOnly');
  req.session.isLoggedIn = true;
  res.redirect('/');
};
