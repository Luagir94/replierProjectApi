
const { models } = require('../../libs/sequelize');
const { validateCreateUser, validatePassword } = require('../../utils/schemas/users');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require('dotenv').config()
const cloudinary = require('../../utils/middlewares/cloudinaryUpload')
const { v4: uuidv4 } = require('uuid');
class Questions {
    constructor() { }
    async generateQuestion(req, res, next) {
        const { clientId, title, question, answer } = req.body;

        const token = req.headers.authorization.split(' ')[1]

        jwt.verify(token, process.env.CLIENT_SECRET, async (err, decoded) => {
            const verifyUser = await models.User.findByPk(decoded.data.id)

            try {
                if (verifyUser) {
    
       
                    
                    
                    const newUser = await models.Questions.create({...req.body,"id": uuidv4()})
                    res.status(201).send({ msg: 'Preguenta creado con exito.', newUser })
                } else {
                    res.status(401).send('Credenciales incorrectas');
                }
            } catch (error) {
                console.log(error);
                res.status(500).send('Error inesperado, intente nuevamente.')
            }
        })




    }
    async updateQuestions(req, res, next) {
        const { id, title, question, answer } = req.body;


        const token = req.headers.authorization.split(' ')[1]

        jwt.verify(token, process.env.CLIENT_SECRET, async (err, decoded) => {
            const verifyUser = await models.User.findByPk(decoded.data.id)
            try {
                if (verifyUser) {
                    const question = await models.Questions.findByPk(id)
                    
                    const newEntrie = {
                        title,
                        question,
                        answer
                    }
                    const updatedQ = await question.update(newEntrie)
                    res.status(201).send({ msg: 'Cliente actualizado con exito.', updatedQ })
                } else {
                    res.status(401).send('Credenciales incorrectas');
                }
            } catch (error) {
                res.status(500).send('Error inesperado, intente nuevamente.')
            }
        })


    }
    async getQuestions(req, res, next) {
        const token = req.headers.authorization.split(' ')[1]
        try {
            jwt.verify(token, process.env.CLIENT_SECRET, async (err, decoded) => {
                const verifyUser = await models.User.findByPk(decoded.data.id)
                if (verifyUser) {
                    if (decoded.data) {
                        const rta = await models.Questions.findAll()
                        const dataToSend = rta.map(x => x.dataValues)
                        res.status(200).send(dataToSend)

                    } else {
                        res.status(404).send('Usuario no encontrado.')
                    }
                }

            })
        } catch (error) {
            res.status(404).send('Usuario no encontrado.')
        }
    }
    async deleteQuestions(req, res, next) {
        const { id } = req.body;
        const { error, value } = validateCreateUser(req.body);
        const token = req.headers.authorization.split(' ')[1]
        jwt.verify(token, process.env.CLIENT_SECRET, async (err, decoded) => {
            const verifyUser = await models.User.findByPk(decoded.data.id)
            console.log(decoded.data.role);
            if (decoded.data.role === 'admin' && verifyUser) {
                const questionToDestroy = await models.Questions.findByPk(id)
                questionToDestroy.destroy()
                res.status(200).send('Usuario eliminado correctamente.')

            } else {
                res.status(401).send('Credenciales incorrectas.');
            }
        })
    }
}

module.exports = Questions