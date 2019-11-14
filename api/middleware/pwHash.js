// IMPORTS
    const bcrypt = require('bcryptjs')

// HASH PASSWORD MIDDLEWARE
function pwHash(req,res,next) {
console.log('pwHash MIDDLEWARE')
const newUser = req.body
// -- //
    try {
        // 1: Hash password with bcryptjs
            const hash = bcrypt.hashSync(newUser.password, 10)
                console.log(hash)
        // 2: Overwrite sent PW with new hash
            newUser.password = hash
        // 3: Pre Exit Check
            console.log('newUser', newUser)
        // 4: Set Req
            req.newUser = newUser
        // 5.1: Go TO Next Middleware
            next()
    } catch {
        // 5: Send Failure Response
            res.status(500).json( { error: 'Failed Hash'} )
    }
}

module.exports = pwHash