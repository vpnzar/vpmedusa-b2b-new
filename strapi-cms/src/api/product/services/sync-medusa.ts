import fs from 'fs';

export default () => ({
  async runSync() {
    const jsonPath = '/srv/Medusa_Content/json/catalog_test.json';
    strapi.log.info('🚀 Ручний запуск синхронізації...');

    if (!fs.existsSync(jsonPath)) {
      return { error: 'JSON file not found at ' + jsonPath };
    }

    // Твій код завантаження (цикл for, axios тощо)
    // ...

    return { message: 'Синхронізація завершена успішно' };
  }
});