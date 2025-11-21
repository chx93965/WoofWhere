const { User, Pet, Party} = require("../models");
const { sequelize } = require("../config/db");
const { bcrypt } = require('bcrypt');
const { jwt } = require('jsonwebtoken');

// Get all users with pagination and filtering
exports.getAllUsers = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 10,
            search,
            isActive,
            includePets = 'false',
            sortBy = 'createdAt',
            sortOrder = 'DESC'
        } = req.query;
        const offset = (page - 1) * limit;

        const where = {};
        if (search) {
            where[Op.or] = [
                // case-insensitive, partial match
                { name: { [Op.iLike]: `%${search}%` } },
                { email: { [Op.iLike]: `%${search}%` } },
            ];
        }
        if (isActive !== undefined) {
            where.isActive = isActive === 'true';
        }

        const include = [];
        if (includePets === 'true') {
            include.push({
                model: Pet,
                as: 'pets',
                attributes: ['id', 'name']
            });
        }

        const { count, rows } = await User.findAndCountAll({
            where,
            include,
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [[sortBy, sortOrder]]
        });

        res.json({
            users: rows,
            pagination: {
                total: count,
                page: parseInt(page),
                limit: parseInt(limit),
                pages: Math.ceil(count / limit)
            }
        });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: error.message });
    }
};

// Get user by ID
exports.getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const { includePets = 'false', includeParty = 'false' } = req.query;

        const include = [];
        if (includePets === 'true') {
            const petInclude = {
                model: Pet,
                as: 'pets',
                attributes: ['id', 'name']
            };
            if (includeParty === 'true') {
                petInclude.include = [{
                    model: Party,
                    as: 'parties',
                    attributes: ['id', 'title', 'location', 'date']
                }];
            }
            include.push(petInclude);
        }

        const user = await User.findByPk(id, { include });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ error: error.message });
    }
};

// Create new user
exports.createUser = async (req, res) => {
    try {
        const { name, email, password, age } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({
                error: 'Name, email, and password are required'
            });
        }

        // check for existing name or email
        const existingName = await User.findOne({ where: { name } });
        if (existingName) {
            return res.status(409).json({
                error: 'Name already exists'
            });
        }
        const existingEmail = await User.findOne({ where: { email } });
        if (existingEmail) {
            return res.status(409).json({
                error: 'Email already exists'
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ name, email, hashedPassword, age });
        res.status(201).json(user);
    } catch (error) {
        console.error('Error creating user:', error);
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(409).json({
                error: 'Email already exists'
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

// Login user
exports.loginUser = async (req, res) => {
    try {
        const { name, password } = req.body;
        if (!name || !password) {
            return res.status(400).json({ error: 'Name and password are required' });
        }

        const user = await User.findOne({ where: { name } });
        if (!user) {
            return res.status(401).json({ error: 'Invalid name' });
        }

        const isMatch = await bcrypt.compare(password, user.hashedPassword);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid password' });
        }

        const token = jwt.sign({ id: user.id, name: user.name }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token: token, user: user });
    } catch (error) {
        console.error('Error logging in user:', error);
        res.status(500).json({ error: error.message });
    }
};

// Update user
exports.updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, age, isActive } = req.body;

        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Update only provided fields
        if (name !== undefined) user.name = name;
        if (email !== undefined) user.email = email;
        if (age !== undefined) user.age = age;
        if (isActive !== undefined) user.isActive = isActive;

        await user.save();
        res.json(user);
    } catch (error) {
        console.error('Error updating user:', error);
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(409).json({
                error: 'Email already exists'
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

// Delete user
exports.deleteUser = async (req, res) => {
    const transaction = await User.sequelize.transaction();

    try {
        const { id } = req.params;
        const user = await User.findByPk(id, { transaction });
        if (!user) {
            await transaction.rollback();
            return res.status(404).json({ error: 'User not found' });
        }

        await user.destroy({ transaction });
        await transaction.commit();

        res.json({
            message: 'User deleted',
            id
        });
    } catch (error) {
        await transaction.rollback();
        console.error('Error deleting user:', error);
        res.status(500).json({ error: error.message });
    }
};

// Deactivate user
exports.deactivateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        user.isActive = false;
        await user.save();

        res.json({
            message: 'User deactivated',
            user
        });
    } catch (error) {
        console.error('Error deactivating user:', error);
        res.status(500).json({ error: error.message });
    }
};

// Activate user
exports.activateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        if (user.isActive) {
            return res.status(400).json({ error: 'User is already active' });
        }

        user.isActive = true;
        await user.save();

        res.json({
            message: 'User activated',
            user
        });
    } catch (error) {
        console.error('Error activating user:', error);
        res.status(500).json({ error: error.message });
    }
};

// Get user statistics
exports.getUserStats = async (req, res) => {
    try {
        const total = await User.count();
        const active = await User.count({ where: { isActive: true } });
        const inactive = total - active;

        res.json({
            total,
            active,
            inactive,
            activePercentage: total > 0 ? ((active / total) * 100).toFixed(2) : 0,
        });
    } catch (error) {
        console.error('Error fetching user stats:', error);
        res.status(500).json({ error: error.message });
    }
};