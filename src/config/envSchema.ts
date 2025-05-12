import Joi from "joi";

export const envSchema = {

    PORT: Joi.number().required().default(3000),
    SECRET_JWT: Joi.string().required(),
    DATABASE_DIALECT: Joi.string().required(),
    DATABASE_HOST: Joi.string().required(),
    DATABASE_PORT: Joi.number().required().default(5432),
    DATABASE_NAME: Joi.string().required(),
    DATABASE_USER: Joi.string().required(),
    DATABASE_PASSWORD: Joi.string().required(),
}