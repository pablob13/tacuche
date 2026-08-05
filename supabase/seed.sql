-- Seed data SQL script for Tacuche (Vercel + Supabase)
-- Copy and run this script in your Supabase SQL Editor to import the real Excel data

-- 1. Clear existing data to avoid key duplicates
TRUNCATE public.product_insumos CASCADE;
TRUNCATE public.insumos CASCADE;
TRUNCATE public.products CASCADE;
TRUNCATE public.packaging_components CASCADE;

-- 2. Insert INSUMOS (Raw Materials)
INSERT INTO public.insumos (id, name, unit, quantity_per_unit, price, store) VALUES
('c17424fa-a021-4bd1-93bd-a9d98e0f4701', 'Chakiras', 'gramos', 500, 75, 'Centro'),
('c17424fa-a021-4bd1-93bd-a9d98e0f4702', 'Ojillos OK145N', 'millar', 1000, 189.53, 'Ganon'),
('c17424fa-a021-4bd1-93bd-a9d98e0f4703', 'Ojillos OL3NE', 'millar', 1000, 300.00, 'Ganon'),
('c17424fa-a021-4bd1-93bd-a9d98e0f4704', 'Hilos Recta', 'metros', 1000, 218.00, 'Centro'),
('c17424fa-a021-4bd1-93bd-a9d98e0f4705', 'Hilos Over', 'metros', 1600, 62.00, 'Nuevo Mundo'),
('c17424fa-a021-4bd1-93bd-a9d98e0f4706', 'Chakirón', 'gramos', 500, 75, 'Centro'),
('c17424fa-a021-4bd1-93bd-a9d98e0f4707', 'Tinte Mariposa', 'paquete', 1, 28.75, 'Farmacia'),
('c17424fa-a021-4bd1-93bd-a9d98e0f4708', 'Listón 1"', 'metros', 50, 90.00, 'Fantasías Miguel'),
('c17424fa-a021-4bd1-93bd-a9d98e0f4709', 'Listón 1 1/2"', 'metros', 50, 160.00, 'Fantasías Miguel'),
('c17424fa-a021-4bd1-93bd-a9d98e0f4710', 'Hilaza Dalia', 'pieza', 1, 94.00, 'Centro'),
('c17424fa-a021-4bd1-93bd-a9d98e0f4711', 'Lino Azul', 'metros', 1, 74.00, 'Centro'),
('c17424fa-a021-4bd1-93bd-a9d98e0f4712', 'Gabardina', 'metros', 1, 299.00, 'Centro'),
('c17424fa-a021-4bd1-93bd-a9d98e0f4713', 'Telas Flores', 'metros', 1, 140.00, 'Centro'),
('c17424fa-a021-4bd1-93bd-a9d98e0f4714', 'Entretelas', 'metros', 1, 200.00, 'Centro'),
('c17424fa-a021-4bd1-93bd-a9d98e0f4715', 'Agujetas', 'metros', 1, 60.00, 'Centro'),
('c17424fa-a021-4bd1-93bd-a9d98e0f4716', 'Meclilla', 'metros', 1, 70.00, 'Centro'),
('c17424fa-a021-4bd1-93bd-a9d98e0f4717', 'Forro', 'metros', 1, 30.00, 'Centro'),
('c17424fa-a021-4bd1-93bd-a9d98e0f4718', 'Telas Cebra', 'metros', 1, 30.00, 'Centro'),
('c17424fa-a021-4bd1-93bd-a9d98e0f4719', 'Telas Cuadros', 'metros', 1, 30.00, 'Centro'),
('c17424fa-a021-4bd1-93bd-a9d98e0f4720', 'Tela Puntas', 'metros', 1, 30.00, 'Centro'),
('c17424fa-a021-4bd1-93bd-a9d98e0f4721', 'Hilo Lino', 'metros', 1, 120.00, 'Centro'),
('c17424fa-a021-4bd1-93bd-a9d98e0f4722', 'Telas Manta', 'metros', 1, 60.00, 'Centro'),
('c17424fa-a021-4bd1-93bd-a9d98e0f4723', 'Estambres', 'unidad', 1, 400.00, 'Centro'),
('c17424fa-a021-4bd1-93bd-a9d98e0f4724', 'Encaje', 'metros', 1, 50.00, 'Centro'),
('c17424fa-a021-4bd1-93bd-a9d98e0f4725', 'Telas Lino', 'metros', 1, 100.00, 'Centro'),
('c17424fa-a021-4bd1-93bd-a9d98e0f4726', 'Telas Botones', 'unidad', 1, 17.00, 'Centro');

