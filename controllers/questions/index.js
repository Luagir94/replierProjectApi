
const { models } = require('../../libs/sequelize');
const { validateCreateUser, validatePassword } = require('../../utils/schemas/users');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { QueryTypes } = require('sequelize')
require('dotenv').config()
const cloudinary = require('../../utils/middlewares/cloudinaryUpload')
const { v4: uuidv4 } = require('uuid');
const sequelize = require('../../libs/sequelize');

class Questions {
    constructor() { }
    async generateQuestion(req, res, next) {
        const { clientId, title, question, answer } = req.body;

        const token = req.headers.authorization.split(' ')[1]

        jwt.verify(token, process.env.CLIENT_SECRET, async (err, decoded) => {
            const verifyUser = await models.User.findByPk(decoded.data.id)

            try {
                if (verifyUser) {

                    const newUser = await sequelize.query(`INSERT INTO "questions" VALUES ('${uuidv4()}','${title}','${question}','${answer}','${clientId}','${new Date().toUTCString()}','${new Date().toUTCString()}')`)
                    res.status(201).send({ msg: 'Preguenta creado con exito.' })
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
                    const queryCreator = ()=>{
                        const query = []
                        if (title) query.push(`title='${title}'`)
                        if (question) query.push(`question='${question}'`)
                        if (answer) query.push(`answer='${answer}'`)
                        query.push(`updated_at='${new Date().toUTCString()}'`)
                        return query.join()
                    }
                    const newUser = await sequelize.query(`UPDATE  "questions" SET ${queryCreator()} WHERE id='${id}'`)
                    res.status(201).send({ msg: 'Cliente actualizado con exito.' })
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
                        // const rta = await models.Questions.findAll()
                        // const dataToSend = rta.map(x => x.dataValues)
                        const newUser = await sequelize.query("SELECT * FROM questions", { type: QueryTypes.SELECT })
                        res.status(200).send(newUser)

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
            try {
                const verifyUser = await models.User.findByPk(decoded.data.id)
                console.log(decoded.data.role);
                if (decoded.data.role === 'admin' && verifyUser) {
                    const newUser = await sequelize.query(`DELETE FROM questions WHERE id='${id}'`)
              
                    res.status(200).send('Usuario eliminado correctamente.')
    
                } else {
                    res.status(401).send('Credenciales incorrectas.');
                }
            } catch (error) {
                console.log(error);
            }
        
        })
    }
}

module.exports = Questions