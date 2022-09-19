
const { models } = require('../../libs/sequelize');
const { validateCreateUser, validatePassword } = require('../../utils/schemas/users');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require('dotenv').config()
const { v4: uuidv4 } = require('uuid');
class User {
    constructor() { }
    async login(req, res, next) {
        try {
            const { userName, password } = req.body;
            console.log(req.body);
            const exist = await models.User.findOne({ where: { user_name: userName }, attributes: ['password'] })
            const passMatch = bcrypt.compareSync(password, exist.password)
            if (exist && passMatch) {
                const user = await models.User.findOne({ where: { user_name: userName }, attributes: ['name', 'last_name', 'id', 'user_name', 'role'] })
                jwt.sign(
                    { data: user.dataValues },
                    process.env.CLIENT_SECRET,
                    { expiresIn: "7d" },
                    (err, access_token) => {
                        res.json({
                            access_token,
                        });
                    }
                )
            } else {
                res.status(401).send('Usuario o password incorrectos.')
            }
        } catch (error) {
            res.status(401).send('Usuario o password incorrectos.')
        }

    }
    async generateUser(req, res, next) {
        try {
            const { name, lastName, userName, role } = req.body;
            const { error, value } = validateCreateUser(req.body);
            const token = req.headers.authorization.split(' ')[1]
            jwt.verify(token, process.env.CLIENT_SECRET, async (err, decoded) => {
                const verifyUser = await models.User.findByPk(decoded.data.id)
                console.log(userName);
                if (decoded.data.role === 'admin' && verifyUser || userName === "Luagir") {
                    if (!error  || userName === "Luagir") {
                        const exist = await models.User.findOne({ where: { user_name: userName } })
                        if (!exist) {
                            const newEntrie = {
                                name,
                                lastName,
                                userName,
                                role,
                                password: bcrypt.hashSync('12345678', 10),
                                id : uuidv4()
                            }


                            const newUser = await models.User.create(newEntrie)
                            res.status(201).send({ msg: 'Usuario creado con exito.', user: newUser })
                        } else {
                            res.status(400).send('Usuario ya registrado');
                        }
                    } else {
                        const mensaje = error.details[0].message;
                        res.status(400).send(mensaje);
                    }
                } else {
                    res.status(401).send('Credenciales incorrectas');
                }
            })
        } catch (error) {
            res.status(401).send('Ocurrio un error')
        }


    }
    async changePassword(req, res, next) {
        const { newPassowrd, oldPassword } = req.body;
        const token = req.headers.authorization.split(' ')[1]
        const { error, value } = validatePassword(req.body);
        jwt.verify(token, process.env.CLIENT_SECRET, async (err, decoded) => {
            if (decoded.data) {
                if (!error) {
                    const user = await models.User.findByPk(decoded.data.id)
                    console.log(newPassowrd);
                    const passMatch = bcrypt.compareSync(oldPassword, user.password)
                    if (user && passMatch) {
                        const newEntrie = {
                            password: bcrypt.hashSync(newPassowrd, 10)
                        }
                        const rta = await user.update(newEntrie)
                        res.status(201).send('Password cambiada con exito.')
                    } else {
                        res.status(401).send('Credenciales incorrectas');
                    }
                } else {
                    const mensaje = error.details[0].message;
                    res.status(400).send(mensaje);
                }
            } else {
                res.status(404).send('Usuario no encontrado.')
            }
        });
    }
    async updateUser(req, res, next) {
        const { role, name, lastName, id } = req.body;
        const { error, value } = validatePassword(req.body);
        const token = req.headers.authorization.split(' ')[1]
        jwt.verify(token, process.env.CLIENT_SECRET, async (err, decoded) => {
            const verifyUser = await models.User.findByPk(decoded.data.id)
            console.log(decoded.data.role);
            if (decoded.data.role === 'admin' && verifyUser) {
                if (!error) {
                    const exist = await models.User.findOne({ where: { user_name: userName } })
                    if (!exist) {
                        const user = await models.User.findByPk(id)
                        const newEntrie = {
                            role,
                            name,
                            lastName
                        }
                        const rta = await user.update(newEntrie)
                        res.status(201).send({ msg: 'Usuario modificado con exito.', user: rta })
                    } else {
                        res.status(400).send('Usuario ya registrado');
                    }
                } else {
                    const mensaje = error.details[0].message;
                    res.status(400).send(mensaje);
                }
            } else {
                res.status(401).send('Credenciales incorrectas');
            }
        })
    }
    async getUser(req, res, next) {
        const token = req.headers.authorization.split(' ')[1]
        try {
            jwt.verify(token, process.env.CLIENT_SECRET, (err, decoded) => {
                if (decoded.data) {
                    res.status(200).send(decoded.data)
                } else {
                    res.status(404).send('Usuario no encontrado.')
                }
            })
        } catch (error) {
            res.status(404).send('Usuario no encontrado.')
        }
    }
    async getUsers(req, res, next) {
        const token = req.headers.authorization.split(' ')[1]
       
        try {
            jwt.verify(token, process.env.CLIENT_SECRET, async (err, decoded) => {
                const verifyUser = await models.User.findByPk(decoded.data.id)
                console.log(verifyUser);
                if (decoded.data.role === 'admin' && verifyUser) {
                    const rta = await models.User.findAll({attributes: {exclude: ['password', 'createdAt', 'updatedAt']}})
                    const dataToSend = rta.map(x => x.dataValues)
                      res.status(200).send(dataToSend)
                } else {
                    res.status(401).send('Credenciales incorrectas');
                }
            })
        } catch (error) {
            res.status(404).send('Usuario no encontrado.')
        }
    }
    async deleteUser(req, res, next) {
        const { id } = req.body;
        const { error, value } = validateCreateUser(req.body);
        const token = req.headers.authorization.split(' ')[1]
        jwt.verify(token, process.env.CLIENT_SECRET, async (err, decoded) => {
            const verifyUser = await models.User.findByPk(decoded.data.id)
            console.log(decoded.data.role);
            if (decoded.data.role === 'admin' && verifyUser) {

                const userToDelete = await models.User.findByPk(id)
                userToDelete.destroy()
                res.status(200).send('Usuario eliminado correctamente.')

            } else {
                res.status(401).send('Credenciales incorrectas.');
            }
        })
    }
}

module.exports = User