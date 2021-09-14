const createError = require('http-errors');
const express = require('express');
const path = require('path');
const flash = require('connect-flash')
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const hbs = require('express-handlebars');
const session = require('express-session')
const MongoDbStore = require("connect-mongodb-session")(session);
const Admin = require('./models/Admin')
const dotenv = require('dotenv')
const app = express();

dotenv.config({ path: "./.env" });

const store = new MongoDbStore({
  uri: process.env.MONGODB_URI,
  collection: "session",
});

// Importing Routes
const indexRouter = require('./routes/index');
const adminRouter = require('./routes/admin')
const authRoutes = require('./routes/auth')

// Middlewares
const adminMiddleware = require('./middleware/admin')
const eA = require('./middleware/eA')
const errorHandler = require('./middleware/error')

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.engine('hbs', hbs({
  extname: 'hbs',
  defaultLayout: 'layout',
  layoutsDir: path.join(__dirname, 'views/layouts'),
  partialsDir: [
    //  path to your partials
    path.join(__dirname, 'views/partials'),
  ],
  runtimeOptions: {
    allowProtoPropertiesByDefault: true,
    allowProtoMethodsByDefault: true
  }
}));

// MongoDB connect
require('./helper/db')()

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));
app.use(cookieParser());
app.use(session({
  secret: 'some secret value',
  resave: false,
  saveUninitialized: false,
  store
}))

app.use(async (req, res, next) => {
  req.admin = req.session.admin;
  if (req.admin) {
    res.locals.user = await Admin.findById(req.session.admin._id);
    res.locals.user = {
      fullname: res.locals.user.name,
      avatar: res.locals.user.avatar,
      _id: res.locals.user._id,
    };
  }
  next()
})

app.use(flash())
app.use(eA)
app.use(adminMiddleware)

// Admin ====
app.use('/admin', express.static(path.join(__dirname, 'public')))
app.use('/admin:any', express.static(path.join(__dirname, 'public')))

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/admin', adminRouter);
app.use('/auth', authRoutes);
app.use(errorHandler)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;