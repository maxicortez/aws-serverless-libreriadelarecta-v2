const bcrypt = require('bcryptjs')

const encrypt = async (text) => {
    const salt = await bcrypt.genSalt(10)
    return bcrypt.hash(text, salt)
}

module.exports = {
    encrypt,
}