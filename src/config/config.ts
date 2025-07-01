import { CipherInterface, MailInterface, ServerInterface } from "../interface/ConfigInterface.js";
import { envVars } from "./config.validation.js";

export const config = {
    server: <ServerInterface>{
        nodeEnvironment: envVars.NODE_ENV,
        port: envVars.PORT,
        jwtSecret: envVars.JWT_SECRET
    },
    mail: <MailInterface>{
        username: envVars.USER_NAME,
        apiKey: envVars.API_KEY,
        fromAddress: envVars.FROM_ADDRESS
    },
    cipher: <CipherInterface>{
        key_phrase: envVars.KEY_PHRASE,
        iv_phrase: envVars.IV_PHRASE
    },
}