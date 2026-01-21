import type { Request, Response, NextFunction } from 'express'
import jwt from "jsonwebtoken";
import User, { IUser } from '../models/User';

declare global{
    namespace Express{
        interface Request{
            user?:IUser
        }
    }
}
export const isAuthenticate = async (req: Request, res: Response, next: NextFunction) => {
    let bearer = req.headers.authorization
    if (!bearer) {
        const error = new Error('No autorizado')
        return res.status(401).json({ 'message': error.message })
    }
    const [, token] = bearer.split(' ')
    if (!token) {
        const error = new Error('No autorizado')
        return res.status(401).json({ 'message': error.message })
    }

    try {
        const result = jwt.verify(token, process.env.JWT_SECRET)
        if (typeof result === 'object' && result.id) {
            const user = await User.findById(result.id).select('-password')
            if (!user) {
                const error = new Error("Usuario no encontrado")
                return res.status(404).json({ 'message': error.message })
            }
            req.user = user
            next()
        }
    } catch (error) {
        return res.status(500).json({ "message": "Token no válido" })
    }
}