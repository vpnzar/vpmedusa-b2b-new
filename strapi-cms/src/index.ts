import { Core } from '@strapi/strapi';

export default {
  register() {},
  bootstrap({ strapi }: { strapi: Core.Strapi }) {
    // Тут порожньо, бо імпорт тепер іде через зовнішній скрипт
  },
};