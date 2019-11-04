const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const expressSession = require('express-session');
const cookieParser = require('cookie-parser');

// load models
require('./models/User');

// Passport Config
require('./config/passport')(passport);

// Load routes
const auth = require('./routes/auth');

// load keys
const keys = require('./config/keys');

// Map global promises
mongoose.Promise = global.Promise;

// mongoose connect
mongoose
  .connect(keys.mongoURI, { useNewUrlParser: true })
  .then(() => console.log('connected to mongoDB'))
  .catch(err => console.log(err));

const app = express();

app.get('/', (req, res) => {
  res.send('Working 1');
});

//
app.use(cookieParser);
app.use(
  expressSession({
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
  })
);

// Set global vars
app.use((req, res, next) => {
  res.locals.user = req.user || null;
  next();
});

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Use routes
app.use('/auth', auth);

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
