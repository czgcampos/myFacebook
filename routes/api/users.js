

var express = require('express')
var router = express.Router()
var User = require('../../controllers/api/User')
var url = require('url');

/*
    Get de um post
*/
router.get('/user/:idUser', (req, res) => {
    User.getUserById(req.params.idUser)
        .then(dados => res.jsonp(dados))
        .catch(erro => res.status(500).send('Erro na listagem de user'))
})

module.exports = router