-- Schema SQL for Tacuche (Vercel + Supabase)

-- 1. Create INSUMOS table (raw materials)
CREATE TABLE public.insumos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    unit TEXT NOT NULL, -- e.g., 'metros', 'gramos', 'millar', 'unidad', 'paquete', 'caja'
    quantity_per_unit NUMERIC NOT NULL DEFAULT 1.0,
    price NUMERIC NOT NULL DEFAULT 0.0,
    store TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Add generated column for unit price in DB if desired, or handle in application.
-- Let's do it via a generated column to keep calculations unified:
ALTER TABLE public.insumos ADD COLUMN unit_price NUMERIC GENERATED ALWAYS AS (
    CASE WHEN quantity_per_unit = 0 THEN 0 ELSE price / quantity_per_unit END
) STORED;

-- 2. Create PACKAGING_COMPONENTS table (to compute standard packaging cost)
CREATE TABLE public.packaging_components (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    price NUMERIC NOT NULL DEFAULT 0.0,
    unit TEXT NOT NULL,
    units_required NUMERIC NOT NULL DEFAULT 1.0,
    capacity_max NUMERIC NOT NULL DEFAULT 1.0, -- if 1 roll of ribbon has 50m and we use 1.5m, unit is roll, units_required = 1.5, capacity_max = 50
    cost_per_unit NUMERIC GENERATED ALWAYS AS (
        CASE WHEN capacity_max = 0 THEN 0 ELSE (price * units_required) / capacity_max END
    ) STORED,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Insert default packaging components from user's Excel
INSERT INTO public.packaging_components (name, price, unit, units_required, capacity_max) VALUES
('Bolsa de manta (manta)', 100.00, 'Metro', 1.0, 7.5),
('Bolsa de manta (hilo)', 218.00, 'Carrete 1000m', 4.0, 1000.0),
('Bolsa de manta (ojillos)', 300.00, 'Millar', 2.0, 1000.0),
('Bolsa de manta (listón)', 75.00, 'Metros', 1.5, 50.0),
('Bolsa de manta (mano de obra)', 150.00, 'Hora', 0.17, 1.0);

-- 3. Create PRODUCTS table (garments/prendas)
CREATE TABLE public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    base_cost NUMERIC NOT NULL DEFAULT 0.0, -- Costo base de la prenda (e.g. $70)
    labor_hours NUMERIC NOT NULL DEFAULT 0.0, -- Horas de confección (e.g. 6.0 horas)
    labor_hourly_rate NUMERIC NOT NULL DEFAULT 150.0, -- Costo taller por hora (e.g. $150)
    packaging_cost_override NUMERIC, -- If null, uses the sum of packaging_components.cost_per_unit
    desired_margin NUMERIC NOT NULL DEFAULT 33.0, -- desired margin % (e.g. 33%)
    price_cash NUMERIC, -- Can be manually set or calculated
    price_card NUMERIC, -- Can be manually set or calculated
    designer TEXT NOT NULL, -- 'Tani', 'Maripy', etc.
    stock INTEGER NOT NULL DEFAULT 0,
    images TEXT[] DEFAULT '{}'::TEXT[],
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    sizes TEXT[] DEFAULT '{}'::TEXT[],
    category TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Create PRODUCT_INSUMOS table (materials used in a specific product)
CREATE TABLE public.product_insumos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
    insumo_id UUID REFERENCES public.insumos(id) ON DELETE CASCADE,
    quantity_used NUMERIC NOT NULL DEFAULT 0.0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Create EXPENSES table (operational expenses)
CREATE TABLE public.expenses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    concept TEXT NOT NULL,
    place TEXT,
    amount NUMERIC NOT NULL DEFAULT 0.0,
    paid_by TEXT NOT NULL, -- 'Tani', 'Maripy', 'Shared'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Create REVENUES table (sales tracker)
CREATE TABLE public.revenues (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    total_amount NUMERIC NOT NULL DEFAULT 0.0, -- total price sold at
    profit NUMERIC NOT NULL DEFAULT 0.0, -- calculated revenue - cost
    payment_method TEXT NOT NULL, -- 'Cash', 'Card', 'Transfer'
    recorded_by TEXT NOT NULL, -- 'Tani', 'Maripy'
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. Enable RLS (Row Level Security) on all tables
ALTER TABLE public.insumos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.packaging_components ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_insumos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.revenues ENABLE ROW LEVEL SECURITY;

-- 8. Create Policies

-- PRODUCTS POLICIES:
-- Public can view active products (for online storefront)
CREATE POLICY "Public Read Active Products" 
ON public.products FOR SELECT 
USING (is_active = true);

-- Auth users can do anything on products
CREATE POLICY "Auth All Products" 
ON public.products FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

-- PRODUCT_INSUMOS POLICIES:
-- Auth users can do anything on product_insumos
CREATE POLICY "Auth All Product Insumos" 
ON public.product_insumos FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

-- INSUMOS POLICIES:
-- Auth users can do anything on insumos
CREATE POLICY "Auth All Insumos" 
ON public.insumos FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

-- PACKAGING_COMPONENTS POLICIES:
-- Auth users can do anything on packaging_components
CREATE POLICY "Auth All Packaging Components" 
ON public.packaging_components FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

-- EXPENSES POLICIES:
-- Auth users can do anything on expenses
CREATE POLICY "Auth All Expenses" 
ON public.expenses FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

-- REVENUES POLICIES:
-- Auth users can do anything on revenues
CREATE POLICY "Auth All Revenues" 
ON public.revenues FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

-- EVENTS TABLE:
CREATE TABLE IF NOT EXISTS public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  date DATE NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('Production', 'Bazar', 'Fitting', 'Photo Shoot', 'Launch', 'Other')),
  status TEXT NOT NULL CHECK (status IN ('Pending', 'Completed')) DEFAULT 'Pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- Auth users can do anything on events
CREATE POLICY "Auth All Events" 
ON public.events FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

-- STORE SETTINGS TABLE:
CREATE TABLE IF NOT EXISTS public.store_settings (
  id TEXT PRIMARY KEY DEFAULT 'main',
  whatsapp_number TEXT NOT NULL DEFAULT '525500000000',
  store_title TEXT NOT NULL DEFAULT 'Colección de Autor',
  store_subtitle TEXT NOT NULL DEFAULT 'Prendas exclusivas confeccionadas a mano. Cada pieza es única y diseñada con pasión por nuestro estudio. Cotiza tu pedido y finaliza por WhatsApp.',
  instagram_url TEXT DEFAULT '',
  hero_banner_url TEXT DEFAULT 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1200&auto=format&fit=crop',
  category_corsets_url TEXT DEFAULT 'https://images.unsplash.com/photo-1618220179428-22790b461013?q=80&w=600&auto=format&fit=crop',
  category_sueteres_url TEXT DEFAULT 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=600&auto=format&fit=crop',
  category_pantalones_url TEXT DEFAULT 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=600&auto=format&fit=crop',
  category_faldas_url TEXT DEFAULT 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=600&auto=format&fit=crop',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.store_settings ENABLE ROW LEVEL SECURITY;

-- Allow public read of settings
CREATE POLICY "Allow Public Read of Settings" 
ON public.store_settings FOR SELECT 
USING (true);

-- Auth users can do anything on settings
CREATE POLICY "Auth All Settings" 
ON public.store_settings FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);
