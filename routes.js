var index = require('./routes/index');


module.exports = function (app) {
  app.get('/', index.index);
  
  app.get('/signup', index.unauth_user,index.signup);
  app.post('/signup', index.unauth_user,index.signup);
  app.get('/signin', index.unauth_user,index.signin);
  app.post('/signin', index.unauth_user, index.signin);
  app.get('/signout', index.auth_user,index.signout);
  app.post('/post', index.auth_user,index.post);
  app.get('/u/:name', index.user);
  
  app.get('*', index.pageNotFound);
};