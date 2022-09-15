const { UserSchema, User } = require("./users/index.js");
const { ClientsSchema, Clients } = require('./clients/index.js')
const { QuestionsSchema, Questions } = require('./questions/index.js')


const setupModels = (sequelize) => {
    User.init(UserSchema, User.config(sequelize))
    Clients.init(ClientsSchema, Clients.config(sequelize))
    Questions.init(QuestionsSchema, Questions.config(sequelize))
   
}

module.exports = setupModels