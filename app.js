const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const expressSession = require('express-session');
const cookieParser = require('cookie-parser');
const exphbs = require('express-handlebars');
const path = require('path');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');

const app = express();

// load models
require('./models/User');
require('./models/Story');

// Passport Config
require('./config/passport')(passport);

// Load routes
const index = require('./routes/index');
const auth = require('./routes/auth');
const stories = require('./routes/stories');

// load keys
const keys = require('./config/keys');

// Handlebars Helpers
const { truncate, stripTags, formatDate, select } = require('./helpers/hbs');

// mongoose connect
mongoose
  .connect(keys.mongoURI, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then(() => console.log('connected to mongoDB'))
  .catch(err => console.log(err));

// body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// method override middleware
app.use(methodOverride('_method'));

// Map global promises
mongoose.Promise = global.Promise;

// connections
mongoose.connection
  .once('open', () => {
    console.log('connected to storybooks-dev');
  })
  .on('error', error => {
    console.log(error);
  });

// handlebars middleware
app.engine(
  'handlebars',
  exphbs({
    helpers: {
      truncate,
      stripTags,
      formatDate,
      select,
    },
    defaultLayout: 'main',
  })
);
app.set('view engine', 'handlebars');

// cookie parser middleware
app.use(cookieParser());

// express session middleware
app.use(
  expressSession({
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Set global vars
app.use((req, res, next) => {
  res.locals.user = req.user || null;
  next();
});

// set static folder
app.use(express.static(path.join(__dirname, 'public')));

// Use routes
app.use('/', index);
app.use('/auth', auth);
app.use('/stories', stories);

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
