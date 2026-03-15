// src/api/middlewares.ts
import { defineMiddlewares } from "@medusajs/framework/http"

export default defineMiddlewares({
  routes: [], // Залишаємо порожнім або просто видаляємо блок для /bas-sync
})