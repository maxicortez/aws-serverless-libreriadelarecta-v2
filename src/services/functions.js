const { mysqlConnection } = require("../services/database");

const findId = async (tableName, id) => {
    try {
        if (!tableName) return { error: "tableName is required" }
        if (id == undefined) return { error: "id is required" }
        const queryString = `SELECT id FROM ${tableName} WHERE id = ${id}`;
        const [user] = await mysqlConnection.query(queryString)
        if (user.length === 0) return { error: "id not found" };
        return {id}            
    } catch (error) {
        return {error}
    }
}

const findUserById = async (id) => {
    try {
        if (id == undefined) return { error: "id is required" }
        var queryString = `SELECT * FROM users WHERE id = ${id}`;
        const [user] = await mysqlConnection.query(queryString)
        if (user.length === 0) return { error: "id user not found" };
        queryString = `SELECT empresas.id, empresas.cuit, empresas.blocked FROM empresas 
                INNER JOIN users_empresas ON users_empresas.idEmpresa = empresas.id where idUser = ${id}`
        const [empresas] = await mysqlConnection.query(queryString)
        return {user : user[0], empresas}            
    } catch (error) {
        return {error}
    }
}

const findEmpresaById = async (id) => {
    try {
        if (id == undefined) return { error: "id is required" }
        const queryString = `SELECT * FROM empresas WHERE id = ${id}`;
        const [empresa] = await mysqlConnection.query(queryString)
        if (empresa.length === 0) return 0
        return {empresa: empresa[0]}            
    } catch (error) {
        return {error}
    }
}

const findMaterialByMultipleStrings = async (idEmpresa, ean, nombreMaterial) => {
    try {
        if (idEmpresa == undefined) return { error: "idEmpresa is required" }        
        if (ean === undefined) return { error: "ean is required" }
        if (!nombreMaterial) return { error: "nombreMaterial is required" }
        const queryString = `SELECT id, blocked FROM materiales WHERE idEmpresa = ${idEmpresa} AND ean = '${ean}' AND nombreMaterial = '${nombreMaterial}'`;
        const [material] = await mysqlConnection.query(queryString)
        if (material.length === 0) {
            return {count: material.length}    
        } else {
            return {count: material.length, id : material[0].id, blocked : material[0].blocked}
        }
    } catch (error) {
        return {error}
    }
}

const findIdByString = async (idEmpresa, tableName, columnName, findDescription, idExclud) => {
    try {
        if (!columnName) return { error: "columnName is required" };
        if (!tableName) return { error: "tableName is required" };
        if (!findDescription) return { error: "findDescription is required" };
        if (idEmpresa == undefined) return { error: "idEmpresa is required" };
        if (idExclud == undefined) return { error: "idExclud is required" };
        var queryString = `SELECT id FROM empresas WHERE id = ${idEmpresa}`;
        const [empresa] = await mysqlConnection.query(queryString);
        if (empresa.length === 0) return { error: "idEmpresa not found" };
        queryString = `SELECT id FROM ${tableName} WHERE idEmpresa = ${idEmpresa} AND ${columnName} = '${findDescription}' AND id <> ${idExclud}`;
        
        console.log(queryString)
        
        const [rows] = await mysqlConnection.query(queryString);
        if (rows.length === 0) {
            return 0;
        } else {
            return rows[0];
        }
    } catch (error) {
        return { error: error };
    }
};

const findIdByStringRelation = async (idEmpresa, tableName, tableRelation, columnRelation, findRelation, 
        columnNameRelation, columnName, findDescription, idExclud) => {
    try {
        if (!columnName) return { error: "columnName is required" };
        if (!tableName) return { error: "tableName is required" };
        if (!tableRelation) return { error: "tableName is required" };
        if (!findDescription) return { error: "findDescription is required" };
        if (!columnRelation) return { error: "columnRelation is required" };
        if (!columnNameRelation) return { error: "columnNameRelation is required" };
        if (!findRelation) return { error: "findRelation is required" };
        if (idEmpresa == undefined) return { error: "idEmpresa is required" };
        if (idExclud == undefined) return { error: "idExclud is required" };
        var queryString = `SELECT id FROM empresas WHERE id = ${idEmpresa}`;
        const [empresa] = await mysqlConnection.query(queryString);
        if (empresa.length === 0) return { error: "idEmpresa not found" };
        const idRelation = await findIdByString(idEmpresa,tableRelation,columnRelation,findRelation, 0)
        if (!idRelation.id) return { error: "idRelation not found" };
        queryString = `SELECT id FROM ${tableName} WHERE idEmpresa = ${idEmpresa} AND ${columnNameRelation} = ${idRelation.id} AND ${columnName} = '${findDescription}' AND id <> ${idExclud}`;
        const [rows] = await mysqlConnection.query(queryString);
        if (rows.length === 0) {
            return 0;
        } else {
            return rows[0];
        }
    } catch (error) {
        return { error: error };
    }
};

