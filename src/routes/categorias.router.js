const { Router } = require("express");
const router = Router();

const { getAllCategorias, createCategoria, updateCategoria, deleteCategoria } = require("../controllers/categorias.controllers");

router.get("/api/categorias", getAllCategorias);
router.post("/api/categorias", createCategoria);
router.put("/api/categorias/:id", updateCategoria);
router.delete("/api/categorias/:id", deleteCategoria);

module.exports = router;
