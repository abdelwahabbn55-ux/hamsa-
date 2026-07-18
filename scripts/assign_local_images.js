const fs = require('fs');

const imgFiles = fs.readdirSync('public/img').filter(f => f.endsWith('.jpg') || f.endsWith('.png'));

let sql = '-- Update items to use high-quality local images\n\n';
let i = 0;

sql += `
UPDATE items
SET image_url = (
    CASE 
        -- Just assigning random images based on ID hash or something simple
        -- Since we can't do random easily in a simple way for each row reliably without a complex query
        -- We will just do a simple modulo on the row number
        WHEN image_url IS NOT NULL THEN
            (ARRAY[
                ${imgFiles.map(f => `'/img/${f}'`).join(',\n                ')}
            ])[mod(abs(hashtext(id::text)), ${imgFiles.length}) + 1]
        ELSE NULL
    END
)
WHERE image_url LIKE '%tablebeep%';
`;

fs.writeFileSync('supabase/migrations/003_update_images.sql', sql);
console.log('Successfully generated supabase/migrations/003_update_images.sql');
