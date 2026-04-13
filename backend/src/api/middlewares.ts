import { defineMiddlewares } from "@medusajs/framework/http"
import { json } from "body-parser"

export default defineMiddlewares({
  routes: [
    {
      matcher: "/bas-sync",
      middlewares: [
        // Це змусить саме цей роут приймати великі дані до 10МБ
        json({ limit: "10mb" }), 
      ],
    },
  ],
})