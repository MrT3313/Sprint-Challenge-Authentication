const axios = require('axios');

const { authenticate } = require('../auth/authenticate');

// KNEX DB
  const DB_KNEX = require('../database/dbConfig.js')

// MIDDLEWARE
  const pwHash = require('../api/middleware/pwHash.js')
  

module.exports = server => {
  server.post('/api/register', pwHash, register);
  server.post('/api/login', login);
  server.get('/api/jokes', authenticate, getJokes);
};

async function register(req, res) {
  /* Accepted Shape 
    {
      "username": "STRING",
      "password": "STRING"
    }
  */
  console.log('registerRouter POST/')
  console.log(req.body)

  DB_KNEX('users')
    .insert(req.body)
    .then( result => {
      console.log('result', result )
      
      res.status(200).json( result )

    })
    .catch( err => {
      res.status(500).json( { error: 'Unable to register new user'} )
    })
}

function login(req, res) {
  // implement user login
  console.log('loginRouter POST/')
}

function getJokes(req, res) {
  const requestOptions = {
    headers: { accept: 'application/json' },
  };

  axios
    .get('https://icanhazdadjoke.com/search', requestOptions)
    .then(response => {
      res.status(200).json(response.data.results);
    })
    .catch(err => {
      res.status(500).json({ message: 'Error Fetching Jokes', error: err });
    });
}
