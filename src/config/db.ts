import mongoose from "mongoose";
import colors from 'colors'
export const connectDB = async () => {
    try {
        const {connection} = await mongoose.connect(process.env.MONGO_URI)
        const infoConnection = `${connection.host}:${connection.port}`
        console.log(colors.bgMagenta(`Mongo connected on: ${infoConnection}`))
    } catch (error) {
        console.log(colors.bgRed('error to connect to db'))
        console.log(error.message)
        process.exit(1)
    }
}