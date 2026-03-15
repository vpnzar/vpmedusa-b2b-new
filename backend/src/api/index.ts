import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import express from "express"
import path from "path"

export function registerRoutes(app: express.Application) {
  // Дозволяємо доступ до папки static через URL /static
  app.use("/static", express.static(path.join(process.cwd(), "static")))
}