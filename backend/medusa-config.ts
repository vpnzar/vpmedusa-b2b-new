import { defineConfig, loadEnv, Modules } from "@medusajs/framework/utils"

loadEnv(process.env.NODE_ENV || 'development', process.cwd())

export default defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    http: {
      storeCors: process.env.STORE_CORS!,
      adminCors: process.env.ADMIN_CORS!,
      authCors: process.env.AUTH_CORS!,
      jwtSecret: process.env.JWT_SECRET || "supersecret",
      cookieSecret: process.env.COOKIE_SECRET || "supersecret",
    }
  },
  modules: {
    // МОДУЛЬ ODOO ВИДАЛЕНО — тут він більше не муляє очі
    
    // ФАЙЛОВИЙ МОДУЛЬ (для локального збереження картинок)
    [Modules.FILE]: {
      resolve: "@medusajs/medusa/file",
      options: {
        providers: [
          {
            resolve: "@medusajs/medusa/file-local",
            options: {
              config: {
                upload_dir: "static", 
                backend_url: "http://localhost:9000/static" 
              }
            }
          }
        ]
      }
    }
  },
})