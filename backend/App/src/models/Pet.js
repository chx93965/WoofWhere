const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Pet = sequelize.define('Pet', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        comment: 'Unique identifier for the pet'
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
                msg: 'Name must be between 1 and 30 characters'
            }
        },
        comment: 'Name of the pet'
    },
    breed: {
        type: DataTypes.STRING(50),
        allowNull: true,
        validate: {
            len: {
                args: [2, 50],
                msg: 'Type must be between 2 and 20 characters'
            }
        },
        comment: 'Breed of the pet'
    },
    size: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
            isIn: {
                args: [['small', 'medium', 'large']],
                msg: 'Size must be one of: small, medium, large'
            }
        },
        comment: 'Size of the pet (small, medium, large)'
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
                args: [50],
                msg: 'Age must be less than 50'
            }
        },
        comment: 'Age of the pet'
    },
    ownerId: {
        type: DataTypes.UUID,
        allowNull: false,
        comment: 'ID of the owner (App)',
        references: {
            model: 'users',
            key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    }
}, {
    tableName: 'pets',
    timestamps: true,
    indexes: [
        {
            fields: ['ownerId']
        }
    ]
});

// Instance methods
Pet.prototype.toJSON = function () {
    // TODO: Remove sensitive fields if needed
    return {...this.get()};
}

module.exports = Pet;