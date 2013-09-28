/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var routes = require('./routes');
var config = require('./config.js');
var partials = require('express-partials');
var flash = require('connect-flash');
//var MongoStore = require('connect-mongo')(express);
var RedisStore = require("connect-redis")(express);
var app = express();
var static_dir = __dirname + '/public';


app.configure(function () {
  app.set('port', config.port);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.compress());
  app.use(express.favicon());
	
  app.use(partials());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.cookieParser());
  app.use(express.session({
	store: new RedisStore({
		port: config.redis_port,
		host: config.redis_host,
		pass: config.redis_pass
		}),
		
	secret: config.session_secret,
	cookie: { secure: true }
  }));
  app.use(flash());
});

app.configure('development', function () {
  app.use(express.static(static_dir));
  app.use(express.errorHandler({
    dumpExceptions: true,
    showStack: true
  }));
});

app.configure('production', function () {
  var one_year = 31557600000;
  app.use(express.static(static_dir, {
    maxAge: one_year
  }));
  app.use(express.errorHandler());
  app.set('view cache', true);
});

routes(app);

http.createServer(app).listen(app.get('port'), function () {
  console.log("Express server listening on port " + app.get('port'));
});
