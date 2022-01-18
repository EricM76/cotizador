require('dotenv').config();

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const methodOverride = require('method-override');

const chainsRouter = require('./routes/chain');
const clothsRouter = require('./routes/cloth');
const colorsRouter = require('./routes/color');
const ordersRouter = require('./routes/order');
const patternsRouter = require('./routes/pattern');
const pricesRouter = require('./routes/price');
const quotersRouter = require('./routes/quoter');
const supportsRouter = require('./routes/support');
const systemsRouter = require('./routes/system');
const usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(methodOverride('_method'));

app.use(express.static(path.join(__dirname, '..','public')));

app.use('/chains', chainsRouter);
app.use('/cloths', clothsRouter);
app.use('/colors', colorsRouter);
app.use('/orders', ordersRouter);
app.use('/patterns', patternsRouter);
app.use('/prices', pricesRouter);
app.use('/quoters', quotersRouter);
app.use('/supports', supportsRouter);
app.use('/systems', systemsRouter);
app.use('/users', usersRouter);
app.use('/', (req,res) => res.redirect('/quoters/add'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
