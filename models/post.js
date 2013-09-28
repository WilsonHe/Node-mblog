var db = require('../config.js').db;
var moment = require('moment');

db.bind('post');

exports.findAll = function (skip, limit, callback) {
  db.post.find().sort({created: -1, _id: -1}).skip(skip).limit(limit).toArray(function (err, result) {
    callback(err, result)
  });
};

exports.findByUser = function (name, callback) {
  db.post.find({user:name}).sort({time: -1}).toArray( function (err, result) {
    callback(err, result);
  });
};

exports.get = function (condition, callback) {
  db.post.findOne(condition, function (err, result) {
    callback(err, result);
  });
};

exports.save = function (obj, callback) {
  db.post.insert(obj, function (err, result) {
    callback(err, null);
  });
};


