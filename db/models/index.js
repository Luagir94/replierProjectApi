const { UserSchema, User } = require("./users/index.js");
const { ClientsSchema, Clients, CLIENTS_TABLE } = require('./clients/index.js')
const { QuestionSchema, Questions,QUESTIONS_TABLE } = require('./questions/index.js')


const setupModels = (sequelize) => {
    User.init(UserSchema, User.config(sequelize))
    Clients.init(ClientsSchema, Clients.config(sequelize))
    Questions.init(QuestionSchema, Questions.config(sequelize))
   
    Questions.associate(sequelize.models)
    Clients.associate(sequelize.models)

}

module.exports = setupModels