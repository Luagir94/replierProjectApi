const express = require('express')
const User = require('../../controllers/users')
const { Router } = require('express')
const {verifyTokenHandler} =require('../../utils/middlewares/verifyTokenHandler')

const UserController = new User()
const routerUser = new Router()

routerUser.use(express.json())
routerUser.use(express.urlencoded({ extended: true }))
routerUser.post('/api/user/new-user',UserController.generateUser)
routerUser.post('/api/user/login',UserController.login)
routerUser.put('/api/user/change-password',verifyTokenHandler,UserController.changePassword)
routerUser.get('/api/user/get-user',verifyTokenHandler,UserController.getUser)
routerUser.delete('/api/user/delete-user',verifyTokenHandler,UserController.deleteUser)
module.exports = routerUser