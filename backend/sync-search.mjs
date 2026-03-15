import pg from 'pg'
import { MeiliSearch } from 'meilisearch'

const meiliClient = new MeiliSearch({
  host: 'http://localhost:7700',
  apiKey: 'GN645xqX-5oda_F8fc9bYPSo_k60Z8nsPzyNWneQjss' // Спробуємо цей стандартний пароль
})

const dbConfig = {
  connectionString: "postgres://postgres:postgres@localhost:5432/medusa_data", // ВСТАВ СВОЮ НАЗВУ БАЗИ ЯКА СПРАЦЮВАЛА
}

async function sync() {
  const db = new pg.Client(dbConfig)
  try {
    await db.connect()
    const res = await db.query("SELECT id, title, handle, description, thumbnail FROM product WHERE deleted_at IS NULL")
    
    // Пряма відправка в індекс
    await meiliClient.index('products').addDocuments(res.rows)
    
    console.log(`🚀 НАРЕШТІ! ${res.rows.length} товарів у пошуку!`)
  } catch (e) {
    console.log("🔥 Помилка:", e.message)
  } finally {
    await db.end()
  }
}
sync()