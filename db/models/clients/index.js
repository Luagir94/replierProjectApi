const { DataTypes, Sequelize, Model } = require('sequelize')
const CLIENTS_TABLE = 'clients'

const ClientsSchema = {
    id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.STRING,
        unique: true
    },
    name: {
        allowNull: false,
        type: DataTypes.STRING,
        
    },
    data: {
        allowNull: true,
        type: DataTypes.JSON,
    },
    logo: {
        allowNull: true,
        type: DataTypes.STRING,
    },
    createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
        field: 'created_at',
    },
    updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
        field: 'updated_at',
    },
}

class Clients extends Model {
    static associate(models) {
        this.hasMany(models.Questions, {
            as: 'questions',
            foreignKey: 'clientId'
        });
    }
    static config(sequelize) {
        return {
            sequelize,
            tableName: CLIENTS_TABLE,
            modelName: 'Clients',
            timestamp: false
        }
    }
}
module.exports = { CLIENTS_TABLE, ClientsSchema, Clients }