var express = require('express')
var router = express.Router()
var Post = require('../../controllers/api/post')
var url = require('url');

var PostModel = require('../../models/post');

/*
    /feedpublico -> devolve todas as publicações com privacidade Publica e suporta querys no url para categoria e hashtag

    p.e.: /feedpublico?categoria=Evento&hashtag=pub

    - Funciona
*/
router.get('/feedpublico', (req,res)=>{
    var purl = url.parse(req.url, true);
    var query = purl.query;

    Post.listaPostsPublicos(query.categoria, query.hashtag)
        .then(dados => res.jsonp(dados))
        .catch(erro => res.status(500).send('Erro na listagem de posts.'))
})

/*
    /perfilpublico -> devolve todas as publicações do utilizador X com privacidade Pública e suporta querys no url para categoria e hashtag
*/
router.get('/perfilpublico', (req,res)=>{
    var purl = url.parse(req.url, true);
    var query = purl.query;

    Post.listaPostsPublicosAutor(req.user.email, query.categoria, query.hashtag)
        .then(dados => res.jsonp(dados))
        .catch(erro => res.status(500).send('Erro na listagem de posts.'))
})


/*
    /perfilprivador -> devolve todas as publicações do utilizador X com privacidade Privada e suporta querys no url para categoria e hashtag
*/
router.get('/perfilprivado', (req,res)=>{
    var purl = url.parse(req.url, true);
    var query = purl.query;

    Post.listaPostsPrivadosAutor(req.user.email, query.categoria, query.hashtag)
        .then(dados => res.jsonp(dados))
        .catch(erro => res.status(500).send('Erro na listagem de posts.'))
})

/*
    Inserir um Post
*/
router.post('/adicionarpost', (req,res)=>{
    var newPost = new PostModel({
        autor: req.user.email,
        texto: req.body.texto,
        categoria: req.body.categoria,
        hashtag: req.body.hashtag
    })
    
    /* falta adicionar código para ficheiro e isso... */

    Post.inserirPost(newPost)
        .then(dados => res.jsonp(dados))
        .catch(erro => res.status(500).send('Erro na inserção de Post.'))
})

/*
    Get de um post
*/
router.get('/post/:idPost', (req, res) => {
    Post.getPost(req.params.idPost)
        .then(dados => res.jsonp(dados))
        .catch(erro => res.status(500).send('Erro na listagem de post'))
})

/*
    Recebe o objeto normalmente
*/
router.patch('/post/:idPost', (req, res) => {
    var privado = req.body.privado
    //console.log("antes-> " + privado)
    //console.log("depos -> " +!privado)
    Post.atualizaPrivacidade(req.params.idPost, !privado)
        .then(dados => res.jsonp(dados))
        .catch(erro => res.status(500).send('Erro na atualização do post'))
})

module.exports = router

