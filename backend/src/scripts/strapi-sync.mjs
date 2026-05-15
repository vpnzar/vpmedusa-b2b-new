import pg from 'pg';
import axios from 'axios';
import { MeiliSearch } from 'meilisearch';

// --- 1. КОНФІГУРАЦІЯ (ПЕРЕВІР ПАРОЛЬ БАЗИ!) ---
const CONFIG = {
  strapi: "http://localhost:1337",
  meili: { host: 'http://localhost:7700', apiKey: 'GN645xqX-5oda_F8fc9bYPSo_k60Z8nsPzyNWneQjss' },
  db: {
    connectionString: "postgres://medusa:medusa@localhost:5432/medusa_db"
  }
};

const client = new pg.Client(CONFIG.db);
const meili = new MeiliSearch(CONFIG.meili);

// --- 2. ДОПОМІЖНІ ФУНКЦІЇ ---

// Перетворює характеристики зі Strapi на нормальні поля
function transformSpecs(metadata) {
  const specs = {};
  if (Array.isArray(metadata)) {
    metadata.forEach(item => {
      const key = item.name.toLowerCase().replace(/\s+/g, '_');
      specs[key] = item.value;
    });
  }
  return specs;
}

// --- 3. ГОЛОВНІ БЛОКИ МАГІЇ ---

// БЛОК А: БУДУЄМО ДЕРЕВО КАТЕГОРІЙ
async function syncCategoryTree() {
  console.log("🌿 Будуємо ієрархію категорій...");
  const res = await axios.get(`${CONFIG.strapi}/api/categories?populate=parent`);
  
  for (const cat of res.data.data) {
    const handle = cat.attributes.name.toLowerCase().replace(/\s+/g, '-');
    const parentData = cat.attributes.parent?.data;

    if (parentData) {
      const parentHandle = parentData.attributes.name.toLowerCase().replace(/\s+/g, '-');
      await client.query(`
        UPDATE product_category 
        SET parent_category_id = (SELECT id FROM product_category WHERE handle = $1)
        WHERE handle = $2
      `, [parentHandle, handle]);
    }
  }
}

// БЛОК Б: ОНОВЛЮЄМО ТОВАРИ (МЕТАДАНІ, ФОТО, ПРИВ'ЯЗКА)
async function syncProducts() {
  console.log("📦 Оновлюємо товари...");
  const res = await client.query("SELECT id, handle, metadata FROM product WHERE deleted_at IS NULL");

  for (const product of res.rows) {
    const article = product.handle.toUpperCase();
    
    try {
      // Тягнемо все зі Strapi одним запитом
      const strapiRes = await axios.get(`${CONFIG.strapi}/api/products`, {
        params: { 'filters[article][$eq]': article, 'populate': 'category,metadata' }
      });

      const strapiData = strapiRes.data.data?.[0];
      if (!strapiData) continue;

      const attr = strapiData.attributes;
      const specs = transformSpecs(attr.metadata);

      // Формуємо чисті метадані (без сміття)
      const cleanMetadata = {
        ...product.metadata,
        article: article,
        brand: "Schneider Electric", // Можна теж брати зі Strapi
        ...specs,
        sync_at: new Date().toISOString()
      };
      delete cleanMetadata.metadata; // Видаляємо вкладеність

      // Оновлюємо базу Medusa
      await client.query(
        "UPDATE product SET metadata = $1, updated_at = NOW() WHERE id = $2",
        [JSON.stringify(cleanMetadata), product.id]
      );

      // Прив'язка до категорії (якщо вказана в Strapi)
      if (attr.category?.data) {
        const catHandle = attr.category.data.attributes.name.toLowerCase().replace(/\s+/g, '-');
        await client.query(`
          INSERT INTO product_category_product (product_id, product_category_id)
          SELECT $1, id FROM product_category WHERE handle = $2
          ON CONFLICT DO NOTHING
        `, [product.id, catHandle]);
      }

    } catch (e) {
      console.log(`❌ Помилка з ${article}: ${e.message}`);
    }
  }
}

// --- 4. ЗАПУСК ВСЬОГО ОДРАЗУ ---
async function run() {
  try {
    await client.connect();
    
    await syncCategoryTree(); // Спочатку дерево
    await syncProducts();     // Потім товари
    
    // В кінці оновлюємо пошук
    const finalData = await client.query("SELECT id, title, handle, thumbnail, metadata FROM product WHERE deleted_at IS NULL");
    await meili.index('products').addDocuments(finalData.rows);
    
    console.log("🏁 ГОТОВО! Все синхронізовано.");
  } catch (err) {
    console.error("💥 КРИТИЧНА ПОМИЛКА:", err);
  } finally {
    await client.end();
  }
}

run();