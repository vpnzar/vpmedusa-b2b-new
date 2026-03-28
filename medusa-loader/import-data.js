const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');
const config = require('./config');
const { normalize, formatTitle } = require('./helpers');

const cache = { 
    tags: {}, 
    types: {}, 
    collections: {}, 
    categories: {} 
};

// --- ДОПОМІЖНІ ФУНКЦІЇ ---

function slugify(text) {
    if (!text) return "";
    return text.toString().toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\wа-яіїє\-]+/g, '')
        .replace(/\-\-+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '');
}

function normalizeTag(value) {
    if (!value) return null;
    let v = value.toLowerCase().trim();
    if (v.includes('|')) v = v.split('|')[0].trim();
    
    // Твоя логіка нормалізації кольорів
    if (v.includes('біл') || v === 'white') return 'білий';
    if (v.includes('крем')) return 'кремовий';
    if (v.includes('алюм')) return 'алюміній';
    if (v.includes('антрац')) return 'антрацит';
    if (v.includes('сталь')) return 'сталь';
    
    return v.replace(/['"«»]/g, '');
}

async function getTag(v, api) {
    const cleanV = normalizeTag(v);
    if (!cleanV) return null;
    
    if (cache.tags[cleanV]) return { id: cache.tags[cleanV] };
    
    try {
        const res = await api.post('/admin/product-tags', { value: cleanV });
        cache.tags[cleanV] = res.data.product_tag.id;
        return { id: cache.tags[cleanV] };
    } catch (e) {
        const search = await api.get(`/admin/product-tags?q=${encodeURIComponent(cleanV)}`);
        const found = search.data.product_tags.find(t => t.value.toLowerCase() === cleanV);
        if (found) {
            cache.tags[cleanV] = found.id;
            return { id: found.id };
        }
        return null;
    }
}

async function ensureCategory(name, api, parentId = null, customHandle = null) {
    if (!name) return null;
    const cacheKey = `${name.toLowerCase()}-${parentId}`;
    
    if (cache.categories[cacheKey]) return cache.categories[cacheKey];

    try {
        const res = await api.get(`/admin/product-categories?q=${encodeURIComponent(name)}`);
        let cat = res.data.product_categories.find(c => 
            c.name.toLowerCase() === name.toLowerCase() && 
            c.parent_category_id === parentId
        );

        if (!cat) {
            const h = customHandle || slugify(name);
            console.log(`📂 Створення категорії: ${name} (handle: ${h})`);
            const newCat = await api.post('/admin/product-categories', {
                name: name,
                handle: h,
                parent_category_id: parentId,
                is_active: true
            });
            cat = newCat.data.product_category;
        }
        
        cache.categories[cacheKey] = cat.id;
        return cat.id;
    } catch (e) {
        console.error(`❌ Помилка категорії ${name}:`, e.message);
        return null;
    }
}

async function uploadImage(url, api, sku) {
    if (!url || !url.startsWith('http')) return null;
    try {
        const response = await axios.get(url, { responseType: 'arraybuffer' });
        const form = new FormData();
        form.append('files', Buffer.from(response.data), { 
            filename: `${sku}.png`, 
            contentType: 'image/png' 
        });
        
        const res = await api.post('/admin/uploads', form, { 
            headers: form.getHeaders() 
        });
        return res.data.files[0];
    } catch (e) {
        return null;
    }
}

// --- ГОЛОВНИЙ ЦИКЛ (run) ---

async function run() {
    try {
        console.log("🔐 Авторизація...");
        const auth = await axios.post(`${config.baseURL}/auth/user/emailpass`, {
            email: config.email, 
            password: config.password
        });
        
        const api = axios.create({
            baseURL: config.baseURL,
            headers: { 'Authorization': `Bearer ${auth.data.token}` }
        });

        const data = JSON.parse(fs.readFileSync(config.jsonFile, 'utf8'));
        const products = data.catalog || data;

        for (const item of products) {
            const sku = (item.article || "").toUpperCase();
            if (!sku) continue;

            try {
                // 1. Формуємо метадані (характеристики)
                const attr = {};
                if (item.params) {
                    item.params.forEach(p => {
                        const key = p.name.toLowerCase().trim().replace(/\s+/g, '_');
                        attr[key] = p.value;
                    });
                }

                // 2. Логіка ієрархії категорій
                let finalCatId = null;
                const isHeating = item.main_group === 'Тепла підлога' || item.category === 'Опалення';

                if (isHeating) {
                    // Гілка Arnold Rak
                    const rootId = await ensureCategory("Опалення", api, null, "heating");
                    const subId = await ensureCategory("Тепла підлога", api, rootId, "warm-floor");
                    const brandId = await ensureCategory("Arnold Rak", api, subId, "arnold-rak");
                    
                    const seriesName = item.tab_name || "Standart Cable";
                    const compactHandle = `arnoldrak-${slugify(seriesName)}`;
                    finalCatId = await ensureCategory(seriesName, api, brandId, compactHandle);
                } else {
                    // Гілка Schneider
                    const rootId = await ensureCategory("Розетки-вимикачі", api, null, "catalog");
                    const brandId = await ensureCategory("Schneider Electric", api, rootId, "schneider-electric");
                    
                    const seriesName = attr['серія_продукту'] || item.series || "Інше";
                    const combinedHandle = `schneider-${slugify(seriesName)}`;
                    finalCatId = await ensureCategory(seriesName, api, brandId, combinedHandle);
                }

                // 3. Теги (колір, серія, тип)
                const productTags = [];
                const tagsToProcess = [attr['відтінок_кольору'], attr['серія_продукту'], attr['тип_виробу']];
                
                for (const val of tagsToProcess) {
                    if (val) {
                        const tObj = await getTag(val, api);
                        if (tObj) productTags.push(tObj);
                    }
                }

                // 4. Завантаження фото
                let uploadedImages = [];
                const imgUrl = item.image || attr['зображення'];
                if (imgUrl) {
                    const uploaded = await uploadImage(imgUrl, api, sku);
                    if (uploaded) {
                        uploadedImages = [uploaded];
                    }
                }

                const title = formatTitle(item.title || item.name, sku);
                
                // Пейлоад для створення/оновлення
                const payload = {
                    title: title,
                    handle: slugify(title + "-" + sku),
                    status: "published",
                    categories: finalCatId ? [{ id: finalCatId }] : [],
                    tags: productTags,
                    sales_channels: [{ id: config.channelId }],
                    metadata: attr,
                    thumbnail: uploadedImages[0]?.url || "",
                    images: uploadedImages.map(img => ({ url: img.url }))
                };

                // 5. Запис у базу Medusa
                const search = await api.get(`/admin/products?q=${encodeURIComponent(sku)}`);
                const existing = search.data.products?.find(p => 
                    p.variants.some(v => v.sku === sku)
              );
              
                     // --- ДОДАЙ ЦЕЙ ЛОГ ПЕРЕД ЗАПИСОМ ---
                     console.log(`🔍 Товар ${sku}: Категорія ID = ${finalCatId}`);

                if (existing) {
                    console.log(`🔄 Оновлення: ${sku}`);
                    // Оновлюємо ТІЛЬКИ безпечні поля для уникнення помилки 400
                    const updateData = {
                        title: payload.title,
                        categories: payload.categories,
                        metadata: payload.metadata,
                        tags: payload.tags,
                        thumbnail: payload.thumbnail,
                        images: payload.images
                    };
                    await api.post(`/admin/products/${existing.id}`, updateData);
                } else {
                    console.log(`✅ Створення: ${sku}`);
                    await api.post('/admin/products', {
                        ...payload,
                        options: [{ title: "Default", values: ["Standard"] }],
                        variants: [{ 
                            title: "Standard", 
                            sku: sku, 
                            prices: [{ currency_code: "uah", amount: parseFloat(item.price || 0) }], 
                            options: { "Default": "Standard" }, 
                            manage_inventory: false 
                        }]
                    });
                }

                // Невелика затримка для стабільності
                await new Promise(r => setTimeout(r, 150));

            } catch (e) {
                const errorData = e.response?.data?.message || e.message;
                console.error(`❌ Помилка на SKU ${sku}:`, errorData);
            }
        }
        
        console.log("🏁 ІМПОРТ ЗАВЕРШЕНО УСПІШНО!");

    } catch (err) {
        console.error("💥 КРИТИЧНИЙ ЗБІЙ СКРИПТА:", err.message);
    }
}

// Початок роботи
run();