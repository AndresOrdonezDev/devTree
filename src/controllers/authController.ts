import { Request, Response } from "express"
import slugify from "slugify";
import formidable from 'formidable'
import User from "../models/User"
import { hashPassword, validatePassword } from "../utils/auth"
import { generateJWT } from "../utils/jwt";
import cloudinary from "../config/cloudinary";

export class authController {
    static registerAccount = async (req: Request, res: Response) => {
        try {
            const { email, password } = req.body
            const existAccount = await User.findOne({ email })
            if (existAccount) {
                return res.status(403).json({ message: "Correo ya registrado" })
            }
            const handle = slugify(req.body.handle, '');
            const handleExist = await User.findOne({ handle })

            if (handleExist) {
                return res.status(409).json({ message: "El Alias ya existe" })
            }

            const user = new User(req.body)
            user.password = await hashPassword(password)
            user.handle = handle
            await user.save()

            res.status(201).send('Registro creado exitosamente')
        } catch (error) {
            console.log('Error to create user, authController line 11-25')
            res.status(500).json({ message: "Error al crear el usuario" })
        }
    }

    static login = async (req: Request, res: Response) => {
        try {
            const { email, password } = req.body

            const user = await User.findOne({ email })
            if (!user) {
                return res.status(404).json({ message: "Usuario no encontrado" })
            }

            //validate password
            const isPasswordCorrect = await validatePassword(password, user.password)
            if (!isPasswordCorrect) {
                return res.status(401).json({ message: "Contraseña incorrecta" })
            }
            const token = generateJWT({ id: user._id })
            return res.send(token)

        } catch (error) {
            console.log('Error log in, authController 41-50')
            res.status(500).json({ message: "Error al iniciar sesión" })
        }

    }

    static getUser = async (req: Request, res: Response) => {
        return res.json(req.user)
    }

    static updateProfile = async (req: Request, res: Response) => {
        try {
            const { description } = req.body

            const handle = slugify(req.body.handle, '');
            const handleExist = await User.findOne({ handle })
            if (handleExist && handleExist.email !== req.user.email) {
                return res.status(409).json({ message: "El Alias ya existe" })
            }

            req.user.handle = handle
            req.user.description = description
            await req.user.save()
            res.send('Perfil Actualizado')
        } catch (e) {
            const error = new Error('Hubo un error en el servidor')
            res.status(500).json({ message: error.message })
        }
    }

    static uploadImage = async (req: Request, res: Response) => {
        try {
            const form = formidable({ multiples: false })
            form.parse(req, (error, fields, files) => {

                cloudinary.uploader.upload(files.file[0].filepath, {}, async function (error, result) {
                    if (error) {
                        return res.status(400).json({ message: 'Error al procesar la imagen' })
                    }
                    if (result) {
                        req.user.image = result.secure_url
                        await req.user.save()
                        res.json({message:'Se subió la imagen', image:req.user.image})
                    }
                })
            })
        } catch (e) {
            const error = new Error('Hubo un error en el servidor')
            res.status(500).json({ message: error.message })
        }
    }

}  