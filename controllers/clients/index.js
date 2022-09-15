
const { models } = require('../../libs/sequelize');
const { validateCreateUser, validatePassword } = require('../../utils/schemas/users');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require('dotenv').config()
const cloudinary = require('../../utils/middlewares/cloudinaryUpload')
class Clients {
    constructor() { }
    async generateClient(req, res, next) {
        const { name, data } = req.body;

        const token = req.headers.authorization.split(' ')[1]

        jwt.verify(token, process.env.CLIENT_SECRET, async (err, decoded) => {
            const verifyUser = await models.User.findByPk(decoded.data.id)
            console.log(decoded.data.role);
            try {
                if (decoded.data.role === 'admin' && verifyUser) {
                    const newEntrie = {
                        name,
                        data
                    }
                    const newUser = await models.Clients.create(newEntrie)
                    res.status(201).send({ msg: 'Cliente creado con exito.', client: newUser })
                } else {
                    res.status(401).send('Credenciales incorrectas');
                }
            } catch (error) {
                res.status(500).send('Error inesperado, intente nuevamente.')
            }
        })




    }
    async updateClient(req, res, next) {
        const { name, data, id } = req.body;


        const token = req.headers.authorization.split(' ')[1]

        jwt.verify(token, process.env.CLIENT_SECRET, async (err, decoded) => {
            const verifyUser = await models.User.findByPk(decoded.data.id)
            try {
                if (decoded.data.role === 'admin' && verifyUser) {
                    const client = await models.Clients.findByPk(parseInt(id))
                    console.log(client);
                    const newEntrie = {
                        data,
                        name: name || client.name
                    }
                    console.log(newEntrie);
                    const newUser = await client.update(newEntrie)
                    res.status(201).send({ msg: 'Cliente actualizado con exito.', client: newUser })
                } else {
                    res.status(401).send('Credenciales incorrectas');
                }
            } catch (error) {
                res.status(500).send('Error inesperado, intente nuevamente.')
            }
        })


    }
    async uploadPhoto(req, res, next) {
        const token = req.headers.authorization.split(' ')[1]
        const isVerified = jwt.verify(token, process.env.CLIENT_SECRET, async (err, decoded) => {
            const { role, id } = decoded.data
            try {
                const verifyUser = await models.User.findByPk(decoded.data.id)
                if (role === 'admin' && verifyUser) {
                    const client = await models.Clients.findOne({ where: { id: parseInt(req.body.id) } })
                    const uploader = async (x, y) => await cloudinary.uploadImage(x, y)
                    const { path } = req.file
                    const newFile = await uploader(path, 'Clients')
                    const rta = await client.update({ logo: newFile.url })
                    res.status(200).send('Foto actualizada correctamente.')

                } else {
                    res.status(401).send('Credenciales incorrectas');
                }
            } catch (error) {
                res.status(400).send('Ha ocurrido un error con esta solicitud, intentar nuevamente')
            }



        })
    }
    async getClients(req, res, next) {
        const token = req.headers.authorization.split(' ')[1]
        try {
            jwt.verify(token, process.env.CLIENT_SECRET, async (err, decoded) => {
                const verifyUser = await models.User.findByPk(decoded.data.id)
                if (verifyUser) {
                    if (decoded.data) {
                        const rta = await models.Clients.findAll({ attributes: { exclude: ['createdAt', 'updatedAt'] } })
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
    async deleteClient(req, res, next) {
        const { id } = req.body;
        const { error, value } = validateCreateUser(req.body);
        const token = req.headers.authorization.split(' ')[1]
        jwt.verify(token, process.env.CLIENT_SECRET, async (err, decoded) => {
            const verifyUser = await models.User.findByPk(decoded.data.id)
            console.log(decoded.data.role);
            if (decoded.data.role === 'admin' && verifyUser) {
                const clientToDelete = await models.Clients.findByPk(parseInt(id))
                clientToDelete.destroy()
                res.status(200).send('Usuario eliminado correctamente.')

            } else {
                res.status(401).send('Credenciales incorrectas.');
            }
        })
    }
}

module.exports = Clients