// helpers.js
module.exports = {
  // Чистимо теги та типи
  normalize: (val) => {
    if (!val) return null;
    let clean = val.toString().toLowerCase().trim();
    if (clean.includes('|')) clean = clean.split('|')[0].trim();
    if (clean.includes(':')) clean = clean.split(':').pop().trim();
    clean = clean.replace(/\s+/g, ' ').trim();
    return (['-', 'null', ''].includes(clean) || clean.length < 2) ? null : clean;
  },

  // Гарно пишемо назву товару
  formatTitle: (text, article) => {
    if (!text) return "";
    let formatted = text.toLowerCase().trim();
    formatted = formatted.charAt(0).toUpperCase() + formatted.slice(1);
    ["Asfora", "Schneider", "Electric", "Sedna"].forEach(w => {
      formatted = formatted.replace(new RegExp(w, "gi"), w);
    });
    return `${formatted}, ${article.toUpperCase()}`;
  }
};