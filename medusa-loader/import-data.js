// import.js
const axios = require('axios');
const fs = require('fs');
const config = require('./config');
const { normalize, formatTitle } = require('./helpers');

const cache = { tags: {}, types: {}, collections: {} };

async function run() {
  try {
    // 1. Авторизація
    const auth = await axios.post(`${config.baseURL}/auth/user/emailpass`, {
      email: config.email, password: config.password
    });
    const api = axios.create({
      baseURL: config.baseURL,
      headers: { 'Authorization': `Bearer ${auth.data.token}` }
    });

    // 2. Швидка синхронізація (Кеш)
    // Завантажуємо все, що вже є в Medusa, щоб не перепитувати базу 1000 разів
    console.log("🔄 Синхронізація бази...");
    const [t, tp, c] = await Promise.all([
      api.get('/admin/product-tags?limit=1000'),
      api.get('/admin/product-types?limit=1000'),
      api.get('/admin/collections?limit=1000')
    ]);
    t.data.product_tags.forEach(i => cache.tags[i.value.toLowerCase()] = i.id);
    tp.data.product_types.forEach(i => cache.types[i.value.toLowerCase()] = i.id);
    c.data.collections.forEach(i => cache.collections[i.title.toLowerCase()] = i.id);

    // 3. Функції-геттери (працюють миттєво через кеш)
    const getTag = async (val) => {
      const v = normalize(val); if (!v) return null;
      if (cache.tags[v]) return { id: cache.tags[v] };
      const res = await api.post('/admin/product-tags', { value: v });
      cache.tags[v] = res.data.product_tag.id;
      return { id: res.data.product_tag.id };
    };

    const getType = async (val) => {
      const v = normalize(val); if (!v) return null;
      if (cache.types[v]) return cache.types[v];
      const res = await api.post('/admin/product-types', { value: v });
      cache.types[v] = res.data.product_type.id;
      return res.data.product_type.id;
    };

    // 4. Основний цикл імпорту
    const raw = JSON.parse(fs.readFileSync(config.jsonFile, 'utf8'));
    const categoryRes = await api.get('/admin/product-categories?q=Розетки-вимикачі');
    const catId = categoryRes.data.product_categories[0]?.id;

    for (const item of raw.catalog) {
      const sku = item.article.toUpperCase();
      const handle = `schneider-${sku}`.toLowerCase().replace(/[^a-z0-9]/gi, '-');

      try {
        const attr = {};
        item.params?.forEach(p => {
          const key = p.name.toLowerCase().trim().replace(/\s+/g, '_').replace(/[^a-zа-я0-9_]/gi, '');
          attr[key] = p.value;
        });

        const tags = [];
        const t1 = await getTag(attr['вдтнок_кольору']); if (t1) tags.push(t1);
        const t2 = await getTag(attr['мнмальне_спотворення_ширини_мпульсутре']); if (t2) tags.push(t2);

        const productData = {
          title: formatTitle(item.title || item.name, sku),
          description: attr['опис'] || item.description || "",
          handle: handle,
          status: "published",
          thumbnail: item.picture || attr['зображення'] || null,
          material: normalize(attr['матерал'] || attr['матеріал']),
          type_id: await getType(attr['тип_виробу_або_компоненту']),
          collection_id: cache.collections[(attr['серя_продукту'] || "Asfora").toLowerCase()],
          categories: catId ? [{ id: catId }] : [],
          tags: tags,
          sales_channels: [{ id: config.channelId }],
          metadata: attr
        };

        const price = parseFloat((attr['цна'] || item.price || "0").toString().replace(',', '.'));

        // Перевірка наявності та оновлення/створення
        const search = await api.get(`/admin/products?handle=${handle}&fields=id,variants`);
        if (search.data.products?.length > 0) {
          const p = search.data.products[0];
          console.log(`🔄 Оновлення: ${sku}`);
          await api.post(`/admin/products/${p.id}`, productData);
          if (p.variants?.[0]) {
            await api.post(`/admin/products/${p.id}/variants/${p.variants[0].id}`, {
              prices: [{ currency_code: "uah", amount: price }]
            });
          }
        } else {
          console.log(`✅ Створення: ${sku}`);
          await api.post('/admin/products', {
            ...productData,
            options: [{ title: "Type", values: ["Standard"] }],
            variants: [{ title: "Standard", sku, prices: [{ currency_code: "uah", amount: price }], options: { "Type": "Standard" }, manage_inventory: false }]
          });
        }
        await new Promise(r => setTimeout(r, 40));
      } catch (e) { console.error(`❌ Помилка ${sku}:`, e.message); }
    }
    console.log("🏁 Завершено!");
  } catch (err) { console.error("Критична помилка:", err.message); }
}

run();