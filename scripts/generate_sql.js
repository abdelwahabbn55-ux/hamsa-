const fs = require('fs');
const crypto = require('crypto');

const menuData = JSON.parse(fs.readFileSync('hamsa_menu.json', 'utf8'));
let sql = '-- Auto-generated SQL from hamsa_menu.json\n\n';

sql += '-- Insert Categories\n';
const catIds = {};
let sortCat = 1;
for (const cat of menuData.categories) {
  const id = crypto.randomUUID();
  catIds[cat.name] = id;
  sql += `INSERT INTO categories (id, name, sort_order) VALUES ('${id}', '${cat.name.replace(/'/g, "''")}', ${sortCat});\n`;
  sortCat++;
}

sql += '\n-- Insert Items\n';
let sortItem = 1;
for (const cat of menuData.categories) {
  const catId = catIds[cat.name];
  for (const item of cat.items) {
    const desc = item.description ? `'${item.description.replace(/'/g, "''")}'` : 'NULL';
    const img = item.image ? `'${item.image}'` : 'NULL';
    sql += `INSERT INTO items (category_id, name, description, price, image_url, sort_order) VALUES ('${catId}', '${item.name.replace(/'/g, "''")}', ${desc}, ${item.price}, ${img}, ${sortItem});\n`;
    sortItem++;
  }
}

fs.writeFileSync('supabase/migrations/002_seed_menu.sql', sql);
console.log('Successfully generated supabase/migrations/002_seed_menu.sql');
