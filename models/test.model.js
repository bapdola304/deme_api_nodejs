var mongoose = require('mongoose');
 var userChema = new mongoose.Schema({
 	name : String,
 	description : String,
 	price : String,
 	img : String
 });

 var User = mongoose.model('test', userChema,'Data');
  module.exports = User;