var config = require('../config').config;
var moment = require('moment');
var flash = require('connect-flash');

var crypto = require('crypto');
var User = require('../models/user.js');
var Post = require('../models/post.js');


// URL /
exports.index = function (req, res, next) {
	Post.findAll(null,null, function(err, posts){
			if(err) {
				posts = [];
			}
			res.render('index', { 
				title: 'Welcome',
				posts: posts,
				user: req.session.user,
				success: req.flash('success').toString(),
				error: req.flash('error').toString()
			}); 		
		});
};

// URL /signin
exports.signin = function (req, res, next) {
  if (req.method == 'GET') {
	res.render('login', { 
				layout: false,
				title: 'Signin',
				success: req.flash('success').toString(),
				error: req.flash('error').toString(),
				user: req.session.user,
			}); 	
	} else if (req.method == 'POST') {// POST a post
		var md5 = crypto.createHash('md5');
		var password = md5.update(req.body.password).digest('hex');

		User.get(req.body.username, function(err, user){
			if(!user){
				req.flash('error', 'User doesnt exsit');
				return res.redirect('/signin');
			}
			if(user.password != password) {
				req.flash('error', 'Password didnt match');
				return res.redirect('/signin');
			}
			req.session.user = user;
			req.flash('success', 'Signin succeed!');
			return res.redirect('/');
		});
	}
};

// URL /signup
exports.signup = function (req, res, next) {
	if (req.method == 'GET') {
	res.render('signup', { 
				layout: false,
				title: 'Signup',
				success: req.flash('success').toString(),
				error: req.flash('error').toString(),
				user: req.session.user,
			}); 	
	} else if (req.method == 'POST') {// POST a post
		var name = req.body.username,
		password = req.body.password,
		password_re = req.body['password-repeat'];
		//检验用户两次输入的密码是否一致
		if (password_re != password) {
		  req.flash('error', 'Password doesn\'t match!'); 
		  return res.redirect('/signup');
		}
		//生成密码的 md5 值
		var md5 = crypto.createHash('md5'),
		password = md5.update(req.body.password).digest('hex');
		var newUser = {
			name: name,
			password: password
		};
		//检查用户名是否已经存在 
		User.get(newUser.name, function (err, user) {
		  if (user) {
			req.flash('error', 'User already exists!');
			return res.redirect('/signup');//用户名存在则返回注册页
		  }
		  //如果不存在则新增用户
		  User.save(newUser,function (err,user) {
			if (err) {
			  req.flash('error', err);
			  return res.redirect('/signup');
			}
			req.session.user = newUser;//用户信息存入 session
			req.flash('success', 'Signup suceed!');
			return res.redirect('/');//注册成功后返回主页
		  });
		});
	}
};

// URL /signout

exports.signout = function (req, res, next) {
	req.session.user = null;
    req.flash('success', 'Signout Sucessfully');
    return res.redirect('/');//登出后跳转到主页
};

// URL /post 
exports.post = function (req, res, next) {
	var currentUser = req.session.user,
    post = {
		user: currentUser.name, 
		post: req.body.post,
		time: moment().format()
	};
    Post.save(post,function (err) {
      if (err) {
        req.flash('error', err); 
        return res.redirect('/');
      }
      req.flash('success', 'Post Sucessfully!');
      return res.redirect('/');
    });
};


// URL /u/:name
exports.user = function (req, res, next) {
	var name = req.params.name;
	User.get(name, function (err, user) {
		if (!user) {
			req.flash('error',name+ ' doesn\'t exist!'); 
			return res.redirect('/');
		}
		Post.findByUser(name ,function(err, result){
			if(err) {
				//posts = [];
				req.flash('error', err); 
				return res.redirect('/');
			}
			res.render('user', { 
				title: 'Post',
				posts: result,
				user: req.session.user,
				success: req.flash('success').toString(),
				error: req.flash('error').toString()
			}); 		
		});
    }) 
};

// auth_user middleware
exports.auth_user = function (req, res, next) {
	if(!req.session.user){
		req.flash('error','Not login');
		return res.redirect('/signin');
	}
	next();
};

// unauth_user middleware
exports.unauth_user = function (req, res, next) {
	if(req.session.user){
		req.flash('error','Already login');
		return res.redirect('/');
	}
	next();
};

// URL: /404
exports.pageNotFound = function (req, res) {
  console.log('404 handler, URL' + req.originalUrl);
  res.render('404', {
    layout: false,
    status: 404,
    title: '404 NOT FOUND!'
  });
};