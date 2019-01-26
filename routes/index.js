var express = require('express');
var router = express.Router();
var axios = require('axios')
var passport = require('passport')

var User = require('../models/user');
var UserController = require('../controllers/api/user');

/* GET home page. */
router.get('/', function(req, res, next) {
    if (req.user) {
      res.redirect('/feed');
    }
    else {
      res.redirect('/login');
    }
});

router.get('/login', function(req, res, next) {
  res.render('login');
});

router.get('/registar', function(req, res, next) {
  res.render('register');
});

router.post('/registar', function(req, res) {
    var nome = req.body.nome;
    var email = req.body.email;
    var password = req.body.password;
    var password2 = req.body.password2;
    var dataNascimento = req.body.dataNascimento;
    var genero = req.body.genero;
    var localidade = req.body.localidade;

	if (password == password2) {
        var newUser = new User({
            nome : nome,
            email : email,
            password :password,
            dataNascimento : dataNascimento,
            genero : genero,
            localidade : localidade
        })

        console.log("novo user")
        console.log(newUser)

        UserController.createUser(newUser, function(err, user) {
            if(err) throw err;
            console.log(user);
            // supostamente falta enviar coisas 
        });
    }
    else {
        // falta mandar um erro
        console.log("palavras passes diferentes");
    }

	//req.flash('success_msg', 'You are registered')
    // apenas para testar
    res.send("falhou");
	//res.redirect('/users/registar');
});

router.post('/login', passport.authenticate('local', {
    successRedirect: '/feed',
    failureRedirect: '/login'
}))

// Endpoint to get current user
router.get('/user', function(req, res){
  res.send(req.user);
})

// Endpoint to logout
/* não está a funcionar muito bem */
router.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

//falta verificar autenticação - estava a dar erro
router.get('/feed', (req,res) => {
  axios.get('http://localhost:5000/api/posts/feedpublico')
    .then(resposta=> res.render('feed', { posts: resposta.data }))
    .catch(erro => {
      console.log('Erro ao carregar dados da BD.')
      res.render('error', {error: erro, message: "Erro ao carregar dados da BD."})
    })
})

router.get('/perfilpublico', (req,res) => {
  axios.get('http://localhost:5000/api/posts/perfilpublico')
    .then(resposta=> res.render('userPublic', { posts: resposta.data }))
    .catch(erro => {
      console.log('Erro ao carregar dados da BD.')
      res.render('error', {error: erro, message: "Erro ao carregar dados da BD."})
    })
})

router.get('/perfilprivado', (req,res) => {
  axios.get('http://localhost:5000/api/posts/perfilprivado')
    .then(resposta=> res.render('userPrivate', { posts: resposta.data }))
    .catch(erro => {
      console.log('Erro ao carregar dados da BD.')
      res.render('error', {error: erro, message: "Erro ao carregar dados da BD."})
    })
})

router.get('/adicionarpost', function(req, res, next) {
    res.render('addPost');
});

router.post('/adicionarpost', function(req, res) {
  axios.post('http://localhost:5000/api/posts/adicionarpost', req.body)
    .then(()=> res.redirect('http://localhost:5000/feed'))
    .catch(erro => {
      console.log('Erro ao inserir dados da BD.')
      res.redirect('http://localhost:5000/adicionarpost')
    })
});

router.get('/auth/facebook',
  passport.authenticate('facebook'));


  router.get('/auth/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    console.log("LOGADO COM O FACEBOOK -> "+req.user)
    res.redirect('/feed');
  }
);


module.exports = router;