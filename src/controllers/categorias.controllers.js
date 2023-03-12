const { mysqlConnection } = require("../services/database");

const getAllCategorias = async (req, res) => {
    try {
        const [rows] = await mysqlConnection.query("SELECT idCategoria, descripcion, esActivo, fechaRegistro FROM categoria");
        rows.map((row) => row.esActivo = row.esActivo === 0 ? false : true);
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({ error: true, message: "error" });
    }
};

const createCategoria = async (req, res) => {
    try {
        const { descripcion, esActivo } = req.body;
        console.log("esActivo:", esActivo);
        if (descripcion == undefined || typeof descripcion !== "string" || descripcion.trim() === "") {
            res.status(500).json({ error: true, message: "Require 'descripcion' type 'string" });
            return;
        }
        if (esActivo == undefined || typeof esActivo !== "boolean") {
            res.status(500).json({ error: true, message: "Require 'esActivo' type 'boolean'" });
            return;
        }
        const queryInsert = `INSERT INTO categoria(descripcion, esActivo) VALUES('${descripcion}', ${esActivo})`;
        const [rows] = await mysqlConnection.query(queryInsert);
        res.status(201).json({ idCategoria: rows.insertId, created: true, updated: false });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error });
    }
};

const updateCategoria = async (req, res) => {
    try {
        const { id } = req.params;
        const { descripcion, esActivo } = req.body;
        if (descripcion == undefined || typeof descripcion !== "string" || descripcion.trim() === "") {
            res.status(500).json({ error: true, message: "Require 'descripcion' type 'string" });
            return;
        }
        if (esActivo == undefined || typeof esActivo !== "boolean") {
            res.status(500).json({ error: true, message: "Require 'esActivo' type 'boolean'" });
            return;
        }
        const [result] = await mysqlConnection.query("UPDATE categoria SET descripcion=?, esActivo=? WHERE idCategoria=?", [descripcion, esActivo, parseInt(id)]);
        if (result.affectedRows === 0) {
            return res.status(500).json({ error: true, message: "categoria not found" });
        } else {
            res.status(200).json({ affectedRows: result.affectedRows, idCategoria: parseInt(id), descripcion, esActivo });
        }
    } catch (error) {
        res.status(501).json({ error: true, message: error });
    }
};

const deleteCategoria = async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await mysqlConnection.query("DELETE FROM categoria WHERE idCategoria=?", [parseInt(id)]);
        if (result.affectedRows === 0) {
            return res.status(500).json({ error: true, message: "categoria not found" });
        } else {
            res.status(200).json({ affectedRows: result.affectedRows, idCategoria: parseInt(id) });
        }
    } catch (error) {
        res.status(501).json({ error: true, message: error });
    }
};

module.exports = {
    getAllCategorias,
    createCategoria,
    updateCategoria,
    deleteCategoria,
};
