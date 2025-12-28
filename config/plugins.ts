export default ({ env }) => ({
    // Enable internationalization plugin
    i18n: {
        enabled: true,
        config: {
            defaultLocale: 'en',
            locales: ['en', 'fr'],
        },
    },
    upload: {
        config: {
            provider: 'cloudinary',
            providerOptions: {
                cloud_name: env('CLOUDINARY_NAME'),
                api_key: env('CLOUDINARY_KEY'),
                api_secret: env('CLOUDINARY_SECRET'),
            },
            actionOptions: {
                upload: {},
                delete: {},
            },
        },
    },
});
