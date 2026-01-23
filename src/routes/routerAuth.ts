import { Router } from "express"
import { body } from 'express-validator';
import { authController } from "../controllers/authController"
import { handleInputErrors } from "../middleware/validation";
import { isAuthenticate } from "../middleware/auth";


const router = Router()

router.post('/register',
    body('handle').notEmpty().withMessage('El alias es obligatorio'),
    body('name').notEmpty().withMessage('El nombre es obligatorio'),
    body('email')
        .notEmpty().withMessage('El email es obligatorio')
        .isEmail().withMessage('Ingrese un email válido'),
    body('password').isLength({ min: 8 }).withMessage('Ingrese una contraseña válida, mínimo 8 caracteres'),
    handleInputErrors,
    authController.registerAccount)

router.post('/login',
    body('email')
        .notEmpty().withMessage('El email es obligatorio')
        .isEmail().withMessage('Ingrese un email válido'),
    body('password').notEmpty().withMessage('Ingrese la contraseña'),
    handleInputErrors,
    authController.login)

router.get('/user', isAuthenticate, authController.getUser)

router.patch('/user',
    body('handle').notEmpty().withMessage('El alias es obligatorio'),
    handleInputErrors,
    isAuthenticate,
    authController.updateProfile)

router.post('/user/image', isAuthenticate, authController.uploadImage)

export default router