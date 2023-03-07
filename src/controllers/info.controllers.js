const { name, version, description } = require("../../package.json");
const { mysqlConnection } = require("../services/database");
const {
    findIdByString,
    findIdByStringRelation,
    findCreateByString,
    findUserById,
    findEmpresaById,
    findId,
    findCreateByStringRelation,
    findMaterialByMultipleStrings,
} = require("../services/functions");
const encrypt = require("../services/encrypt");
const { createToken } = require("../services/jwt");

const getInfo = async (req, res) => {
    res.status(200).json({
        status: "ok",
        enviroment: process.env.NODE_ENV,
        appname: name,
        version: version,
        description: description,
        date: new Date(),
        hash: await encrypt.encrypt("maximiliano cortez"),
        token: await createToken(1),
    });
};

const testSQL = async (req, res) => {
    try {
        var { tokenId } = req.body;
        if (!tokenId) tokenId = 0;
        const { sql } = req.body;
        const [rows] = await mysqlConnection.query(sql);
        console.log(rows, tokenId);
        res.status(200).json(rows);
    } catch (error) {
        console.log(error);
        res.status(404).json({ error });
    }
};

const testFunctions = async (req, res) => {
    try {
        //const data = await findId("rubros", 1)
        //const data = await findUserById(39)
        //const data = await findEmpresaById(2)
        //const data = await findIdByString(1, "proveedores", "cuit", "123456", 0)
        //const data = await findIdByStringRelation(1,"subrubros", "rubros", "nombrerubro", "generico", "idRubro", "nombresubrubro", "generico", 0)
        //const data = await findCreateByString(1, 25, "rubros", "nombrerubro", "test3")
        //const data = await findCreateByStringRelation(1, 39, "subrubros", "rubros", "nombrerubro", "test3", "idrubro", "nombresubrubro","subrubro de test3")
        //const data = await findMaterialByMultipleStrings(1,"generico", "generico", "generico", "generico", "generico", "generico", 0,"", "test")
        res.status(200).json({
            id: 1,
            username: "mmmm",
            email: "lapinchila@mmm.com",
            jwt: "1234567890",
            empresas: { id: 1, nombreEmpresa: "Libreria Max", sucursal: "Ernesto Castellano", cuit: "1234567890", blocked: false },
        });
    } catch (error) {
        res.status(404).json({ error });
    }
};

module.exports = {
    getInfo,
    testSQL,
    testFunctions,
};
