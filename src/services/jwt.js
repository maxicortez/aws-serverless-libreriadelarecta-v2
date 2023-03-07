const jwt = require('jsonwebtoken');
const { secretToken } = require('../config')
const { mysqlConnection } =  require('../services/database')

const createToken = async (userId)=> {
    const token = await jwt.sign({id: userId}, secretToken.secret, {expiresIn: secretToken.expiresIn});
    return token
}

const checkToken = async (token) => {
    try {
        const res = await jwt.verify(token, secretToken.secret)
        return res            
    } catch (error) {
        return {auth: false, message: error}
    }
}

//middlewares
const validateToken = async (req, res, next) => {    
    try {
        const authParam = await getApiAuthentication(req.route.path, req.route.stack[0].method)
        if (authParam.length === 0) {
            res.status(401).json({auth: false, message: "api/endpoint empty configuration"})
            return
        }
        if (authParam[0].blocked !== 0) {
            res.status(400).json({auth: false, message: "api/endpoint blocked"})
            return
        } else {
            if (authParam[0].ahtenticated === 0) {
                next()
                return
            }
        }

        const reqToken = req.headers["authorization"]
        if (reqToken) {
            const result = await checkToken(reqToken.split(" ").pop())
            if (result.id) {
                const [ rows ] = await mysqlConnection.query("SELECT blocked FROM users WHERE id = ?", [result.id])
                if (rows.length === 0) {
                    res.status(402).json({auth: false, message: "User token not exist"})        
                    return  
                } else {
                    if (rows[0].blocked !== 0 ) {
                        res.status(403).json({auth: false, message: "User token blocked"})
                        return
                    }
                }
                req.body.tokenId = result.id
                next();
            } else {
                res.status(402).json(result)
            }
        } else {
            res.status(404).json({auth: false, message: "No token provided"})
        }
    } catch (error) {   
        res.status(404).json({auth: false, error})
    }
}

//Internal functions
const getApiAuthentication = async (endpoint, method)=> {
    try {
        const [rows] = await mysqlConnection.query("SELECT blocked, ahtenticated FROM apiauthentications WHERE endpoint = ? and method = ?", [endpoint, method])
        return rows.length == 0 ? [] : rows
    } catch (error) {
        return []
    }    
}

module.exports = {
    createToken,
    checkToken,
    validateToken,
}