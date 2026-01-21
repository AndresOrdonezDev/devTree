import { CorsOptions } from 'cors'
const whiteListCors = [process.env.FRONTEND_URL, undefined]
export const corOptions:CorsOptions = {
    origin:function(origin,callback){
        if(whiteListCors.indexOf(origin) !== -1){
            callback(null,true)
        }else{
            callback(new Error('Not allowed by CORS'))
        }
    }
}