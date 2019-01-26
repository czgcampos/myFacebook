var express = require('express')
var router = express.Router()
var Post = require('../../controllers/api/Post')

router.get('/feedpublico', (req,res)=>{
    Post.posts()
        .then(dados => res.jsonp(dados))
        .catch(erro => res.status(500).send('Erro na listagem de posts.'))
})

router.get('/perfilpublico', (req,res)=>{
    Post.postsPublicosAutor(req.user.email)
        .then(dados => res.jsonp(dados))
        .catch(erro => res.status(500).send('Erro na listagem de posts.'))
})

router.get('/perfilprivado', (req,res)=>{
    Post.postsPrivadosAutor(req.user.email)
        .then(dados => res.jsonp(dados))
        .catch(erro => res.status(500).send('Erro na listagem de posts.'))
})

module.exports = router