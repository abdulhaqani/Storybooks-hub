const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');

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

const port = process.env.PORT || 5000;

app.get('/', (req, res) => {
  res.send('Working 1');
});

// Use routes
app.use('/auth', auth);

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
