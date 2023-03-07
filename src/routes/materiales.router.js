const { Router } = require('express');
const router = Router();

const { validateToken } = require('../services/jwt')
const { getMaterials, 
        getMaterialesPointOfSale, 
        getMaterialById, 
        createMaterial, 
        updateMaterial, 
        deleteMaterial } = require('../controllers/materiales.controllers');

router.get('/api/materiales', validateToken, getMaterials);
router.get('/api/materiales/pointofsale', validateToken, getMaterialesPointOfSale);
router.post('/api/materiales/pointofsale', validateToken, getMaterialesPointOfSale);
router.get('/api/materiales/:id', validateToken, getMaterialById);
router.post('/api/materiales', validateToken, createMaterial);
router.put('/api/materiales/:id', validateToken, updateMaterial)
router.delete('/api/materiales/:id', validateToken, deleteMaterial);

module.exports = router;