const axios = require('axios');
const fs = require('fs');
const path = require('path');
const FormData = require('form-data');
const { normalize, formatTitle } = require('./helpers');

// --- КОНФІГУРАЦІЯ ---
const STRAPI_URL = 'http://localhost:1337';
const STRAPI_TOKEN = 'ТВІЙ_ТОКЕН'; 
const JSON_FILE = '/home/vpnaz/projects/medusaStore/data/json/catalog_test.json';
const IMAGES_DIR = '/home/vpnaz/projects/medusaStore/data/images';

const api = axios.create({
  baseURL: STRAPI_URL,
  headers: { Authorization: `Bearer ${STRAPI_TOKEN}` }
});

// Завантаження медіафайлів
async function uploadImage(imagePath, article) {
  try {
    const formData = new FormData();
    formData.append('files', fs.createReadStream(imagePath));
    formData.append('fileInfo', JSON.stringify({ name: article, alternativeText: article }));

    const res = await api.post('/api/upload', formData, { headers: formData.getHeaders() });
    return res.data[0].id;
  } catch (e) {
    console.error(`[Image Error] ${article}: ${e.message}`);
    return null;
  }
}

// Створення або пошук категорій
async function ensureCategory(name, parentId = null) {
  try {
    const res = await api.get('/api/categories', { params: { filters: { name: { $eq: name } } } });
    if (res.data.data.length > 0) return res.data.data[0].id;

    const createRes = await api.post('/api/categories', {
      data: { name, parent: parentId, publishedAt: new Date() }
    });
    return createRes.data.data.id;
  } catch (e) {
    console.error(`[Category Error] ${name}: ${e.message}`);
    return null;
  }
}

async function main() {
  try {
    const data = JSON.parse(fs.readFileSync(JSON_FILE, 'utf8'));
    const items = data.catalog || data;
    const allFiles = fs.readdirSync(IMAGES_DIR);

    console.log(`🚀 Початок імпорту: ${items.length} товарів...`);

    for (const item of items) {
      const sku = String(item.article || item.SKU).trim();
      
      // 1. Обробка категорій (Main Group > Series)
      const mainCatId = await ensureCategory(item.main_group || 'Каталог');
      const subCatId = await ensureCategory(item.series || 'Загальне', mainCatId);

      // 2. Пошук та завантаження фото
      let imageId = null;
      const fileMatch = allFiles.find(f => f.toLowerCase().startsWith(sku.toLowerCase() + '.'));
      if (fileMatch) {
        imageId = await uploadImage(path.join(IMAGES_DIR, fileMatch), sku);
      }

      // 3. Підготовка даних
      const payload = {
        data: {
          article: sku,
          title: formatTitle(item.title || item.name, sku),
          price: parseFloat(item.price) || 0,
          description: item.title || '',
          categories: subCatId ? [subCatId] : [],
          image: imageId,
          metadata: item.params || {},
          publishedAt: new Date()
        }
      };

      // 4. Upsert (Створення або Оновлення)
      const existing = await api.get('/api/products', { params: { filters: { article: { $eq: sku } } } });

      if (existing.data.data.length > 0) {
        const documentId = existing.data.data[0].documentId; // Strapi v5 використовує documentId
        await api.put(`/api/products/${documentId}`, payload);
        console.log(`🔄 Оновлено: ${sku}`);
      } else {
        await api.post('/api/products', payload);
        console.log(`✅ Створено: ${sku}`);
      }
    }
    console.log('🏁 Імпорт завершено!');
  } catch (err) {
    console.error('💥 Критична помилка виконання:', err.message);
  }
}

main();