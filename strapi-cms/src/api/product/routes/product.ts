export default {
  routes: [
    {
      method: 'POST',
      path: '/products/import-catalog', // Краще додати префікс /products, щоб не було конфліктів
      handler: 'api::product.product.importCatalog',
      config: {
        auth: false, // Тимчасово вимкнено для тестів
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/products',
      handler: 'api::product.product.find',
      config: {
        auth: false,
      },
    },
    {
      method: 'GET',
      path: '/products/:id',
      handler: 'api::product.product.findOne',
      config: {
        auth: false,
      },
    },
  ],
};