var User = require('../../models/user')
var bcrypt = require('bcryptjs');

// Lista de utilizadores
module.exports.users = () => {
	return User
		.find()
		.sort({nome: -1})
		.exec()
}

// Devolve a informação de um user pelo email
module.exports.post = email => {
	return User
		.findOne({email: email})
		.exec()
}

// Criar um utilizador
module.exports.createUser = function(newUser, callback) {
	bcrypt.genSalt(10, function(err, salt) {
		bcrypt.hash(newUser.password, salt, function(err,hash) {
			newUser.password = hash;
			newUser.save(callback);
		})
	})
}

// Get user ByEmail
module.exports.getUserByEmail = function(email, callback){
	var query = {email: email};
	User.findOne(query, callback);
}
  
// Get user By ID
module.exports.getUserById = function(id, callback){
	User.findById(id, callback);
}

// Function used to compare Passwords on login
module.exports.comparePassword = function(candidatePassword, hash, callback){
	bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
	  if(err) throw err;
	  callback(null, isMatch);
	});
}