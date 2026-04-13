import type { StrapiApp } from '@strapi/strapi/admin';

export default {
  config: {
    locales: ['uk'],
    translations: {
      uk: {
        "content-manager.plugin.name": "Менеджер контенту",
        "app.components.LeftMenu.navbrand.title": "Панель управління",
        "Auth.form.welcome.title": "Ласкаво просимо до Strapi!",
        "Auth.form.welcome.subtitle": "Увійдіть у свій акаунт",
      },
    },
  },
  // Додаємо тип StrapiApp для параметра app
  bootstrap(app: StrapiApp) {
    console.log("Admin app bootstrapped with Ukrainian locale");
  },
};