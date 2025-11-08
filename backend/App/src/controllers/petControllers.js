const { User, Pet, Party} = require("../models");
const { sequelize } = require("../config/db");
const {Op} = require("sequelize");

// Get all pets with pagination and filtering
exports.getAllPets = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 10,
            search,
            type,
            ownerId,
            includeOwner = 'false',
            includeParties = 'false',
            sortBy = 'createdAt',
            sortOrder = 'DESC'
        } = req.query;
        const offset = (page - 1) * limit;

        const where = {};
        if (search) {
            // case-insensitive, partial match
            where.name = { [Op.iLike]: `%${search}%` };
        }
        if (type) {
            where.type = type;
        }
        if (ownerId) {
            where.ownerId = ownerId;
        }

        const include = [];
        if (includeOwner === 'true') {
            include.push({
                model: User,
                as: 'owner',
                attributes: ['id', 'name', 'email']
            });
        }
        if (includeParties === 'true') {
            include.push({
                model: Party,
                as: 'parties',
                attributes: ['id', 'title', 'location', 'date'],
                through: { attributes: [] } // exclude join table attributes
            });
        }

        const { count, rows } = await Pet.findAndCountAll({
            where,
            include,
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [[sortBy, sortOrder]]
        });

        res.json({
            pets: rows,
            pagination: {
                total: count,
                page: parseInt(page),
                limit: parseInt(limit),
                pages: Math.ceil(count / limit)
            }
        });
    } catch (error) {
        console.error('Error fetching pets:', error);
        res.status(500).json({ error: error.message });
    }
};

// Get pet by ID
exports.getPetById = async (req, res) => {
    try {
        const { id } = req.params;
        const { includeOwner = 'false', includeParties = 'false' } = req.query;

        const include = [];
        if (includeOwner === 'true') {
            include.push({
                model: User,
                as: 'owner',
                attributes: ['id', 'name', 'email']
            });
        }
        if (includeParties === 'true') {
            include.push({
                model: Party,
                as: 'parties',
                attributes: ['id', 'title', 'location', 'date'],
                through: { attributes: [] } // exclude join table attributes
            });
        }

        const pet = await Pet.findByPk(id, { include });
        if (!pet) {
            return res.status(404).json({ error: 'Pet not found' });
        }

        res.json(pet);
    } catch (error) {
        console.error('Error fetching pet:', error);
        res.status(500).json({ error: error.message });
    }
};

// Create new pet with owner association
exports.createPet = async (req, res) => {
    try {
        const { name, type, breed, age, ownerId } = req.body;

        if (!name || !type || !ownerId) {
            return res.status(400).json({
                error: 'Name, type, and ownerId are required'
            });
        }

        const pet = await Pet.create({ name, type, breed, age, ownerId });
        res.status(201).json(pet);
    } catch (error) {
        console.error('Error creating pet:', error);
        if (error.name === 'SequelizeForeignKeyConstraintError') {
            return res.status(400).json({
                error: 'Invalid ownerId: App does not exist'
            });
        }
        if (error.name === 'SequelizeValidationError') {
            return res.status(400).json({
                error: error.errors.map(e => e.message).join(', ')
            });
        }
        res.status(500).json({ error: error.message });
    }
};

// Update pet
exports.updatePet = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, type, breed, age } = req.body;

        const pet = await Pet.findByPk(id);
        if (!pet) {
            return res.status(404).json({ error: 'Pet not found' });
        }

        // Update only provided fields
        if (name !== undefined) pet.name = name;
        if (type !== undefined) pet.type = type;
        if (breed !== undefined) pet.breed = breed;
        if (age !== undefined) pet.age = age;

        await pet.save();
        res.json(await Pet.findByPk(id, {
            include: [{
                model: User,
                as: 'owner',
                attributes: ['id', 'name', 'email']
            }]
        }));
    } catch (error) {
        console.error('Error updating pet:', error);
        if (error.name === 'SequelizeValidationError') {
            return res.status(400).json({
                error: error.errors.map(e => e.message).join(', ')
            });
        }
        res.status(500).json({ error: error.message });
    }
};

// Delete pet
exports.deletePet = async (req, res) => {
    const transaction = await sequelize.transaction();

    try {
        const { id } = req.params;
        const pet = await Pet.findByPk(id, { transaction });
        if (!pet) {
            await transaction.rollback();
            return res.status(404).json({ error: 'Pet not found' });
        }

        await pet.destroy({ transaction });
        await transaction.commit();
        res.json({
            message: 'Pet deleted',
            pet
        });
    } catch (error) {
        await transaction.rollback();
        console.error('Error deleting pet:', error);
        res.status(500).json({ error: error.message });
    }
};

// Get pets by owner
exports.getPetsByOwner = async (req, res) => {
    try {
        const { ownerId } = req.params;
        const { includeParties = 'false' } = req.query;

        const owner = await User.findByPk(ownerId);
        if (!owner) {
            return res.status(404).json({ error: 'Owner not found' });
        }

        const include = [];
        if (includeParties === 'true') {
            include.push({
                model: Party,
                as: 'parties',
                attributes: ['id', 'title', 'location', 'date'],
                through: { attributes: [] } // exclude join table attributes
            });
        }

        const pets = await Pet.findAll({
            where: { ownerId },
            include,
            order: [['createdAt', 'DESC']]
        });

        res.json({ owner, pets });
    } catch (error) {
        console.error('Error fetching pets by owner:', error);
        res.status(500).json({ error: error.message });
    }
}

// Get pet parties
exports.getPetParties = async (req, res) => {
    try {
        const { id } = req.params;

        const pet = await Pet.findByPk(id);
        if (!pet) {
            return res.status(404).json({ error: 'Pet not found' });
        }

        const parties = await pet.getParties({
            attributes: ['id', 'title', 'location', 'date'],
            joinTableAttributes: [] // exclude join table attributes
        });

        res.json({
            petId: id,
            parties,
            partyCount: parties.length
        });
    } catch (error) {
        console.error('Error fetching pet parties:', error);
        res.status(500).json({ error: error.message });
    }
};

// Transfer pet ownership
exports.transferPetOwnership = async (req, res) => {
    const transaction = await sequelize.transaction();

    try {
        const { id } = req.params;
        const { newOwnerId: newOwnerId } = req.body;

        if (!newOwnerId) {
            await transaction.rollback();
            return res.status(400).json({ error: 'newOwnerId is required' });
        }

        const pet = await Pet.findByPk(id, { transaction });
        if (!pet) {
            await transaction.rollback();
            return res.status(404).json({ error: 'Pet not found' });
        }

        const newOwner = await User.findByPk(newOwnerId, { transaction });
        if (!newOwner) {
            await transaction.rollback();
            return res.status(404).json({ error: 'New owner not found' });
        }

        const oldOwnerId = pet.ownerId;
        pet.ownerId = newOwnerId;
        await pet.save({ transaction });
        await transaction.commit();

        const updatedPet = await Pet.findByPk(id, {
            include: [{
                model: User,
                as: 'owner',
                attributes: ['id', 'name', 'email']
            }]
        });

        res.json({
            pet: updatedPet,
            details: {
                oldOwnerId: oldOwnerId,
                newOwnerId: newOwnerId
            }
        });
    } catch (error) {
        await transaction.rollback();
        console.error('Error transferring pet ownership:', error);
        res.status(500).json({ error: error.message });
    }
};
