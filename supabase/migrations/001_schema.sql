-- Hamsa Coffee Brunch schema

create extension if not exists "pgcrypto";

create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  sort_order int not null default 0,
  created_at timestamptz default now()
);

create table if not exists items (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references categories(id) on delete cascade,
  name text not null,
  description text,
  price int not null,
  image_url text,
  is_available boolean default true,
  sort_order int not null default 0,
  created_at timestamptz default now()
);

create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  order_number serial,
  customer_name text not null,
  customer_phone text not null,
  order_type text not null check (order_type in ('retrait', 'livraison')),
  address text,
  note text,
  status text default 'nouvelle' check (status in (
    'nouvelle', 'confirmee', 'en_preparation', 'prete', 'en_livraison', 'terminee', 'annulee'
  )),
  total int not null,
  created_at timestamptz default now()
);

create table if not exists order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references orders(id) on delete cascade,
  item_id uuid references items(id),
  item_name text not null,
  quantity int not null,
  unit_price int not null
);

create table if not exists shop_settings (
  id int primary key default 1 check (id = 1),
  is_open_override boolean,
  whatsapp_number text default '213XXXXXXXXX',
  followers_count int default 4200,
  rating numeric default 4.5
);

insert into shop_settings (id) values (1) on conflict (id) do nothing;

alter table categories enable row level security;
alter table items enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;
alter table shop_settings enable row level security;

-- Public read for menu
create policy "Public read categories" on categories for select using (true);
create policy "Public read items" on items for select using (true);
create policy "Public read shop_settings" on shop_settings for select using (true);

-- Public insert orders
create policy "Public insert orders" on orders for insert with check (true);
create policy "Public insert order_items" on order_items for insert with check (true);

-- Public read own order by id (for tracking)
create policy "Public read orders by id" on orders for select using (true);

-- Admin policies (authenticated users)
create policy "Admin all categories" on categories for all using (auth.role() = 'authenticated');
create policy "Admin all items" on items for all using (auth.role() = 'authenticated');
create policy "Admin read update orders" on orders for select using (auth.role() = 'authenticated');
create policy "Admin update orders" on orders for update using (auth.role() = 'authenticated');
create policy "Admin all shop_settings" on shop_settings for all using (auth.role() = 'authenticated');

-- Realtime
alter publication supabase_realtime add table orders;
