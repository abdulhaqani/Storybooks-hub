const express = require('express');
const passport = require('passport');

const router = express.Router();

router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
  })
);

router.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/',
    scope: 'https://www.googleapis.com/auth/plus.login',
  }),
  (req, res) => {
    res.redirect('/dashboard');
  }
);
router.post('/login', () => {
  console.log('post req');
});

module.exports = router;
