module.exports = {
  // eslint-disable-next-line object-shorthand
  ensureAuthenticated: function(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    res.redirect('/');
  },
  // eslint-disable-next-line object-shorthand
  ensureGuest: function(req, res, next) {
    if (req.isAuthenticated()) {
      res.redirect('/dashboard');
    } else {
      return next();
    }
  },
};
