import { factories } from '@strapi/strapi';

// ПЕРЕВІР: тут має бути ТІЛЬКИ 'api::product.product'
export default factories.createCoreController('api::product.product', ({ strapi }) => ({
  async importCatalog(ctx) {
    try {
      const { catalog } = ctx.request.body;

      if (!catalog || !Array.isArray(catalog)) {
        return ctx.badRequest('Де дані? Треба масив у полі "catalog"');
      }

      for (const item of catalog) {
        // Логіка пошуку категорії
        let category = await strapi.db.query('api::category.category').findOne({
          where: { name: item.series }
        });

        if (!category) {
          category = await strapi.entityService.create('api::category.category', {
            data: { name: item.series, publishedAt: new Date() }
          });
        }

        // Логіка створення/оновлення товару
        const existingProduct = await strapi.db.query('api::product.product').findOne({
          where: { article: item.article }
        });

        const productData = {
          title: item.title,
          article: item.article,
          price: parseFloat(item.price) || 0,
          metadata: item.params,
          category: category.id,
          publishedAt: new Date(),
        };

        if (existingProduct) {
          await strapi.entityService.update('api::product.product', existingProduct.id, {
            data: productData as any
          });
        } else {
          await strapi.entityService.create('api::product.product', {
            data: productData as any
          });
        }
      }

      return { status: 'success', message: `Імпортовано ${catalog.length} товарів` };
    } catch (err) {
      ctx.body = err;
    }
  }
}));