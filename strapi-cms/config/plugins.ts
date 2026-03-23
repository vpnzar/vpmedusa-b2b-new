import type { Core } from '@strapi/strapi';

export default ({ env }: { env: any }) => ({
  i18n: {
    enabled: true,
    config: {
      defaultLocale: 'uk',
      locales: ['uk', 'en'],
    },
  },
});