const express = require('express');
const router = express.Router();
const petController = require('../controllers/petControllers');

router.get('/', petController.getAllPets);
router.get('/:id', petController.getPetById);
router.post('/', petController.createPet);
router.put('/:id', petController.updatePet);
router.delete('/:id', petController.deletePet);
router.get('/:ownerId/get', petController.getPetsByOwner);
router.get('/:id/party', petController.getPetParties);
router.patch('/:id/transfer', petController.transferPetOwnership);

module.exports = router;