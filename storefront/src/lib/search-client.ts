import MeiliSearch from "meilisearch"

export const searchClient = new MeiliSearch({
  host: "http://localhost:7700",
  // Встав сюди свій Master Key або Default Search Key
  apiKey: "GN645xqX-5oda_F8fc9bYPSo_k60Z8nsPzyNWneQjss", 
})

export const SEARCH_INDEX_NAME = "products"