const findCreateByString = async (idEmpresa, idUser, tableName, columnName, findDescription) => {
    try {
        if (!columnName) return {error: "columnName is required"}
        if (!tableName) return {error: "tableName is required"}
        if (!findDescription) return { error: "findDescription is required" };
        if (idEmpresa == undefined) return {error: "idEmpresa is required"}
        if (idUser == undefined) return {error: "idUser is required"}
        var queryString = `SELECT id FROM users WHERE id = ${idUser}`;
        const [user] = await mysqlConnection.query(queryString);
        if (user.length === 0) return { error: "idUser not found" };
        queryString = `SELECT id FROM empresas WHERE id = ${idEmpresa}`;
        const [empresa] = await mysqlConnection.query(queryString);
        if (empresa.length === 0) return { error: "idEmpresa not found" };
        queryString = `SELECT id FROM ${tableName} WHERE idEmpresa = ${idEmpresa} AND ${columnName} = '${findDescription}'`;
        const [rows] = await mysqlConnection.query(queryString);
        if (rows.length !== 0) return { id: rows[0].id, created: false };
        queryString = `INSERT INTO ${tableName}(idEmpresa, ${columnName}, createdAt, createdId, blocked) VALUES(${idEmpresa}, '${findDescription}', now(), ${idUser}, 0)`;
        const [result] = await mysqlConnection.query(queryString);
        if (result) {
            return { id: result.insertId, created: true };
        } else {
            return { error: "Error in created" };    
        }
    } catch (error) {
        return { error: error };
    }
};

const findCreateByStringRelation = async (idEmpresa, idUser, tableName, tableRelation, columnRelation, 
    findRelation, columnNameRelation, columnName, findDescription) => {
    try {
        if (!columnName) return {error: "columnName is required"}
        if (!tableName) return {error: "tableName is required"}
        if (!findDescription) return {error: "findDescription is required"}
        if (idEmpresa == undefined) return {error: "idEmpresa is required"}
        if (idUser == undefined) return {error: "idUser is required"}

        var queryString = `SELECT id FROM users WHERE id = ${idUser}`;
        const [user] = await mysqlConnection.query(queryString);
        if (user.length === 0) return { error: "idUser not found" };
        
        queryString = `SELECT id FROM empresas WHERE id = ${idEmpresa}`;
        const [empresa] = await mysqlConnection.query(queryString);
        if (empresa.length === 0) return { error: "idEmpresa not found" };
        
        const idRelation = await findIdByString(idEmpresa,tableRelation,columnRelation,findRelation, 0)
        if (!idRelation.id) return { error: "idRelation not found" };

        queryString = `SELECT id FROM ${tableName} WHERE idEmpresa = ${idEmpresa} AND ${columnNameRelation} = ${idRelation.id} AND ${columnName} = '${findDescription}'`;
        const [rows] = await mysqlConnection.query(queryString);
        if (rows.length !== 0) return { id: rows[0].id, created: false };
        queryString = `INSERT INTO ${tableName}(idEmpresa, ${columnNameRelation}, ${columnName}, createdAt, createdId, blocked) VALUES(${idEmpresa}, ${idRelation.id}, '${findDescription}', now(), ${idUser}, 0)`;
        const [result] = await mysqlConnection.query(queryString);
        if (result) {
            return { id: result.insertId, created: true };
        } else {
            return { error: "Error in created" };    
        }
    } catch (error) {
        return { error: error };
    }
};



module.exports = {
    findId,
    findUserById, 
    findEmpresaById, 
    findMaterialByMultipleStrings, 
    findIdByString,
    findIdByStringRelation,
    findCreateByString,
    findCreateByStringRelation,
};
