const  {DataTypes, Sequelize , Model} = require('sequelize')
const USER_TABLE = 'users'

const UserSchema = {
    id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.STRING,
        unique: true
    },
    userName :{
        allowNull: false,
        type: DataTypes.STRING,
        unique: true,
        field: 'user_name',
    },
    password: {
        allowNull: false,
        type: DataTypes.STRING,
    },
    name: {
        allowNull: false,
        type: DataTypes.STRING,
    },
    lastName: {
        allowNull: false,
        type: DataTypes.STRING,
        field: 'last_name',
    },
    role:{
        allowNull: false,
        type: DataTypes.STRING,
    } ,createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
        field: 'created_at',
    }, updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
        field: 'updated_at',
    },
}

class User extends Model {
    static  associate(){

    }
    static config(sequelize){
        return{
            sequelize,
            tableName: USER_TABLE,
            modelName: 'User',
            timestamp: false
        }
    }
}
module.exports =  {USER_TABLE, UserSchema, User}