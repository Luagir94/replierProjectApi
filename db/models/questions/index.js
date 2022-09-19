const { DataTypes, Sequelize, Model } = require('sequelize')
const { CLIENTS_TABLE } = require('../clients')
const QUESTIONS_TABLE = 'questions'

const QuestionSchema = {
    id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.STRING,
    },
    title: {
        allowNull: true,
        type: DataTypes.STRING,
    },
    question: {
        allowNull: true,
        type: DataTypes.STRING,
    },
    answer: {
        allowNull: true,
        type: DataTypes.STRING,
    },
    clientId: {
        allowNull: false,
        type: DataTypes.STRING,
        field: 'client_id',
        references: {
            model: CLIENTS_TABLE,
            key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
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
    }
}

class Questions extends Model {
    static associate(models) {
        this.belongsTo(models.Clients, { as: 'client'});
    }
    static config(sequelize) {
        return {
            sequelize,
            tableName: QUESTIONS_TABLE,
            modelName: 'Questions',
            timestamp: false,
            underscored: true,
            createdAt: 'created_at',
            updatedAt: 'updated_at',
            title : 'title',
            answer : 'answer',
            question: 'question'
        }
    }
}
module.exports = { QUESTIONS_TABLE, QuestionSchema, Questions }