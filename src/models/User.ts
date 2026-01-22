import mongoose, { Schema, Document } from "mongoose";
export interface IUser extends Document {
    handle:string,
    name:string,
    email:string,
    password:string,
    description:string
}
const userSchema = new Schema({
    handle: {
        type:String,
        require:true,
        trim:true,
        unique:true,
        lowercase:true
    },
    name: {
        type:String,
        require:true,
        trim:true
    },
    email: {
        type:String,
        require:true,
        trim:true,
        unique:true,
        lowercase:true
    },
    password: {
        type:String,
        require:true,
        trim:true
    },
    description: {
        type:String,
        default:'',
    },
})

const User = mongoose.model<IUser>('User',userSchema)

export default User