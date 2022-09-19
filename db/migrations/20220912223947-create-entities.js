
'use strict';
const {USER_TABLE,UserSchema} = require  ('../models/users')
const {CLIENTS_TABLE,ClientsSchema} = require  ('../models/clients')
const {QUESTIONS_TABLE,QuestionSchema} = require  ('../models/questions')


module.exports = {
  async up (queryInterface) {
    await queryInterface.createTable(USER_TABLE,UserSchema)
    await queryInterface.createTable(CLIENTS_TABLE,ClientsSchema)
    await queryInterface.createTable(QUESTIONS_TABLE,QuestionSchema)
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable(QUESTIONS_TABLE,QuestionSchema)
  }
};
