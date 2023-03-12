const { mysqlConnection } = require("../services/database");
const { createToken } = require("../services/jwt");

const getMe = async (req, res) => {
    try {
        const id = req.body.tokenId;
        var [rows] = await mysqlConnection.query("SELECT * FROM users WHERE id = ?", [id]);
        if (rows.length == 0) {
            res.status(404).json({ error: true, message: "User not found" });
        } else {
            delete rows[0].password;
            if (rows[0].blocked !== 0) {
                res.status(404).json({ error: true, message: "User blocked" });
                return;
            }
            const [empresas] = await mysqlConnection.query(
                "SELECT empresas.id, empresas.nombreEmpresa, empresas.sucursal, empresas.cuit, empresas.blocked " +
                    "FROM empresas INNER JOIN users_empresas ON users_empresas.idEmpresa = empresas.id WHERE users_empresas.idUser = ?",
                [id]
            );
            empresas.map((empresa) => (empresa.blocked = empresa.blocked === 0 ? false : true));
            rows[0].empresas = empresas;
            rows[0].blocked = rows[0].blocked === 0 ? false : true;
            res.status(200).json(rows[0]);
        }
    } catch (error) {
        console.log(error);
        res.status(404).json({ error: true, message: error });
    }
};

const getUsers = async (req, res) => {
    try {
        var [rows] = await mysqlConnection.query("SELECT * FROM users");
        if (rows.length == 0) {
            res.status(200).json(rows);
        } else {
            rows.map(async (user, id) => {
                delete user.password;
                user.blocked = user.blocked === 0 ? false : true;
                var [empresas] = await mysqlConnection.query(
                    "SELECT empresas.id, empresas.nombreEmpresa, empresas.sucursal, empresas.cuit, empresas.blocked " +
                        "FROM empresas INNER JOIN users_empresas ON users_empresas.idEmpresa = empresas.id WHERE users_empresas.idUser = ?",
                    [user.id]
                );
                empresas.map((empresa) => (empresa.blocked = empresa.blocked === 0 ? false : true));
                rows[id].empresas = empresas;
            });
            res.status(200).json(rows);
        }
    } catch (error) {
        console.log(error);
        res.status(404).json({ error: true, message: "error" });
    }
};

const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        var [rows] = await mysqlConnection.query("SELECT * FROM users WHERE id = ?", [id]);
        if (rows.length == 0) {
            res.status(404).json({ error: true, message: "User not found" });
        } else {
            delete rows[0].password;
            rows[0].blocked = rows[0].blocked === 0 ? false : true;
            res.status(200).json(rows[0]);
        }
    } catch (error) {
        res.status(404).json({ error: true, message: "error" });
    }
};

const createUser = async (req, res) => {
    try {
        var { username, email, password, blocked } = req.body;
        if (username == undefined || typeof username !== "string") {
            res.status(403).json({ error: true, message: "Require 'username' type 'string" });
            return;
        }
        if (email == undefined || typeof email !== "string") {
            res.status(403).json({ error: true, message: "Require 'email' type 'string'" });
            return;
        }
        if (password == undefined || typeof password !== "string") {
            res.status(403).json({ error: true, message: "Require 'password' type 'string'" });
            return;
        }
        if (blocked == undefined || typeof blocked !== "boolean") {
            res.status(403).json({ error: true, message: "Require 'blocked' type 'boolean'" });
            return;
        }
        const [rows] = await mysqlConnection.query("INSERT INTO users(username, email, password, blocked, createdAt, updatedAt) VALUES(?,?,?,?,?,?)", [
            username,
            email,
            password,
            blocked,
            new Date(),
            new Date(),
        ]);
        res.status(201).json({ id: rows.insertId, username, email, blocked });
    } catch (error) {
        if (process.env.NODE_ENV == "development") {
            res.status(500).json({ error });
        } else {
            if ((error.code = "ER_DUP_ENTRY")) {
                res.status(500).json({ error: true, message: "User create duplicated" });
            } else {
                res.status(500).json({ error: true, message: "User create error" });
            }
        }
    }
};

const login = async (req, res) => {
    try {
        var { username, password } = req.body;
        if (username == undefined || typeof username !== "string") {
            res.status(500).json({ error: true, message: "Require 'username' type 'string", body: req.body });
            return;
        }
        if (password == undefined || typeof password !== "string") {
            res.status(500).json({ error: true, message: "Require 'password' type 'string'" });
            return;
        }
        var [rows] = await mysqlConnection.query("SELECT idUsuario, nombre, correo, telefono, idRol, esActivo FROM Usuario WHERE nombre = ? AND clave = ?", [username, password]);
        if (rows.length) {
            if (!rows[0].esActivo == 0) {
                const token = await createToken(rows[0].id);
                const [rol] = await mysqlConnection.query("SELECT * FROM Rol empresas WHERE idRol = ?", [rows[0].idRol]);
                if (rol.length) {
                    if (!rol[0].esActivo == 0) {
                        rows[0].jwt = token;
                        rows[0].idRolNavigation = rol[0];
                        res.status(200).json(rows[0]);
                    } else {
                        res.status(500).json({ error: true, message: "Rol de usuario bloqueado" });
                    }
                } else {
                    res.status(500).json({ error: true, message: "El usuario no posee un rol asignado" });
                }
            } else {
                res.status(500).json({ error: true, message: "Usuario bloqueado" });
            }
        } else {
            res.status(500).json({ error: true, message: "Nombre de usuario y contraseña incorrectos" });
        }
    } catch (error) {
        console.log(error);
        res.status(501).json({ error: true, message: error });
    }
};

const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        var { username, email, blocked } = req.body;
        if (username == undefined || typeof username !== "string") {
            res.status(401).json({ error: true, message: "Require 'username' type 'string" });
            return;
        }
        if (email == undefined || typeof email !== "string") {
            res.status(401).json({ error: true, message: "Require 'email' type 'string'" });
            return;
        }
        if (blocked == undefined || typeof blocked !== "boolean") {
            res.status(401).json({ error: true, message: "Require 'blocked' type 'boolean'" });
            return;
        }
        const [result] = await mysqlConnection.query("UPDATE users SET username= IFNULL(?,username), email=IFNULL(?,email), blocked=IFNULL(?,blocked), updatedAt=? WHERE id=?", [
            username,
            email,
            blocked,
            new Date(),
            parseInt(id),
        ]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: true, message: "User not found" });
        } else {
            res.status(201).json({ affectedRows: result.affectedRows, id: parseInt(id), username, email, blocked });
        }
    } catch (error) {
        res.status(404).json({ error: true, message: error });
    }
};

const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await mysqlConnection.query("DELETE FROM users WHERE id=?", [parseInt(id)]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: true, message: "User not found" });
        } else {
            res.status(201).json({ affectedRows: result.affectedRows, id: parseInt(id) });
        }
    } catch (error) {
        res.status(404).json({ error: true, message: error });
    }
};

module.exports = {
    login,
    getMe,
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
};
