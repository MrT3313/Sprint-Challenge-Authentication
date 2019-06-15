const axios = require('axios');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const { authenticate } = require('../auth/authenticate');

// KNEX DB
  const DB_KNEX = require('../database/dbConfig.js')

// MIDDLEWARE
  const pwHash = require('../api/middleware/pwHash.js')

// SECRETS
  const secrets = require('../secrets.js')
  
  

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

async function login(req, res) {
  // implement user login
  console.log('loginRouter POST/')

  const { username, password } = req.body
    console.log('username, password', username, password)
  
  DB_KNEX('users')
    .where('username', username)
    .first()
      .then( user => {
        console.log('user', user )
        
        const pwVerification = bcrypt.compareSync(password, user.password)
        console.log('pwVerification', pwVerification)

        if (user && pwVerification) {
          console.log('secrets', secrets)
          console.log('secrets.jwtSecret', secrets.jwtSecret)

          const token = jwt.sign(
            {
              userID: user.id,
              userName: user.username
            },
            secrets.jwtSecret,
            {
              expiresIn: "2h"
            }
          )
          console.log('token', token)

          res.status(200).json({
              message: `Welcome ${username}`, 
              user: user.id,
              token,
          })
        } else {
          res.status(401).json( { error: 'Unabel to Login'} )
        }

      })
      .catch( err => {
        res.status(500).json( { error: 'Unable to Login'} )
      })
    

}

function getJokes(req, res) {
  console.log('getJokesRouter POST/')
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
