const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Party = sequelize.define('Party', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        comment: 'Unique identifier for the party'
    },
    title: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'Title cannot be empty'
            },
            len: {
                args: [2, 100],
                msg: 'Title must be between 2 and 100 characters'
            }
        },
        comment: 'Title of the party'
    },
    location: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'Location cannot be empty'
            },
            len: {
                args: [5, 100],
                msg: 'Location must be between 5 and 100 characters'
            }
        },
        comment: 'Location of the party'
    },
    date: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
            isDate: {
                msg: 'Must be a valid date'
            }
        },
        comment: 'Date of the party'
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
        validate: {
            len: {
                args: [0, 500],
                msg: 'Description can be up to 500 characters'
            }
        },
        comment: 'Description of the party'
    }
}, {
    tableName: 'party',
    timestamps: true,
    indexes: [
        {
            unique: false,
            fields: ['date']
        }
    ]
});

module.exports = Party;