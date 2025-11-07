const express = require('express');
const router = express.Router();
const partyController = require('../controllers/partyControllers');

router.get('/', partyController.getAllParties);
router.get('/:id', partyController.getPartyById);
router.post('/', partyController.createParty);
router.put('/:id', partyController.updateParty);
router.delete('/:id', partyController.deleteParty);
router.patch('/:partyId/add/:petId', partyController.addPetToParty);
router.patch('/:partyId/remove/:petId', partyController.removePetFromParty);

module.exports = router;