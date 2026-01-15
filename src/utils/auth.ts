import bcrypt from "bcrypt"

const NUMBER_SALT = 10
export const hashPassword = async (password:string)=>{
    const salt = await bcrypt.genSalt(NUMBER_SALT)
    return await bcrypt.hash(password, salt)
}

export const validatePassword = async (enteredPassword:string, hash:string)=>{
    return await bcrypt.compare(enteredPassword,hash)
}