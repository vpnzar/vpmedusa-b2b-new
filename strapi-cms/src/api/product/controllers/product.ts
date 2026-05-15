import { factories } from '@strapi/strapi';
import axios from 'axios';
import fs from 'fs';
import path from 'path';
import os from 'os';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function uploadToStrapi(imageUrl: string, fileName: string, strapi: any) {
  let tmpFilePath = '';
  try {
    const response = await axios.get(imageUrl, { 
      responseType: 'arraybuffer',
      timeout: 20000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Referer': 'https://www.se.com/'
      }
    });
    
    const buffer = Buffer.from(response.data);
    const ext = path.extname(imageUrl).split('?')[0] || '.png';
    tmpFilePath = path.join(os.tmpdir(), `${fileName}${ext}`);
    fs.writeFileSync(tmpFilePath, buffer);

    const fileEntity = {
      filepath: tmpFilePath,
      originalFilename: `${fileName}${ext}`,
      mimetype: response.headers['content-type'] || 'image/png',
      size: buffer.length,
    };

    const uploadedFiles = await strapi.plugin('upload').service('upload').upload({
      data: { 
        fileInfo: { 
          name: fileName,
          alternativeText: fileName 
        } 
      },
      files: fileEntity,
    });

    if (fs.existsSync(tmpFilePath)) fs.unlinkSync(tmpFilePath);

    return uploadedFiles && uploadedFiles.length > 0 ? uploadedFiles[0] : null;
  } catch (error: any) {
    strapi.log.error(`Помилка фото ${fileName}: ${error.message}`);
    if (tmpFilePath && fs.existsSync(tmpFilePath)) {
      try { fs.unlinkSync(tmpFilePath); } catch (e) {}
    }
    return null;
  }
}

export default factories.createCoreController('api::product.product' as any, ({ strapi }) => ({
  async importCatalog(ctx) {
    try {
      strapi.log.info('=== ЗАПУСК ІМПОРТУ (Strapi 5 Бронебійний) ===');
      const { catalog } = ctx.request.body;

      if (!catalog || !Array.isArray(catalog)) {
        return ctx.badRequest('Каталог пустий або має невірний формат');
      }

      for (const item of catalog) {
        const imageField = item.params?.find((p: any) => p.name === "Зображення");
        const imageUrl = imageField ? imageField.value : null;
        
        let uploadedImage = null;
        if (imageUrl && imageUrl.startsWith('http')) {
          uploadedImage = await uploadToStrapi(imageUrl, item.article, strapi);
          await delay(1000); 
        }

        const productData = {
          title: item.title,
          article: item.article,
          price: parseFloat(item.price) || 0,
          metadata: item.params,
          publishedAt: new Date(),
          main_image: uploadedImage ? uploadedImage.id : null,
        };

        // Використовуємо Document Service з приведенням до any для обходу помилок TS
        const docService = (strapi as any).documents('api::product.product');

        const existing = await docService.findFirst({
  filters: { 
    article: item.article // Спробуй спочатку так
  }
});

        if (existing) {
          strapi.log.info(`Оновлення: ${item.article}`);
          await docService.update({
            documentId: existing.documentId,
            data: productData,
          });
        } else {
          strapi.log.info(`Створення: ${item.article}`);
          await docService.create({
            data: productData,
          });
        }
      }

      return { status: 'ok', processed: catalog.length };
    } catch (err: any) {
      strapi.log.error(`Критична помилка: ${err.message}`);
      return ctx.internalServerError(err.message);
    }
  }
}));