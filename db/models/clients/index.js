const  {DataTypes, Sequelize , Model} = require('sequelize')
const CLIENTS_TABLE = 'clients'

const ClientsSchema = {
    id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.INTEGER
    },
    name: {
        allowNull: false,
        type: DataTypes.STRING,
    },
    data: {
        allowNull: false,
        type: DataTypes.DATE,
        field: 'expiration_date',
    }
}

class Clients extends Model {
    static associations(models) {
        this.hasOne(models.questions, {
          as: 'questions',
          foreignKey: 'clientId'
        });
      }
    static config(sequelize){
        return{
            sequelize,
            tableName: CLIENTS_TABLE,
            modelName: 'Clients',
            timestamp: false
        }
    }
}
module.exports =  {CLIENTS_TABLE, ClientsSchema, Clients}