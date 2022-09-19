const express = require('express')
const Questions = require('../../controllers/questions')
const { Router } = require('express')
const {verifyTokenHandler} =require('../../utils/middlewares/verifyTokenHandler')
const QuestionsController = new Questions()
const routerQuestions = new Router()

routerQuestions.use(express.json())
routerQuestions.use(express.urlencoded({ extended: true }))
routerQuestions.post('/api/questions/new-question',verifyTokenHandler,QuestionsController.generateQuestion)
routerQuestions.get('/api/questions/all-questions',verifyTokenHandler,QuestionsController.getQuestions)
routerQuestions.put('/api/questions/modify-question',verifyTokenHandler,QuestionsController.updateQuestions)
routerQuestions.delete('/api/questions/delete-question',verifyTokenHandler,QuestionsController.deleteQuestions)
module.exports = routerQuestions