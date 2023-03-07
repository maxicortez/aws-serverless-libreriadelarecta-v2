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

const getMaterialesPointOfSale = async (req, res) => {
    try {

    console.log(req.body)
    
    const { idEmpresa, findQuery } = req.body
    if (idEmpresa == undefined || typeof idEmpresa !== "number") {
        res.status(403).json({ error: true, message: "Require 'idEmpresa' type 'number'" });
        return;
    }
    if (findQuery == undefined ) {
        res.status(403).json({ error: true, message: "Require 'findQuery' type 'string" });
        return;
    }
    const { empresa } = await findEmpresaById(idEmpresa);
    if (empresa == undefined || !empresa.id) {
        res.status(403).json({ error: true, message: "idEmpresa not found" });
        return;
    }

    const queryString = `SELECT materiales.id, materiales.Rubro, materiales.Subrubro, materiales.Categoria, materiales.SubCategoria, materiales.Marca, ` + 
	    `materiales.Modelo, proveedores.nombreProveedor as Proveedor , materiales.nombreMaterial AS Descripcion, ` +  
        `materiales.sku AS Codigo, materiales.ean AS Cod_Barras, materiales.Stock, materiales.Umb ,materiales.total as Precio, ` +  
	    `if(materiales.updatedAt = null, materiales.updatedAt, materiales.createdAt) AS Modificado FROM materiales ` +  
        `INNER JOIN proveedores ON proveedores.id = materiales.idProveedor ` +  
	    `WHERE materiales.blocked = 0 AND materiales.idEmpresa = ${idEmpresa} AND (materiales.nombreMaterial like '%${findQuery}%' or ` +  
	    `materiales.ean like '%${findQuery}%' or proveedores.nombreProveedor like '%${findQuery}%') ` +
        `ORDER BY Descripcion`

    const [rows] = await mysqlConnection.query(queryString);
    res.status(200).json({rows: rows.length, data : rows});
    } catch (error) {
        
    }
}


const getMaterials = async (req, res) => {
    try {
        const { idEmpresa } = req.params;
        var [rows] = await mysqlConnection.query("SELECT * FROM materiales WHERE idEmpresa = ?", [idEmpresa]);
        res.status(200).json(rows);
    } catch (error) {
        res.status(404).json({ error: true, message: "error" });
    }
};

const getMaterialById = async (req, res) => {
    try {
        const { id, idEmpresa } = req.params;
        var [rows] = await mysqlConnection.query("SELECT * FROM materiales WHERE id = ?", [id]);
        if (rows.length == 0) {
            res.status(404).json({ error: true, message: "User not found" });
        } else {
            delete rows[0].password;
            rows[0].blocked = rows[0].blocked === 0 ? false : true;
            res.status(200).json(rows);
        }
    } catch (error) {
        res.status(404).json({ error: true, message: "error" });
    }
};

