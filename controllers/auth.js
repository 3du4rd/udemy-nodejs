exports.getLogin = (req, res, next) => {
  console.log(req.get('Cookie'));
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    isAuthenticated: req.isLoggedIn
  });
};

exports.postLogin = (req, res, next) => {
  res.setHeader('Set-Cookie','loggedIn=true; Max-Age=60; HttpOnly');
  res.redirect('/');
};
