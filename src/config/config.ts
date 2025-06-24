import { ServerInterface } from "../interface/ConfigInterface.js";
import 'dotenv/config'
export const config={
    server:<ServerInterface>{
        nodeEnvironment: process.env['NODE_ENV'],
        port: process.env['PORT']
    }
}