import { Request, Response } from "express"
import slugify from "slugify";
import User from "../models/User"
import { hashPassword, validatePassword } from "../utils/auth"

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
           
            const userExist = await User.findOne({email})
            if(!userExist){
                return res.status(404).json({ message: "Usuario no encontrado" })
            }

            //validate password
            const isPasswordCorrect = await validatePassword(password,userExist.password)
            if(!isPasswordCorrect){
                return res.status(401).json({ message: "Contraseña incorrecta" })
            }
            res.send('Bienvenido')
        } catch (error) {
            console.log('Error log in, authController 41-50')
            res.status(500).json({ message: "Error al iniciar sesión" })
        }

    }
}  