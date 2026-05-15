export default {
  routes: [
    {
      method: 'GET',
      path: '/sync-medusa',
      handler: 'api::product.sync-medusa.trigger', // Повний шлях: api::[ім'я_апі].[ім'я_контролера].[метод]
      config: {
        auth: false,
      },
    },
  ],
};