-- 3. Insert PACKAGING Components (Summing up to $140)
INSERT INTO public.packaging_components (id, name, price, unit, units_required, capacity_max) VALUES
('d27424fa-a021-4bd1-93bd-a9d98e0f4701', 'Bolsa de Manta', 70.00, 'Pieza', 1.0, 1.0),
('d27424fa-a021-4bd1-93bd-a9d98e0f4702', 'Etiqueta + Listón', 30.00, 'Pieza', 1.0, 1.0),
('d27424fa-a021-4bd1-93bd-a9d98e0f4703', 'Mano de Obra Empaque', 40.00, 'Pieza', 1.0, 1.0);

-- 4. Insert PRODUCTS (Garments from Excel)
INSERT INTO public.products (id, name, description, base_cost, labor_hours, labor_hourly_rate, desired_margin, price_cash, price_card, designer, stock, is_active, images) VALUES
('e3fd1736-0d2f-46d0-8f0d-e6efad416d01', 'Suéter Negro', 'Suéter tejido premium en color negro con detalles artesanales.', 70, 5.6, 150, 30, 1600, 1700, 'Tani', 10, true, '{"https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=600&auto=format&fit=crop"}'),
('e3fd1736-0d2f-46d0-8f0d-e6efad416d02', 'Falda Militar', 'Falda con corte estructurado estilo militar, confeccionada con detalles únicos.', 70, 6.0, 150, 30, 1600, 1700, 'Gabriela', 5, true, '{"https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=600&auto=format&fit=crop"}'),
('e3fd1736-0d2f-46d0-8f0d-e6efad416d03', 'Corset Negro', 'Corset entallado premium en color negro con listones y ojillos metálicos.', 70, 18.0, 150, 22, 3600, 3800, 'Maripy', 2, true, '{"https://images.unsplash.com/photo-1618220179428-22790b461013?q=80&w=600&auto=format&fit=crop"}'),
('e3fd1736-0d2f-46d0-8f0d-e6efad416d04', 'Espurucunchitos', 'Prenda fresca y ligera de la colección Tacuche.', 70, 4.0, 150, 30, 1200, 1300, 'Maripy', 12, true, '{"https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=600&auto=format&fit=crop"}'),
('e3fd1736-0d2f-46d0-8f0d-e6efad416d05', 'Top Vaca', 'Top corto con estampado temático de vaca y costuras visibles.', 70, 4.0, 150, 30, 1100, 1150, 'Maripy', 4, true, '{"https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=600&auto=format&fit=crop"}'),
('e3fd1736-0d2f-46d0-8f0d-e6efad416d06', 'Jines Pol', 'Pantalones estilizados en gabardina fina con bolsillos funcionales.', 70, 6.0, 150, 30, 2050, 2150, 'Maripy', 3, true, '{"https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=600&auto=format&fit=crop"}'),
('e3fd1736-0d2f-46d0-8f0d-e6efad416d07', 'Top Mezclilla', 'Top confeccionado en mezclilla recuperada de alta durabilidad.', 70, 4.0, 150, 30, 1200, 1300, 'Tani', 8, true, '{"https://images.unsplash.com/photo-1611312449412-6cefac5dc3e4?q=80&w=600&auto=format&fit=crop"}'),
('e3fd1736-0d2f-46d0-8f0d-e6efad416d08', 'Hoodie Flores', 'Sudadera premium bordada a mano con flores de colores vivos.', 70, 6.0, 150, 30, 1800, 1900, 'Maripy', 6, true, '{"https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=600&auto=format&fit=crop"}'),
('e3fd1736-0d2f-46d0-8f0d-e6efad416d09', 'Top Negro Ojillos', 'Top minimalista con tiras ajustables y ojillos de metal.', 70, 3.0, 150, 30, 1000, 1050, 'Tani', 7, true, '{"https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=600&auto=format&fit=crop"}'),
('e3fd1736-0d2f-46d0-8f0d-e6efad416d10', 'Top Cebra Huipil', 'Fusión de estampado cebra con corte tipo huipil mexicano.', 70, 8.0, 150, 30, 2100, 2200, 'Tani', 4, true, '{"https://images.unsplash.com/photo-1603252109303-2751441dd157?q=80&w=600&auto=format&fit=crop"}'),
('e3fd1736-0d2f-46d0-8f0d-e6efad416d11', 'Corset Mau', 'Corset estructurado color lavanda con listones cruzados.', 70, 7.0, 150, 30, 1900, 2000, 'Tani', 2, true, '{"https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=600&auto=format&fit=crop"}'),
('e3fd1736-0d2f-46d0-8f0d-e6efad416d12', 'Falda Floricienta', 'Falda floreada asimétrica con vuelo de lino y olanes.', 68, 9.0, 150, 30, 2300, 2400, 'Tani', 3, true, '{"https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=600&auto=format&fit=crop"}'),
('e3fd1736-0d2f-46d0-8f0d-e6efad416d13', 'Pantalón Lino Azul', 'Pantalón cómodo y fresco confeccionado en lino azul cielo.', 70, 6.5, 150, 30, 1800, 1900, 'Tani', 5, true, '{"https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=600&auto=format&fit=crop"}'),
('e3fd1736-0d2f-46d0-8f0d-e6efad416d14', 'Pantalón Lino Negro', 'Pantalón clásico de lino negro con cordones de ajuste.', 70, 10.0, 150, 30, 2700, 2850, 'Tani', 4, true, '{"https://images.unsplash.com/photo-1506152983158-b4a74a01c721?q=80&w=600&auto=format&fit=crop"}'),
('e3fd1736-0d2f-46d0-8f0d-e6efad416d15', 'Bolsa Hippie', 'Bolso tejido a mano estilo bohemio con forro interno.', 70, 7.5, 150, 30, 2100, 2200, 'Tani', 9, true, '{"https://images.unsplash.com/photo-1529458083742-20c24233ccab?q=80&w=600&auto=format&fit=crop"}'),
('e3fd1736-0d2f-46d0-8f0d-e6efad416d16', 'Jeans Pompas', 'Jeans de mezclilla con ajuste y moldura trasera premium.', 70, 10.0, 150, 30, 2650, 2800, 'Maripy', 3, true, '{"https://images.unsplash.com/photo-1542272604-787c3835535d?q=80&w=600&auto=format&fit=crop"}'),
('e3fd1736-0d2f-46d0-8f0d-e6efad416d17', 'Tshirt Foto', 'Playera de algodón de alta calidad con estampado fotográfico y estambres.', 70, 6.0, 150, 30, 2200, 2300, 'Tani', 15, true, '{"https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=600&auto=format&fit=crop"}'),
('e3fd1736-0d2f-46d0-8f0d-e6efad416d18', 'Hoodie Boca', 'Sudadera premium en color block con labios bordados.', 70, 5.0, 150, 30, 1500, 1600, 'Maripy', 8, true, '{"https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=600&auto=format&fit=crop"}'),
('e3fd1736-0d2f-46d0-8f0d-e6efad416d19', 'Falda Blanca Lino', 'Falda fresca en color blanco de lino con encajes decorativos.', 70, 6.0, 150, 30, 1700, 1800, 'Tani', 5, true, '{"https://images.unsplash.com/photo-1583496661160-fb488b2c1a82?q=80&w=600&auto=format&fit=crop"}');

