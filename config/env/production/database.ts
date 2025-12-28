export default ({ env }) => ({
    connection: {
        client: 'postgres',
        connection: (process.env.DATABASE_URL)
            ? {
                connectionString: process.env.DATABASE_URL,
                ssl: (process.env.DATABASE_SSL !== 'false') && {
                    rejectUnauthorized: (process.env.DATABASE_SSL_REJECT_UNAUTHORIZED === 'true'),
                },
            }
            : {
                host: process.env.DATABASE_HOST || '127.0.0.1',
                port: parseInt(process.env.DATABASE_PORT || '5432', 10),
                database: process.env.DATABASE_NAME || 'strapi',
                user: process.env.DATABASE_USERNAME || 'strapi',
                password: process.env.DATABASE_PASSWORD || 'strapi',
                ssl: (process.env.DATABASE_SSL !== 'false') && {
                    rejectUnauthorized: (process.env.DATABASE_SSL_REJECT_UNAUTHORIZED === 'true'),
                },
            },
        debug: false,
    },
});
