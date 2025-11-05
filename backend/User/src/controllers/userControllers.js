const User = require('../models/User');
const { Op } = require('sequelize');

// Get all users with pagination and filtering
exports.getAllUsers = async (req, res) => {
    try {
        const { page = 1, limit = 10, search, isActive } = req.query;
        const offset = (page - 1) * limit;

        // Build where clause
        const where = {};
        if (search) {
            where[Op.or] = [
                // case-insensitive, partial match
                { name: { [Op.iLike]: `%${search}%` } },
                { email: { [Op.iLike]: `%${search}%` } }
            ];
        }
        if (isActive !== undefined) {
            where.isActive = isActive === 'true';
        }

        const { count, rows } = await User.findAndCountAll({
            where,
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [['createdAt', 'DESC']]
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
        const user = await User.findByPk(id);

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
        const { name, email, age } = req.body;

        // Validation
        if (!name || !email) {
            return res.status(400).json({
                error: 'Name and email are required'
            });
        }

        const user = await User.create({ name, email, age });
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
    try {
        const { id } = req.params;

        const user = await User.findByPk(id);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        await user.destroy();

        res.json({
            message: 'User deleted successfully',
            id
        });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ error: error.message });
    }
};

// Soft delete (deactivate) user
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
            message: 'User deactivated successfully',
            user
        });
    } catch (error) {
        console.error('Error deactivating user:', error);
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
            activePercentage: total > 0 ? ((active / total) * 100).toFixed(2) : 0
        });
    } catch (error) {
        console.error('Error fetching user stats:', error);
        res.status(500).json({ error: error.message });
    }
};