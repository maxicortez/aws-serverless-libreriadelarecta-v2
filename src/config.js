
const secretToken = {
    secret: process.env.SECRET_TOKEN,
    expiresIn: process.env.SECRET_EXPIRED || 60 * 60 * 24, 
}

module.exports = {

    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT,
    database: process.env.DATABASE_NAME,
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    dialect: "mysql",

    secretToken,
}
