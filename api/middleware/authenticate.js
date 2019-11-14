// IMPORTS
    const jwt = require('jsonwebtoken');
    
// AUTHENTICATE MIDDLEWARE
    const authenticateToken = (req,res,next) => {
    console.log('authenticateToken MIDDLEWARE')
    // -- //
        // 1: Get secret from process.env
            const authSecret = process.env.JWTsecret
                console.log(authSecret)
        // 2: Get token off request
            const token = req.get('authorization')
                console.log(token)
        // 3: Verify token 
            token ? (
                jwt.verify(token, authSecret, (err, decoded) => {
                    // 3.1: if err === true => send 500 status
                        err && res.status(401).json( 'GET OUT OF HERE' )
                    // 3.2: successful decoding
                        if (decoded) {
                            req.decoded = decoded
                            next()
                        }
                })
            ) : (
                res.status(500).json( {message: 'No token provided -- but be set as authorization on request header'} )
            )
    }

// EXPORTS
    module.exports = authenticateToken

