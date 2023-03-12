const { Router } = require("express");
const router = Router();

const { getAllCategorias, categoriasByDescription, createCategoria, updateCategoria, deleteCategoria } = require("../controllers/categorias.controllers");

router.get("/api/categorias", getAllCategorias);
router.post("/api/categoriasByDescription", categoriasByDescription);
router.post("/api/categorias", createCategoria);
router.put("/api/categorias/:id", updateCategoria);
router.delete("/api/categorias/:id", deleteCategoria);

module.exports = router;
