exports.get404 = (req, res, next) => {
    res.status(404).render('404', { 
        path: '/', 
        pageTitle: 'Page Not Found',
        isAuthenticated: req.session.isLoggedIn 
     });
}

exports.get500 = (req, res, next) => {
    res.status(404).render('500', { 
        path: '/500', 
        pageTitle: 'Shop Error!',
        isAuthenticated: req.session.isLoggedIn 
     });
}