// IMPORTS
    const jwt = require('jsonwebtoken')

// Sign Token
    const signToken = (tokenBody) => {
    console.log('signToken HELPER')
    console.log(process.env.JWTsecret);
    // -- //
        const tokenToReturn = jwt.sign(
            tokenBody,
            process.env.JWTsecret,
            {
                expiresIn: "2h"
            }
        )
        console.log(tokenToReturn)
    return tokenToReturn}

// EXPORTS
    module.exports = signToken