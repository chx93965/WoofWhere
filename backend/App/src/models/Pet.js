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
    type: {
        type: DataTypes.ENUM('dog', 'cat', 'other'),
        allowNull: false,
        validate: {
            isIn: {
                args: [['dog', 'cat', 'other']],
                msg: 'Type must be one of: dog, cat, other'
            }
        },
        comment: 'Type of the pet (dog, cat, other)'
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
            model: 'user',
            key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    }
}, {
    tableName: 'pet',
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