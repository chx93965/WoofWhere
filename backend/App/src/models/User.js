const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const User = sequelize.define('User', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        comment: 'Unique identifier for the user'
    },
    name: {
        type: DataTypes.STRING(30),
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'Name cannot be empty'
            },
            len: {
                args: [2, 30],
                msg: 'Name must be between 2 and 30 characters'
            }
        },
        comment: 'Full name of the user'
    },
    email: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: {
            name: 'unique_email',
            msg: 'Email address already exists'
        },
        validate: {
            isEmail: {
                msg: 'Must be a valid email address'
            }
        },
        comment: 'App email address (unique)'
    },
    age: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: {
            min: {
                args: [0],
                msg: 'Age must be at least 0'
            },
            max: {
                args: [150],
                msg: 'Age must be less than 150'
            }
        },
        comment: 'Age of the user'
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        comment: 'Whether the user account is active'
    }
}, {
    tableName: 'user',
    timestamps: true,
    indexes: [
        {
            unique: true,
            fields: ['email']
        },
        {
            fields: ['isActive']
        },
        {
            fields: ['createdAt']
        }
    ]
});

// Instance methods
User.prototype.toJSON = function() {
    // TODO: Remove sensitive fields if needed
    return {...this.get()};
};

module.exports = User;