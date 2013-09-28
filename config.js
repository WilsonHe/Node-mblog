var mongoskin = require('mongoskin');

module.exports = { 
  name: 'MicroBlog',
  version: '0.0.1',
  session_secret: process.env.SESSION_SECRET || 'topsecret',//session secret
  cookie_secret: process.env.COOKIE_SECRET || 'cookiesecret',//cookie secret
  port: process.env.PORT || 3000,
  db: mongoskin.db(process.env.MONGOLAB_URI ||"mongodb://localhost:27001/test"),//your mongodb url
  redis_host: 'localhost', 
  redis_port: '6379',
  redis_pass: 'password'
};

