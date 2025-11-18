const { User, Pet, Party} = require("../models");
const { sequelize } = require("../config/db");

// Get all parties with pagination and filtering
exports.getAllParties = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 10,
            search,
            date,
            includePets = 'false',
            includeOwners = 'false',
            sortBy = 'date',
            sortOrder = 'ASC'
        } = req.query;
        const offset = (page - 1) * limit;

        const where = {};
        if (search) {
            where.title = { [Op.iLike]: `%${search}%` }; // case-insensitive, partial match
        }
        if (date) {
            where.date = date;
        }

        const include = [];
        if (includePets === 'true') {
            const petInclude = {
                model: Pet,
                as: 'pets',
                attributes: ['id', 'name'],
                through: { attributes: [] } // exclude join table attributes
            };
            if (includeOwners === 'true') {
                petInclude.include = [{
                    model: User,
                    as: 'owner',
                    attributes: ['id', 'name', 'email']
                }];
            }
            include.push(petInclude);
        }

        const { count, rows } = await Party.findAndCountAll({
            where,
            include,
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [[sortBy, sortOrder]]
        });

        res.json({
            parties: rows,
            pagination: {
                total: count,
                page: parseInt(page),
                limit: parseInt(limit),
                pages: Math.ceil(count / limit)
            }
        });
    } catch (error) {
        console.error("Error fetching parties:", error);
        res.status(500).json({ error: error.message });
    }
};

// Get party by ID
exports.getPartyById = async (req, res) => {
    try {
        const { id } = req.params;
        const { includePets = 'false', includeOwners = 'false' } = req.query;

        const include = [];
        if (includePets === 'true') {
            const petInclude = {
                model: Pet,
                as: 'pets',
                attributes: ['id', 'name'],
                through: { attributes: [] } // exclude join table attributes
            };
            if (includeOwners === 'true') {
                petInclude.include = [{
                    model: User,
                    as: 'owner',
                    attributes: ['id', 'name', 'email']
                }];
            }
            include.push(petInclude);
        }

        const party = await Party.findByPk(id, { include });

        if (!party) {
            return res.status(404).json({ error: "Party not found." });
        }

        res.json(party);
    } catch (error) {
        console.error("Error fetching party by ID:", error);
        res.status(500).json({ error: error.message });
    }
};

// Create new party
exports.createParty = async (req, res) => {
    try {
        const { title, location, date, description } = req.body;
        if (!title || !location || !date) {
            return res.status(400).json({ error: "Title, location, and date are required." });
        }
        if (new Date(date) < new Date()) {
            return res.status(400).json({ error: "Date must be in the future." });
        }

        const newParty = await Party.create({ title, location, date, description });
        res.status(201).json(newParty);
    } catch (error) {
        console.error("Error creating party:", error);
        res.status(500).json({ error: error.message });
    }
};

// Update party
exports.updateParty = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, location, date, description } = req.body;

        const party = await Party.findByPk(id);
        if (!party) {
            return res.status(404).json({ error: "Party not found." });
        }
        if (date && new Date(date) < new Date()) {
            return res.status(400).json({ error: "Date must be in the future." });
        }

        // Update only provided fields
        if (title !== undefined) party.title = title;
        if (location !== undefined) party.location = location;
        if (date !== undefined) party.date = date;
        if (description !== undefined) party.description = description;

        await party.save();
        res.json(party);
    } catch (error) {
        console.error("Error updating party:", error);
        if (error.name === 'SequelizeValidationError') {
            return res.status(400).json({
                error: error.errors.map(e => e.message).join(', ')
            });
        }
        res.status(500).json({ error: error.message });
    }
};

// Delete party
exports.deleteParty = async (req, res) => {
    const transaction = await sequelize.transaction();

    try {
        const { id } = req.params;
        const party = await Party.findByPk(id);
        if (!party) {
            await transaction.rollback();
            return res.status(404).json({ error: "Party not found." });
        }

        await party.destroy({ transaction });
        await transaction.commit();
        res.json({
            message: "Party deleted.",
            party
        });
    } catch (error) {
        await transaction.rollback();
        console.error("Error deleting party:", error);
        res.status(500).json({ error: error.message });
    }
};

// Add pet to party
exports.addPetToParty = async (req, res) => {
    try {
        const { partyId, petId } = req.params;
        const party = await Party.findByPk(partyId);
        if (!party) {
            return res.status(404).json({ error: "Party not found." });
        }
        const pet = await Pet.findByPk(petId);
        if (!pet) {
            return res.status(404).json({ error: "Pet not found." });
        }
        const isAttending = await party.hasPet(pet);
        if (isAttending) {
            return res.status(400).json({ error: "Pet is already attending this party." });
        }

        await party.addPet(pet);
        res.json({
            message: "Pet added to party.",
            partyId: partyId,
            petId: petId
        });
    } catch (error) {
        console.error("Error adding pet to party:", error);
        res.status(500).json({ error: error.message });
    }
};

// Remove pet from party
exports.removePetFromParty = async (req, res) => {
    const transaction = await sequelize.transaction();

    try {
        const { partyId, petId } = req.params;
        const party = await Party.findByPk(partyId, { transaction });
        if (!party) {
            await transaction.rollback();
            return res.status(404).json({ error: "Party not found." });
        }
        const pet = await Pet.findByPk(petId, { transaction });
        if (!pet) {
            await transaction.rollback();
            return res.status(404).json({ error: "Pet not found." });
        }
        const isAttending = await party.hasPet(pet, { transaction });
        if (!isAttending) {
            await transaction.rollback();
            return res.status(400).json({ error: "Pet is not attending this party." });
        }

        await party.removePet(pet, { transaction });
        await transaction.commit();

        res.json({
            message: "Pet removed from party.",
            partyId: partyId,
            petId: petId
        });
    } catch (error) {
        await transaction.rollback();
        console.error("Error removing pet from party:", error);
        res.status(500).json({ error: error.message });
    }
};