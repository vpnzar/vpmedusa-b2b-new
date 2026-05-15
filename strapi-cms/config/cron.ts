export default {
  // Кожну годину (0 хвилина)
  '0 * * * *': async ({ strapi }) => {
    strapi.log.info('⏰ Cron запуск синхронізації...');
    await strapi.service('api::product.sync-medusa').runSync();
  },
};