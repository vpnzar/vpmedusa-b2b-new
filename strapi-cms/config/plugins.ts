import type { Core } from '@strapi/strapi';

export default ({ env }: { env: any }) => ({
  i18n: {
    enabled: true,
    config: {
      defaultLocale: 'uk',
      locales: ['uk', 'en'],
    },
  },
  // Додаємо блок завантаження для Cloudinary
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