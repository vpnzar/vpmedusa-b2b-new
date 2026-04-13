export default {
  routes: [
    {
      method: 'POST',
      path: '/import-catalog',
      // ПЕРЕВІР: тут 'api::product.product.importCatalog' (через крапку в кінці назва методу)
      handler: 'api::product.product.importCatalog',
      config: {
        auth: false,
      },
    },
    {
      method: 'GET',
      path: '/products',
      handler: 'api::product.product.find',
    },
    {
      method: 'GET',
      path: '/products/:id',
      handler: 'api::product.product.findOne',
    }
  ],
};