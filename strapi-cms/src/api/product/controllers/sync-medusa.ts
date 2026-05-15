export default {
  async trigger(ctx) {
    try {
      // Виклик сервісу через глобальний об'єкт strapi
      const result = await strapi.service('api::product.sync-medusa').runSync();
      ctx.body = result;
    } catch (err) {
      strapi.log.error('Помилка в контролері синхронізації:', err);
      ctx.throw(500, err);
    }
  },
};