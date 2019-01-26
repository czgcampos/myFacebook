var express = require('express');
var router = express.Router();
var axios = require('axios')

router.get('/post/:idPost', function(req, res) {
    axios.get('http://localhost:5000/api/posts/post/' + req.params.idPost)
      .then(resposta=> res.render('post', { post: resposta.data }))
      .catch(erro => {
        console.log('Erro ao carregar post.')
        res.render('error', {error: erro, message: "Erro ao carregar post da BD."})
      })
})
  
/* mudar a privacidade */
router.patch('/post/:idPost', function(req, res) {
    axios.patch('http://localhost:5000/api/posts/post/' + req.params.idPost, req.body)
        .then(resposta=> res.render('post', { post: resposta.data }))
        .catch(erro => {
        console.log('Erro ao carregar post.')
        res.render('error', {error: erro, message: "Erro ao carregar post da BD."})
        })
})

module.exports = router;