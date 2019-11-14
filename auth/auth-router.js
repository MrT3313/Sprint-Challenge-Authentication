// IMPORTS
  const router = require('express').Router();
  const DB_KNEX = require('../database/dbConfig.js')
  const bcrypt = require('bcryptjs')

// MIDDLEWARE
  const pwHash = require('../api/middleware/pwHash.js')

// HELPERS
  const signToken = require('../helpers/signToken.js')

// REGISTER ROUTER
  router.post('/register', pwHash, (req, res) => {
  console.log('registerRoute POST/')
  console.log(req.body)
  /* Accepted USER Shape
    {
      "username" : "STRING" *         
      "password" : "STRING" *
    }
      * = Required
  */
  // -- //
    DB_KNEX('users')
      .insert(req.body)
        .then( register_success => {
          console.log('register_success', register_success )
          // -- //
          // 1: Sign Token
            const token = signToken(register_success)
              console.log(token)

          // 2: Send Response w/ token
            res.status(200).json( token )
        })
        .catch(() => {
          res.status(500).json( { error: 'Unable to Register New User'} )
        })
  });

// LOGIN ROUTER
  router.post('/login', async (req,res) => {
  console.log('loginRouter post/')
  const {username, password} = req.body
  console.log(username, password)
    /* Accepted USER Shape
    {
      "username" : "STRING" *         
      "password" : "STRING" *
    }
      * = Required
  */
  // -- //
    DB_KNEX('users')
      .where('username', username).first()
        .then( foundUser => {
        console.log('foundUser', foundUser )
        // -- //
          // 1: Verify PW for foundUser
              const pwVerification = bcrypt.compareSync(
                password,
                foundUser.password
              )
              console.log('pwVerification',pwVerification)

          // 2: Conditional for pwVerification
            if (pwVerification === true) {
              // 2.1: Sign Token
                const token = signToken(req.body)
                  console.log(token)
              // 2.2: Send Response w/ Token
                res.status(200).json( token )
            } else {
              res.status(401).json( { error: 'Unable to Login'} )
            }
          
        })
        .catch( err => {
          res.status(401).json( { error: 'FUCK'} )
        })

  })

module.exports = router;
