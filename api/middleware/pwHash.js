const bcrypt = require('bcryptjs')

function pwHash(req,res,next) {
    const newUser = req.body

    const hash = bcrypt.hashSync(newUser.password, 10)
    newUser.password = hash
        console.log('newUser', newUser)
    req.newUser = newUser
    next()
}

module.exports = pwHash