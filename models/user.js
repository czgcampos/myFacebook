var mongoose = require('mongoose')
var Schema = mongoose.Schema

var UserSchema = new Schema({
	nome: {type: String, required: true},
	email: {type: String, required: true, unique: true},
	password: {type: String, required: true},
	dataNascimento : {type: Date, required: true},
	genero: {type: String, required: true},
	localidade: {type: String, required: true},
	descricao: {type: String},
	// guarda-se o path (acho que é melhor)
	imagem: {type: String}
})

module.exports = mongoose.model('Users', UserSchema, 'users')