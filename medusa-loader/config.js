// /home/vpnaz/projects/medusaStore/medusa-loader/config.js

module.exports = {
  // Шляхи до файлів (тепер точно за твоїм описом)
  jsonFilePath: "/home/vpnaz/projects/medusaStore/data/json/catalog_test.json",
  imagesDir: "/home/vpnaz/projects/medusaStore/data/images",

  // Налаштування Strapi
  strapi: {
    baseURL: "http://localhost:1337",
    apiToken: "64773021ecfe8a76b32c17756cb88eea54933bf2bdf2b70995fd8dd7adce4c4b6845f5c605c4745bf092be5bef6aab0dce230ce30ec9ceb36fc139a8555cab3416cbf0214c2ac56a1b3e14f7da684a51019b0e247b23b7fe094faf1b1a5f209b17461faed1ecb5d2ccc4548db62422b153f3e8acf9310b784e192425e8beb47b" // згенеруй в Settings -> API Tokens
  },

  // Налаштування Medusa
  medusa: {
    baseURL: "http://localhost:9000",
    email: "vpnazarenko@hotmail.com",
    password: "357189",
    channelId: "sc_01KRHFDVZGY7GEST6J2RVXTN0X"
  }
};