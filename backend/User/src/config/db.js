const { Sequelize } = require('sequelize');

console.log(`[DEBUG] Connecting with DB_HOST: "${process.env.DB_HOST}" and DB_PORT: "${process.env.DB_PORT}"`);

const sequelize = new Sequelize(
    process.env.DB_NAME || 'userdb',
    process.env.DB_USER || 'user',
    process.env.DB_PASSWORD || 'password',
    {
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 5432,
        dialect: 'postgres',
        logging: process.env.NODE_ENV === 'development' ? console.log : false,
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        },
        retry: {
            max: 3
        },
        dialectOptions: {
            // SSL configuration for production
            ...(process.env.NODE_ENV === 'production' && {
                ssl: {
                    require: true,
                    rejectUnauthorized: false
                }
            })
        }
    }
);

// Test connection
const testConnection = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connection test successful');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
};

module.exports = { sequelize, testConnection };