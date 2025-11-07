const Sequelize = require('../config/db');
const User = require('./User');
const Pet = require('./Pet');
const Party = require('./Party');
const {sequelize} = require("../config/db");

User.hasMany(Pet, {
    foreignKey: 'ownerId',
    as: 'pets',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});

Pet.belongsTo(User, {
    foreignKey: 'ownerId',
    as: 'owner',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});

Pet.belongsToMany(Party, {
    through: 'PartyPets',
    foreignKey: 'petId',
    otherKey: 'partyId',
    as: 'parties',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});

Party.belongsToMany(Pet, {
    through: 'PartyPets',
    foreignKey: 'partyId',
    otherKey: 'petId',
    as: 'pets',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});

const syncDB = async () => {
    await sequelize.sync({ alter: true });
    console.log('All models synchronized');
};

module.exports = { User, Pet, Party, syncDB };