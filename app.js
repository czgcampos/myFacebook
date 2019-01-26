var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser')
var logger = require('morgan');
var mongoose = require('mongoose')
mongoose.set('useCreateIndex', true);

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var postsAPIRouter = require('./routes/api/posts')

var UserController = require('./controllers/api/user')

var uuid = require('uuid/v4')
var session = require('express-session')
var FileStore = require('session-file-store')(session)

var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy
var axios = require('axios')
var flash = require('connect-flash')

//Base de Dados
mongoose.connect('mongodb://127.0.0.1:27017/myfacebook', {useNewUrlParser:true})
  .then(()=> console.log('Mongo ready: ' + mongoose.connection.readyState))
  .catch(()=> console.log('Erro de conexão.'))


var app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Middleware da Sessão
app.use(session({
  genid: req => {
    console.log('Dentro do middleware da sessão: ' + req.sessionID)
    return uuid()
  },
  store: new FileStore(),
  secret: 'myFacebookApp',
  resave: false,
  saveUninitialized: true
}))

// Passport init
app.use(passport.initialize());
app.use(passport.session());

// Configuração da estratégia de autenticação
passport.use(new LocalStrategy(
  {usernameField: 'email'},
  function(email, password, done) {
    UserController.getUserByEmail(email, function(err, user){
      if(err) throw err;
      if(!user){
        return done(null, false, {message: 'Unknown User'});
      }
      UserController.comparePassword(password, user.password, function(err, isMatch){
        if(err) throw err;
     	if(isMatch){
     	  return done(null, user);
     	} else {
     	  return done(null, false, {message: 'Invalid password'});
     	}
     });
   });
  }
));

//Serialização do utilizador
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

//Função Inversa
passport.deserializeUser(function(id, done) {
  UserController.getUserById(id, function(err, user) {
    done(err, user);
  });
});


app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api/posts', postsAPIRouter)

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