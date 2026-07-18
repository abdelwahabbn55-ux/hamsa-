-- Seed menu data for Hamsa Coffee Brunch
-- Run after 001_schema.sql

delete from order_items;
delete from orders;
delete from items;
delete from categories;

insert into categories (id, name, sort_order) values
  ('11111111-1111-1111-1111-111111111101', 'Brunch Salé', 1),
  ('11111111-1111-1111-1111-111111111102', 'Brunch Sucré', 2),
  ('11111111-1111-1111-1111-111111111103', 'Boissons', 3),
  ('11111111-1111-1111-1111-111111111104', 'Cookies & Pâtisserie', 4);

insert into items (category_id, name, description, price, image_url, sort_order) values
  ('11111111-1111-1111-1111-111111111101', 'Bruschetta burrata', 'Pain artisanal grillé, burrata crémeuse, tomates cerises rôties et basilic frais', 1400, '/img/photo_2026-07-17_20-54-16.jpg', 1),
  ('11111111-1111-1111-1111-111111111101', 'Bruschetta avocat crevettes', 'Avocat écrasé, crevettes grillées, citron vert et herbes fraîches sur toast croustillant', 1600, '/img/photo_4_2026-07-17_20-58-21.jpg', 2),
  ('11111111-1111-1111-1111-111111111101', 'Salade burrata fraîche', 'Burrata, roquette, tomates confites, huile d''olive et vinaigre balsamique', 1500, '/img/photo_15_2026-07-17_20-58-21.jpg', 3),
  ('11111111-1111-1111-1111-111111111102', 'Granola bowl', 'Granola maison, yaourt grec, fruits frais de saison et miel', 1200, '/img/photo_11_2026-07-17_20-58-21.jpg', 1),
  ('11111111-1111-1111-1111-111111111102', 'Brioche harmonie', 'Brioche dorée, crème légère, fruits rouges et coulis de passion', 1800, '/img/photo_5_2026-07-17_20-58-21.jpg', 2),
  ('11111111-1111-1111-1111-111111111102', 'Waffle chocolat', 'Gaufre croustillante, sauce chocolat belge, chantilly et noisettes', 1300, '/img/photo_25_2026-07-17_20-58-21.jpg', 3),
  ('11111111-1111-1111-1111-111111111102', 'Crumble aux pommes', 'Pommes caramélisées, crumble croustillant à la cannelle, glace vanille', 1100, '/img/photo_12_2026-07-17_20-58-21.jpg', 4),
  ('11111111-1111-1111-1111-111111111103', 'Latte macchiato', 'Espresso double, lait velouté et mousse délicate', 600, '/img/photo_20_2026-07-17_20-58-21.jpg', 1),
  ('11111111-1111-1111-1111-111111111103', 'Ice Matcha', 'Matcha premium, lait froid et glace pilée — rafraîchissant et équilibré', 750, '/img/photo_21_2026-07-17_20-58-21.jpg', 2),
  ('11111111-1111-1111-1111-111111111103', 'Ice Ube Latte', 'Lait ube violet, espresso et glace — signature Hamsa', 750, '/img/photo_22_2026-07-17_20-58-21.jpg', 3),
  ('11111111-1111-1111-1111-111111111104', 'Cookie pistache', 'Cookie fondant aux pistaches de Sicile et pépites de chocolat blanc', 400, '/img/photo_32_2026-07-17_20-58-21.jpg', 1),
  ('11111111-1111-1111-1111-111111111104', 'Cookie oreo', 'Cookie moelleux aux morceaux d''Oreo et coeur crémeux', 400, '/img/photo_33_2026-07-17_20-58-21.jpg', 2),
  ('11111111-1111-1111-1111-111111111104', 'Cookie fraise matcha', 'Cookie matcha vert garni de fraises séchées et touches de citron', 450, '/img/photo_34_2026-07-17_20-58-21.jpg', 3);

update shop_settings set
  whatsapp_number = '213555123456',
  followers_count = 4250,
  rating = 4.5
where id = 1;
