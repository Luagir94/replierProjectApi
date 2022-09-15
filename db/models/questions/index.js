const { DataTypes, Sequelize, Model } = require('sequelize')
const { CLIENTS_TABLE } = require('../clients')
const QUESTIONS_TABLE = 'questions'

const QuestionSchema = {
    id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID
    },
    clientId: {
        allowNull: false,
        type: DataTypes.INTEGER,
        field: 'client_id',
        references: {
            model: CLIENTS_TABLE,
            key: 'id'
        }
    },
    title: {
        allowNull: false,
        type: DataTypes.BOOLEAN,
    },
    question: {
        allowNull: false,
        type: DataTypes.DATE,
    },
    answer: {
        allowNull: false,
        type: DataTypes.STRING,
    },
    submitedBy: {
        allowNull: false,
        type: DataTypes.STRING,
        field: 'submited_by',
    },
    createdAt: {
        allowNull: false,
        type: DataTypes.DATEONLY,
        field: 'created_at',
    }, updatedAt: {
        allowNull: false,
        type: DataTypes.DATEONLY,
        field: 'updated_at',
    },
}

class Questions extends Model {
    static associations(models) {
        this.belongsTo(models.Clients, { as: 'client_name' });
    }
    static config(sequelize) {
        return {
            sequelize,
            tableName: QUESTIONS_TABLE,
            modelName: 'Questions',
            timestamp: false
        }
    }
}
module.exports = { QUESTIONS_TABLE, QuestionSchema, Questions }