import Joi from 'joi';
import 'dotenv/config';

const envSchema = Joi.object({
    NODE_ENV: Joi.string()
        .valid('development', 'production')
        .required(),
    PORT: Joi.number().port().required(),
    JWT_SECRET: Joi.string().min(1).required(),
    USER_NAME: Joi.string().required().email(),
    API_KEY: Joi.string().required(),
    FROM_ADDRESS: Joi.string().required().email(),
    KEY_PHRASE: Joi.string().required(),
    IV_PHRASE: Joi.string().required()
}).unknown(); // allow extra vars if needed

const { error, value: envVars } = envSchema.validate(process.env, {
    abortEarly: false,
    convert: true, // converts string "3000" to number 3000
});

if (error) {
    console.error('Invalid environment variables:', error.details.map((d) => d.message));
    process.exit(1);
}
export { envVars };