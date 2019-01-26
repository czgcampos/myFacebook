var Post = require('../../models/post')
var mongoose = require('mongoose')

// Devolve a informação de uma publicação
module.exports.getPost = pid => {
	return Post
		.findOne({_id: pid})
		.exec()
}

// Fazer like
module.exports.likeInc = pid => {
	return Post
		.update({_id: pid},{$inc: {likes: 1}})
		.exec()
}

// Insere uma publicação
module.exports.inserirPost = post => {
	return Post.create(post)
}

// Fazer um comentário
module.exports.comentar = (pid,autor,comentario) => {
	return Post
		.update({_id: pid},{$push:{comentarios:[autor,comentário]}})
		.exec()
}

// suporta querys de categoria e hastag
module.exports.listaPostsPublicos = (categoria, hashtag) => {
	if (categoria && hashtag) {
		return Post
			.find({
				categoria: categoria,
				hashtag: hashtag,
				privado: false
			})
			.sort({data: -1})
			.exec()
	}
	else if (categoria && !hashtag) {
		return Post
			.find({
				categoria: categoria,
				privado: false
			})
			.sort({data: -1})
			.exec()
	}
	else if (!categoria && hashtag) {
		return Post
			.find({
				hashtag: hashtag,
				privado: false
			})
			.sort({data: -1})
			.exec()
	}
	else {
		return Post
			.find({
				privado:false
			})
			.sort({data: -1})
			.exec()
	}
}

// suporta querys de categoria e hastag
module.exports.listaPostsPublicosAutor = (autor, categoria, hashtag) => {
	if (categoria && hashtag) {
		return Post
			.find({
				autor: autor,
				categoria: categoria,
				hashtag: hashtag,
				privado: false
			})
			.sort({data: -1})
			.exec()
	}
	else if (categoria && !hashtag) {
		return Post
			.find({
				autor: autor,
				categoria: categoria,
				privado: false
			})
			.sort({data: -1})
			.exec()
	}
	else if (!categoria && hashtag) {
		return Post
			.find({
				autor: autor,
				hashtag: hashtag,
				privado: false
			})
			.sort({data: -1})
			.exec()
	}
	else {
		return Post
			.find({
				autor: autor,
				privado:false
			})
			.sort({data: -1})
			.exec()
	}
}

module.exports.listaPostsPrivadosAutor = (autor, categoria, hashtag) => {
	if (categoria && hashtag) {
		return Post
			.find({
				autor: autor,
				categoria: categoria,
				hashtag: hashtag,
				privado: true
			})
			.sort({data: -1})
			.exec()
	}
	else if (categoria && !hashtag) {
		return Post
			.find({
				autor: autor,
				categoria: categoria,
				privado: true
			})
			.sort({data: -1})
			.exec()
	}
	else if (!categoria && hashtag) {
		return Post
			.find({
				autor: autor,
				hashtag: hashtag,
				privado: true
			})
			.sort({data: -1})
			.exec()
	}
	else {
		return Post
			.find({
				autor: autor,
				privado: true
			})
			.sort({data: -1})
			.exec()
	}
}

// Devolve a informação de uma publicação
module.exports.atualizaPrivacidade = (pid, privacidade) => {
	return Post
		.updateOne({_id: pid},{$set: {privado:privacidade}})
		.exec()
}