-- 5. Insert Materials junction mappings (product_insumos)
INSERT INTO public.product_insumos (product_id, insumo_id, quantity_used) VALUES
-- Suéter Negro (i10: Hilaza Dalia 0.5, i4: Hilos Recta 10)
('e3fd1736-0d2f-46d0-8f0d-e6efad416d01', 'c17424fa-a021-4bd1-93bd-a9d98e0f4710', 0.5),
('e3fd1736-0d2f-46d0-8f0d-e6efad416d01', 'c17424fa-a021-4bd1-93bd-a9d98e0f4704', 10),
-- Falda Militar (i1: Chakiras 2, i4: Hilos Recta 10)
('e3fd1736-0d2f-46d0-8f0d-e6efad416d02', 'c17424fa-a021-4bd1-93bd-a9d98e0f4701', 2),
('e3fd1736-0d2f-46d0-8f0d-e6efad416d02', 'c17424fa-a021-4bd1-93bd-a9d98e0f4704', 10),
-- Corset Negro (i3: Ojillos 10, i8: Listón 1" 1.5)
('e3fd1736-0d2f-46d0-8f0d-e6efad416d03', 'c17424fa-a021-4bd1-93bd-a9d98e0f4703', 10),
('e3fd1736-0d2f-46d0-8f0d-e6efad416d03', 'c17424fa-a021-4bd1-93bd-a9d98e0f4708', 1.5),
-- Espurucunchitos (i4: Hilos Recta 20)
('e3fd1736-0d2f-46d0-8f0d-e6efad416d04', 'c17424fa-a021-4bd1-93bd-a9d98e0f4704', 20),
-- Top Vaca (i4: Hilos Recta 30)
('e3fd1736-0d2f-46d0-8f0d-e6efad416d05', 'c17424fa-a021-4bd1-93bd-a9d98e0f4704', 30),
-- Jines Pol (i12: Gabardina 1, i4: Hilos Recta 30)
('e3fd1736-0d2f-46d0-8f0d-e6efad416d06', 'c17424fa-a021-4bd1-93bd-a9d98e0f4712', 1),
('e3fd1736-0d2f-46d0-8f0d-e6efad416d06', 'c17424fa-a021-4bd1-93bd-a9d98e0f4704', 30),
-- Top Mezclilla (i16: Mezclilla 0.2, i4: Hilos Recta 4)
('e3fd1736-0d2f-46d0-8f0d-e6efad416d07', 'c17424fa-a021-4bd1-93bd-a9d98e0f4716', 0.2),
('e3fd1736-0d2f-46d0-8f0d-e6efad416d07', 'c17424fa-a021-4bd1-93bd-a9d98e0f4704', 4),
-- Hoodie Flores (i13: Telas Flores 0.4, i14: Entretelas 0.2)
('e3fd1736-0d2f-46d0-8f0d-e6efad416d08', 'c17424fa-a021-4bd1-93bd-a9d98e0f4713', 0.4),
('e3fd1736-0d2f-46d0-8f0d-e6efad416d08', 'c17424fa-a021-4bd1-93bd-a9d98e0f4714', 0.2),
-- Top Negro Ojillos (i2: Ojillos 100, i4: Hilos Recta 3)
('e3fd1736-0d2f-46d0-8f0d-e6efad416d09', 'c17424fa-a021-4bd1-93bd-a9d98e0f4702', 100),
('e3fd1736-0d2f-46d0-8f0d-e6efad416d09', 'c17424fa-a021-4bd1-93bd-a9d98e0f4704', 3),
-- Top Cebra Huipil (i18: Telas Cebra 0.5, i17: Forro 0.5)
('e3fd1736-0d2f-46d0-8f0d-e6efad416d10', 'c17424fa-a021-4bd1-93bd-a9d98e0f4718', 0.5),
('e3fd1736-0d2f-46d0-8f0d-e6efad416d10', 'c17424fa-a021-4bd1-93bd-a9d98e0f4717', 0.5),
-- Corset Mau (i17: Forro 0.8, i3: Ojillos 80)
('e3fd1736-0d2f-46d0-8f0d-e6efad416d11', 'c17424fa-a021-4bd1-93bd-a9d98e0f4717', 0.8),
('e3fd1736-0d2f-46d0-8f0d-e6efad416d11', 'c17424fa-a021-4bd1-93bd-a9d98e0f4703', 80),
-- Falda Floricienta (i19: Telas Cuadros 0.3, i20: Tela Puntas 0.25)
('e3fd1736-0d2f-46d0-8f0d-e6efad416d12', 'c17424fa-a021-4bd1-93bd-a9d98e0f4719', 0.3),
('e3fd1736-0d2f-46d0-8f0d-e6efad416d12', 'c17424fa-a021-4bd1-93bd-a9d98e0f4720', 0.25),
-- Pantalón Lino Azul (i11: Lino Azul 0.25)
('e3fd1736-0d2f-46d0-8f0d-e6efad416d13', 'c17424fa-a021-4bd1-93bd-a9d98e0f4711', 0.25),
-- Pantalón Lino Negro (i21: Hilo Lino 1)
('e3fd1736-0d2f-46d0-8f0d-e6efad416d14', 'c17424fa-a021-4bd1-93bd-a9d98e0f4721', 1),
-- Bolsa Hippie (i22: Telas Manta 2)
('e3fd1736-0d2f-46d0-8f0d-e6efad416d15', 'c17424fa-a021-4bd1-93bd-a9d98e0f4722', 2),
-- Jeans Pompas (i16: Mezclilla 1.7)
('e3fd1736-0d2f-46d0-8f0d-e6efad416d16', 'c17424fa-a021-4bd1-93bd-a9d98e0f4716', 1.7),
-- Tshirt Foto (i23: Estambres 1)
('e3fd1736-0d2f-46d0-8f0d-e6efad416d17', 'c17424fa-a021-4bd1-93bd-a9d98e0f4723', 1),
-- Hoodie Boca (i17: Forro 0.6)
('e3fd1736-0d2f-46d0-8f0d-e6efad416d18', 'c17424fa-a021-4bd1-93bd-a9d98e0f4717', 0.6),
-- Falda Blanca Lino (i24: Encaje 0.8, i25: Telas Lino 0.8)
('e3fd1736-0d2f-46d0-8f0d-e6efad416d19', 'c17424fa-a021-4bd1-93bd-a9d98e0f4724', 0.8),
('e3fd1736-0d2f-46d0-8f0d-e6efad416d19', 'c17424fa-a021-4bd1-93bd-a9d98e0f4725', 0.8);
