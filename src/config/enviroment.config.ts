export const AppConfigEnvironment = () => ({

    port: parseInt(process.env.PORT || "3000", 10),
    keyJwt: process.env.SECRET_JWT,
    database: {

        dialect: process.env.DATABASE_DIALECT as any,
        host: process.env.DATABASE_HOST,
        port: parseInt(process.env.DATABASE_PORT || "3306", 10),
        username: process.env.DATABASE_USER,
        database: process.env.DATABASE_NAME,
        password: process.env.DATABASE_PASSWORD,
        logging: false
    }
});