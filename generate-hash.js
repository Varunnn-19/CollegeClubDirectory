const bcrypt = require('bcrypt')

const password = 'Admin@123456'
const hash = bcrypt.hashSync(password, 10)

console.log(`Password: ${password}`)
console.log(`Hash: ${hash}`)