const createMaterial = async (req, res) => {
    try {
        var {
            idEmpresa,
            rubro,
            subrubro,
            categoria,
            subcategoria,
            marca,
            modelo,
            umb,
            cuitProveedor,
            nombre,
            codigo,
            codBarras,
            stock,
            costo,
            iva21,
            iva105,
            iibb4,
            ci06,
            porcImp1,
            porcImp2,
            porcGanancia1,
            porcGanancia2,
            porcGanancia3,
            blocked,
        } = req.body;

        if (idEmpresa == undefined || typeof idEmpresa !== "number") {
            res.status(403).json({ error: true, message: "Require 'ID Empresa' type 'number'" });
            return;
        }
        if (rubro == undefined || typeof rubro !== "string" || rubro.trim() === "") {
            res.status(403).json({ error: true, message: "Require 'Rubro' type 'string" });
            return;
        }
        if (subrubro == undefined || typeof subrubro !== "string" || subrubro.trim() === "") {
            res.status(403).json({ error: true, message: "Require 'SubRubro' type 'string'" });
            return;
        }
        if (categoria == undefined || typeof categoria !== "string" || categoria.trim() === "") {
            res.status(403).json({ error: true, message: "Require 'Categoria' type 'string'" });
            return;
        }
        if (subcategoria == undefined || typeof subcategoria !== "string" || subcategoria.trim() === "") {
            res.status(403).json({ error: true, message: "Require 'SubCategoria' type 'string'" });
            return;
        }
        if (marca == undefined || typeof marca !== "string" || marca.trim() === "") {
            res.status(403).json({ error: true, message: "Require 'Marca' type 'string'" });
            return;
        }
        if (modelo == undefined || typeof modelo !== "string" || modelo.trim() === "") {
            res.status(403).json({ error: true, message: "Require 'Modelo' type 'string'" });
            return;
        }
        if (umb == undefined || typeof umb !== "string" || umb.trim() === "") {
            res.status(403).json({ error: true, message: "Require 'Unidad de medida base (umb)' type 'string'" });
            return;
        }
        if (cuitProveedor == undefined || typeof cuitProveedor !== "string" || cuitProveedor.trim() === "") {
            res.status(403).json({ error: true, message: "Require 'Cuit proveedor' type 'string'" });
            return;
        }
        if (nombre == undefined || typeof nombre !== "string") {
            res.status(403).json({ error: true, message: "Require 'Nombre material' type 'string'" });
            return;
        }
        if (codigo == undefined || typeof codigo !== "number") {
            res.status(403).json({ error: true, message: "Require 'Codigo' type 'number'" });
            return;
        }
        if (codBarras == undefined || typeof codBarras !== "string") {
            res.status(403).json({ error: true, message: "Require 'Cod Barras' type 'string'" });
            return;
        }
        if (stock == undefined || typeof stock !== "number") {
            res.status(403).json({ error: true, message: "Require 'Stock' type 'number'" });
            return;
        }
        if (costo == undefined || typeof costo !== "number") {
            res.status(403).json({ error: true, message: "Require 'Costo' type 'number'" });
            return;
        }
        if (iva21 == undefined || typeof iva21 !== "boolean") {
            res.status(403).json({ error: true, message: "Require 'Iva 21%' type 'boolean'" });
            return;
        }
        if (iva105 == undefined || typeof iva105 !== "boolean") {
            res.status(403).json({ error: true, message: "Require 'Iva 10,5' type 'boolean'" });
            return;
        }
        if (iibb4 == undefined || typeof iibb4 !== "boolean") {
            res.status(403).json({ error: true, message: "Require 'IIBB 4%' type 'boolean'" });
            return;
        }
        if (ci06 == undefined || typeof ci06 !== "boolean") {
            res.status(403).json({ error: true, message: "Require 'Com & Industria 0,6%' type 'boolean'" });
            return;
        }
        if (porcImp1 == undefined || typeof porcImp1 !== "number") {
            res.status(403).json({ error: true, message: "Require 'Porc1 %' type 'number'" });
            return;
        }
        if (porcImp2 == undefined || typeof porcImp2 !== "number") {
            res.status(403).json({ error: true, message: "Require 'Porc2 %' type 'number'" });
            return;
        }
        if (porcGanancia1 == undefined || typeof porcGanancia1 !== "number") {
            res.status(403).json({ error: true, message: "Require '% Ganancia 1' type 'number'" });
            return;
        }
        if (porcGanancia2 == undefined || typeof porcGanancia2 !== "number") {
            res.status(403).json({ error: true, message: "Require '% Ganancia 2' type 'number'" });
            return;
        }
        if (porcGanancia3 == undefined || typeof porcGanancia3 !== "number") {
            res.status(403).json({ error: true, message: "Require '% Ganancia 3' type 'number'" });
            return;
        }
        if (blocked == undefined || typeof blocked !== "boolean") {
            res.status(403).json({ error: true, message: "Require 'blocked' type 'boolean'" });
            return;
        }

        var { tokenId } = req.body;
        if (!tokenId) tokenId = 0;

        const { empresa } = await findEmpresaById(idEmpresa);
        if (empresa == undefined || !empresa.id) {
            res.status(403).json({ error: true, message: "idEmpresa not found" });
            return;
        }

        const idRubro = await findCreateByString(idEmpresa, tokenId, "rubros", "nombrerubro", rubro);
        if (!idRubro.id) {
            res.status(403).json({ error: true, message: "Error in created rubro" });
            return;
        }
        const idSubRubro = await findCreateByStringRelation(idEmpresa, tokenId, "subrubros", "rubros", "nombrerubro", rubro, "idRubro", "nombresubrubro", subrubro);
        if (!idSubRubro.id) {
            res.status(403).json({ error: true, message: "Error in created subrubro" });
            return;
        }

        const idCategoria = await findCreateByString(idEmpresa, tokenId, "categorias", "nombrecategoria", categoria);
        if (!idCategoria.id) {
            res.status(403).json({ error: true, message: "Error in created categoria" });
            return;
        }
        const idSubCategoria = await findCreateByStringRelation(idEmpresa, tokenId, "subcategorias", "categorias", "nombrecategoria", categoria, "idCategoria", "nombresubcategoria", subcategoria);
        if (!idSubCategoria.id) {
            res.status(403).json({ error: true, message: "Error in created subcategoria" });
            return;
        }

        const idMarca = await findCreateByString(idEmpresa, tokenId, "marcas", "nombremarca", marca);
        if (!idMarca.id) {
            res.status(403).json({ error: true, message: "Error in created marca" });
            return;
        }

        const idModelo = await findCreateByString(idEmpresa, tokenId, "modelos", "nombremodelo", modelo);
        if (!idModelo.id) {
            res.status(403).json({ error: true, message: "Error in created modelo" });
            return;
        }

        const idUmb = await findCreateByString(idEmpresa, tokenId, "umb", "umb", umb);
        if (!idUmb.id) {
            res.status(403).json({ error: true, message: "Error in created unidad media base (umb)" });
            return;
        }

        const idProveedor = await findIdByString(idEmpresa, "proveedores", "cuit", cuitProveedor, 0);
        if (!idProveedor.id) {
            res.status(403).json({ error: true, message: "Cuit proveedor not found" });
            return;
        }

        const impIva21 = iva21 == true ? (costo * 21) / 100 : 0;
        const impIva105 = iva105 == true ? (costo * 10.5) / 100 : 0;
        const impIibb = iibb4 == true ? (costo * 4) / 100 : 0;
        const impCi = ci06 == true ? (costo * 0.6) / 100 : 0;
        const impPorcImp1 = porcImp1 !== 0 ? (costo * porcImp1) / 100 : 0;
        const impPorcImp2 = porcImp2 !== 0 ? (costo * porcImp2) / 100 : 0;

        const newCosto = costo + impIva21 + impIva105 + impIibb + impCi + impPorcImp1 + impPorcImp2;
        const impGanancia1 = porcGanancia1 !== 0 ? (newCosto * porcGanancia1) / 100 : 0;
        const impGanancia2 = porcGanancia2 !== 0 ? (newCosto * porcGanancia2) / 100 : 0;
        const impGanancia3 = porcGanancia3 !== 0 ? (newCosto * porcGanancia3) / 100 : 0;

        const total = newCosto + impGanancia1 + impGanancia2 + impGanancia3;

        const findMaterial = await findMaterialByMultipleStrings(idEmpresa, codBarras, nombre);
        if (findMaterial.count === 0) {
            const queryInsert =
                `INSERT INTO materiales(idEmpresa,idRubro,idSubRubro,idCategoria,idSubCategoria,idMarca,idModelo,idUmb,idProveedor,` +
                `rubro,subrubro,categoria,subcategoria,marca,modelo,umb,nombreMaterial,sku,ean,stock,costo,iva21,iva105,iibb4,ci06,impIva21,impIva105,` +
                `impIibb,impCi06,porcImpuestos1,porcImpuestos2,impuestos1,impuestos2,subTotal,porcGanancia1,porcGanancia2,porcGanancia3,ganancia1,` +
                `ganancia2,ganancia3,total,createdAt,createdId,blocked) ` +
                `VALUES(${idEmpresa}, ${idRubro.id}, ${idSubRubro.id}, ${idCategoria.id}, ${idSubCategoria.id}, ${idMarca.id}, ${idModelo.id}, ${idUmb.id}, ${idProveedor.id}, ` +
                `'${rubro}', '${subrubro}', '${categoria}', '${subcategoria}', '${marca}', '${modelo}', '${umb}', ` +
                `'${nombre}', ${codigo}, '${codBarras}', ${stock}, ${costo}, ${+iva21}, ${+iva105}, ${+iibb4}, ${+ci06}, ${impIva21}, ${impIva105}, ${impIibb}, ${impCi}, ` +
                `${porcImp1}, ${porcImp2}, ${impPorcImp1}, ${impPorcImp2}, ${newCosto}, ${porcGanancia1}, ${porcGanancia2}, ${porcGanancia3}, ` +
                `${impGanancia1}, ${impGanancia2}, ${impGanancia3}, ${total}, now(), ${tokenId}, ${+blocked})`;

            const [rows] = await mysqlConnection.query(queryInsert);
            res.status(201).json({ id: rows.insertId, created: true, updated: false });
        } else {
            const queryUpdate =
                `UPDATE materiales SET idRubro = ${idRubro.id}, idSubRubro = ${idSubRubro.id}, idCategoria = ${idCategoria.id} , ` + 
                `idSubCategoria = ${idSubCategoria.id}, idMarca = ${idMarca.id}, idModelo = ${idModelo.id}, idUmb = ${idUmb.id}, idProveedor = ${idProveedor.id},` +
                `rubro = '${rubro}', subrubro = '${subrubro}', categoria = '${categoria}', subcategoria = '${subcategoria}', marca = '${marca}', modelo = '${modelo}', ` + 
                `umb = '${umb}', nombreMaterial = '${nombre}', sku = ${codigo}, ean = '${codBarras}', stock = stock + ${stock}, costo = ${costo}, iva21 = ${+iva21}, ` + 
                `iva105 = ${+iva105}, iibb4 = ${+iibb4}, ci06 = ${+ci06}, impIva21 = ${impIva21}, impIva105 = ${impIva105}, impIibb = ${impIibb},impCi06 = ${impCi}, ` + 
                `porcImpuestos1 = ${porcImp1}, porcImpuestos2 = ${porcImp2}, impuestos1 = ${impPorcImp1}, impuestos2 = ${impPorcImp2}, subTotal = ${newCosto}, ` + 
                `porcGanancia1 = ${porcGanancia1}, porcGanancia2 = ${porcGanancia2}, porcGanancia3 = ${porcGanancia3}, ganancia1 = ${impGanancia1}, ` +
                `ganancia2 = ${impGanancia2}, ganancia3 = ${impGanancia3}, total = ${total}, updatedAt = now(), updatedCostosAt = now(),` + 
                `updatedId = ${tokenId}, updatedCostosId = ${tokenId}, blocked = ${+blocked} WHERE id = ${findMaterial.id}`
            const [rows] = await mysqlConnection.query(queryUpdate);
            res.status(201).json({ id: findMaterial.id, created: false, updated: true });
        }
    } catch (error) {
        console.log(error);
        if (process.env.NODE_ENV == "development") {
            res.status(500).json({ error });
        } else {
            if ((error.code = "ER_DUP_ENTRY")) {
                res.status(500).json({ error: true, message: "Material create duplicated" });
            } else {
                res.status(500).json({ error: true, message: "Material create error" });
            }
        }
    }
};

const updateMaterial = async (req, res) => {
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

const deleteMaterial = async (req, res) => {
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
    getMaterials,
    getMaterialesPointOfSale, 
    getMaterialById,
    createMaterial,
    updateMaterial,
    deleteMaterial,
};
