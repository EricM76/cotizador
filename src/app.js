require('dotenv').config();

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const session = require('express-session');
const methodOverride = require('method-override');
const localsUserCheck = require('./middlewares/localsUserCheck');
const userSessionCheck = require('./middlewares/userSessionCheck');


const chainsRouter = require('./routes/chain');
const clothsRouter = require('./routes/cloth');
const colorsRouter = require('./routes/color');
const ordersRouter = require('./routes/order');
const patternsRouter = require('./routes/pattern');
const pricesRouter = require('./routes/price');
const quotersRouter = require('./routes/quoter');
const supportsRouter = require('./routes/support');
const systemsRouter = require('./routes/system');
const informationRouter = require('./routes/information');
const usersRouter = require('./routes/users');
const responseRouter = require('./routes/response');
const rolsRouter = require('./routes/rol');
const accessoriesRouter = require('./routes/accesories');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(session({
  secret : "CoT1zADor",
  resave: false,
  saveUninitialized: true
}))
app.use(methodOverride('_method'));
app.use(localsUserCheck);

app.use(express.static(path.join(__dirname, '..','public')));

app.use('/chains',userSessionCheck, chainsRouter);
app.use('/cloths',userSessionCheck, clothsRouter);
app.use('/colors',userSessionCheck, colorsRouter);
app.use('/orders',userSessionCheck, ordersRouter);
app.use('/patterns',userSessionCheck, patternsRouter);
app.use('/prices',userSessionCheck, pricesRouter);
app.use('/quoters',userSessionCheck, quotersRouter);
app.use('/supports',userSessionCheck, supportsRouter);
app.use('/systems',userSessionCheck, systemsRouter);
app.use('/users', usersRouter);
app.use('/information', informationRouter);
app.use('/response', responseRouter);
app.use('/rols',userSessionCheck, rolsRouter);
app.use('/accessories',userSessionCheck,accessoriesRouter);
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
