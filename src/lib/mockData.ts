import type { Insumo, PackagingComponent, Product, Expense, Revenue, CalendarEvent, StoreSettings } from '../types';

// Default Insumos from Excel
const defaultInsumos: Insumo[] = [
  { id: 'i1', name: 'Chakiras', unit: 'gramos', quantity_per_unit: 500, price: 75, store: 'Centro' },
  { id: 'i2', name: 'Ojillos OK145N', unit: 'millar', quantity_per_unit: 1000, price: 189.53, store: 'Ganon' },
  { id: 'i3', name: 'Ojillos OL3NE', unit: 'millar', quantity_per_unit: 1000, price: 300.00, store: 'Ganon' },
  { id: 'i4', name: 'Hilos Recta', unit: 'metros', quantity_per_unit: 1000, price: 218.00, store: 'Centro' },
  { id: 'i5', name: 'Hilos Over', unit: 'metros', quantity_per_unit: 1600, price: 62.00, store: 'Nuevo Mundo' },
  { id: 'i6', name: 'Chakirón', unit: 'gramos', quantity_per_unit: 500, price: 75, store: 'Centro' },
  { id: 'i7', name: 'Tinte Mariposa', unit: 'paquete', quantity_per_unit: 1, price: 28.75, store: 'Farmacia' },
  { id: 'i8', name: 'Listón 1"', unit: 'metros', quantity_per_unit: 50, price: 90.00, store: 'Fantasías Miguel' },
  { id: 'i9', name: 'Listón 1 1/2"', unit: 'metros', quantity_per_unit: 50, price: 160.00, store: 'Fantasías Miguel' },
  { id: 'i10', name: 'Hilaza Dalia', unit: 'pieza', quantity_per_unit: 1, price: 94.00, store: 'Centro' },
  { id: 'i11', name: 'Lino Azul', unit: 'metros', quantity_per_unit: 1, price: 74.00, store: 'Centro' },
  { id: 'i12', name: 'Gabardina', unit: 'metros', quantity_per_unit: 1, price: 299.00, store: 'Centro' },
  { id: 'i13', name: 'Telas Flores', unit: 'metros', quantity_per_unit: 1, price: 140.00, store: 'Centro' },
  { id: 'i14', name: 'Entretelas', unit: 'metros', quantity_per_unit: 1, price: 200.00, store: 'Centro' },
  { id: 'i15', name: 'Agujetas', unit: 'metros', quantity_per_unit: 1, price: 60.00, store: 'Centro' },
  { id: 'i16', name: 'Meclilla', unit: 'metros', quantity_per_unit: 1, price: 70.00, store: 'Centro' },
  { id: 'i17', name: 'Forro', unit: 'metros', quantity_per_unit: 1, price: 30.00, store: 'Centro' },
  { id: 'i18', name: 'Telas Cebra', unit: 'metros', quantity_per_unit: 1, price: 30.00, store: 'Centro' },
  { id: 'i19', name: 'Telas Cuadros', unit: 'metros', quantity_per_unit: 1, price: 30.00, store: 'Centro' },
  { id: 'i20', name: 'Tela Puntas', unit: 'metros', quantity_per_unit: 1, price: 30.00, store: 'Centro' },
  { id: 'i21', name: 'Hilo Lino', unit: 'metros', quantity_per_unit: 1, price: 120.00, store: 'Centro' },
  { id: 'i22', name: 'Telas Manta', unit: 'metros', quantity_per_unit: 1, price: 60.00, store: 'Centro' },
  { id: 'i23', name: 'Estambres', unit: 'unidad', quantity_per_unit: 1, price: 400.00, store: 'Centro' },
  { id: 'i24', name: 'Encaje', unit: 'metros', quantity_per_unit: 1, price: 50.00, store: 'Centro' },
  { id: 'i25', name: 'Telas Lino', unit: 'metros', quantity_per_unit: 1, price: 100.00, store: 'Centro' },
  { id: 'i26', name: 'Telas Botones', unit: 'unidad', quantity_per_unit: 1, price: 17.00, store: 'Centro' }
].map(item => ({
  ...item,
  unit_price: item.price / item.quantity_per_unit
}));

// Default Packaging Components summing up to exactly $140.00 from Excel
const defaultPackaging: PackagingComponent[] = [
  { id: 'p1', name: 'Bolsa de Manta', price: 70.00, unit: 'Pieza', units_required: 1.0, capacity_max: 1 },
  { id: 'p2', name: 'Etiqueta + Listón', price: 30.00, unit: 'Pieza', units_required: 1.0, capacity_max: 1 },
  { id: 'p3', name: 'Mano de Obra Empaque', price: 40.00, unit: 'Pieza', units_required: 1.0, capacity_max: 1 }
].map(item => ({
  ...item,
  cost_per_unit: (item.price * item.units_required) / item.capacity_max
}));

// Default Products (Prendas reales del Excel)
const defaultProducts: Product[] = [
  {
    id: 'prod1',
    name: 'Suéter Negro',
    description: 'Suéter tejido premium en color negro con detalles artesanales.',
    base_cost: 70,
    labor_hours: 5.6,
    labor_hourly_rate: 150,
    desired_margin: 30,
    price_cash: 1600,
    price_card: 1700,
    designer: 'Tani',
    stock: 10,
    images: ['https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=600&auto=format&fit=crop'],
    is_active: true,
    materials: [
      { insumo_id: 'i10', quantity_used: 0.5 }, // Hilaza
      { insumo_id: 'i4', quantity_used: 10 } // Hilos recta
    ]
  },
  {
    id: 'prod2',
    name: 'Falda Militar',
    description: 'Falda con corte estructurado estilo militar, confeccionada con detalles únicos.',
    base_cost: 70,
    labor_hours: 6.0,
    labor_hourly_rate: 150,
    desired_margin: 30,
    price_cash: 1600,
    price_card: 1700,
    designer: 'Gabriela',
    stock: 5,
    images: ['https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=600&auto=format&fit=crop'],
    is_active: true,
    materials: [
      { insumo_id: 'i1', quantity_used: 2 }, // Chakiras
      { insumo_id: 'i4', quantity_used: 10 } // Hilos recta
    ]
  },
  {
    id: 'prod3',
    name: 'Corset Negro',
    description: 'Corset entallado premium en color negro con listones y ojillos metálicos.',
    base_cost: 70,
    labor_hours: 18.0,
    labor_hourly_rate: 150,
    desired_margin: 22,
    price_cash: 3600,
    price_card: 3800,
    designer: 'Maripy',
    stock: 2,
    images: ['https://images.unsplash.com/photo-1618220179428-22790b461013?q=80&w=600&auto=format&fit=crop'],
    is_active: true,
    materials: [
      { insumo_id: 'i3', quantity_used: 10 }, // Ojillos
      { insumo_id: 'i8', quantity_used: 1.5 } // Listón 1"
    ]
  },
  {
    id: 'prod4',
    name: 'Espurucunchitos',
    description: 'Prenda fresca y ligera de la colección Tacuche.',
    base_cost: 70,
    labor_hours: 4.0,
    labor_hourly_rate: 150,
    desired_margin: 30,
    price_cash: 1200,
    price_card: 1300,
    designer: 'Maripy',
    stock: 12,
    images: ['https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=600&auto=format&fit=crop'],
    is_active: true,
    materials: [
      { insumo_id: 'i4', quantity_used: 20 }
    ]
  },
  {
    id: 'prod5',
    name: 'Top Vaca',
    description: 'Top corto con estampado temático de vaca y costuras visibles.',
    base_cost: 70,
    labor_hours: 4.0,
    labor_hourly_rate: 150,
    desired_margin: 30,
    price_cash: 1100,
    price_card: 1150,
    designer: 'Maripy',
    stock: 4,
    images: ['https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=600&auto=format&fit=crop'],
    is_active: true,
    materials: [
      { insumo_id: 'i4', quantity_used: 30 }
    ]
  },
  {
    id: 'prod6',
    name: 'Jines Pol',
    description: 'Pantalones estilizados en gabardina fina con bolsillos funcionales.',
    base_cost: 70,
    labor_hours: 6.0,
    labor_hourly_rate: 150,
    desired_margin: 30,
    price_cash: 2050,
    price_card: 2150,
    designer: 'Maripy',
    stock: 3,
    images: ['https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=600&auto=format&fit=crop'],
    is_active: true,
    materials: [
      { insumo_id: 'i12', quantity_used: 1 }, // Gabardina
      { insumo_id: 'i4', quantity_used: 30 }
    ]
  },
  {
    id: 'prod7',
    name: 'Top Mezclilla',
    description: 'Top confeccionado en mezclilla recuperada de alta durabilidad.',
    base_cost: 70,
    labor_hours: 4.0,
    labor_hourly_rate: 150,
    desired_margin: 30,
    price_cash: 1200,
    price_card: 1300,
    designer: 'Tani',
    stock: 8,
    images: ['https://images.unsplash.com/photo-1611312449412-6cefac5dc3e4?q=80&w=600&auto=format&fit=crop'],
    is_active: true,
    materials: [
      { insumo_id: 'i16', quantity_used: 0.2 },
      { insumo_id: 'i4', quantity_used: 4 }
    ]
  },
  {
    id: 'prod8',
    name: 'Hoodie Flores',
    description: 'Sudadera premium bordada a mano con flores de colores vivos.',
    base_cost: 70,
    labor_hours: 6.0,
    labor_hourly_rate: 150,
    desired_margin: 30,
    price_cash: 1800,
    price_card: 1900,
    designer: 'Maripy',
    stock: 6,
    images: ['https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=600&auto=format&fit=crop'],
    is_active: true,
    materials: [
      { insumo_id: 'i13', quantity_used: 0.4 },
      { insumo_id: 'i14', quantity_used: 0.2 }
    ]
  },
  {
    id: 'prod9',
    name: 'Top Negro Ojillos',
    description: 'Top minimalista con tiras ajustables y ojillos de metal.',
    base_cost: 70,
    labor_hours: 3.0,
    labor_hourly_rate: 150,
    desired_margin: 30,
    price_cash: 1000,
    price_card: 1050,
    designer: 'Tani',
    stock: 7,
    images: ['https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=600&auto=format&fit=crop'],
    is_active: true,
    materials: [
      { insumo_id: 'i2', quantity_used: 100 },
      { insumo_id: 'i4', quantity_used: 3 }
    ]
  },
  {
    id: 'prod10',
    name: 'Top Cebra Huipil',
    description: 'Fusión de estampado cebra con corte tipo huipil mexicano.',
    base_cost: 70,
    labor_hours: 8.0,
    labor_hourly_rate: 150,
    desired_margin: 30,
    price_cash: 2100,
    price_card: 2200,
    designer: 'Tani',
    stock: 4,
    images: ['https://images.unsplash.com/photo-1603252109303-2751441dd157?q=80&w=600&auto=format&fit=crop'],
    is_active: true,
    materials: [
      { insumo_id: 'i18', quantity_used: 0.5 },
      { insumo_id: 'i17', quantity_used: 0.5 }
    ]
  },
  {
    id: 'prod11',
    name: 'Corset Mau',
    description: 'Corset estructurado color lavanda con listones cruzados.',
    base_cost: 70,
    labor_hours: 7.0,
    labor_hourly_rate: 150,
    desired_margin: 30,
    price_cash: 1900,
    price_card: 2000,
    designer: 'Tani',
    stock: 2,
    images: ['https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=600&auto=format&fit=crop'],
    is_active: true,
    materials: [
      { insumo_id: 'i17', quantity_used: 0.8 },
      { insumo_id: 'i3', quantity_used: 80 }
    ]
  },
  {
    id: 'prod12',
    name: 'Falda Floricienta',
    description: 'Falda floreada asimétrica con vuelo de lino y olanes.',
    base_cost: 68,
    labor_hours: 9.0,
    labor_hourly_rate: 150,
    desired_margin: 30,
    price_cash: 2300,
    price_card: 2400,
    designer: 'Tani',
    stock: 3,
    images: ['https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=600&auto=format&fit=crop'],
    is_active: true,
    materials: [
      { insumo_id: 'i19', quantity_used: 0.3 },
      { insumo_id: 'i20', quantity_used: 0.25 }
    ]
  },
  {
    id: 'prod13',
    name: 'Pantalón Lino Azul',
    description: 'Pantalón cómodo y fresco confeccionado en lino azul cielo.',
    base_cost: 70,
    labor_hours: 6.5,
    labor_hourly_rate: 150,
    desired_margin: 30,
    price_cash: 1800,
    price_card: 1900,
    designer: 'Tani',
    stock: 5,
    images: ['https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=600&auto=format&fit=crop'],
    is_active: true,
    materials: [
      { insumo_id: 'i11', quantity_used: 0.25 }
    ]
  },
  {
    id: 'prod14',
    name: 'Pantalón Lino Negro',
    description: 'Pantalón clásico de lino negro con cordones de ajuste.',
    base_cost: 70,
    labor_hours: 10.0,
    labor_hourly_rate: 150,
    desired_margin: 30,
    price_cash: 2700,
    price_card: 2850,
    designer: 'Tani',
    stock: 4,
    images: ['https://images.unsplash.com/photo-1506152983158-b4a74a01c721?q=80&w=600&auto=format&fit=crop'],
    is_active: true,
    materials: [
      { insumo_id: 'i21', quantity_used: 1 }
    ]
  },
  {
    id: 'prod15',
    name: 'Bolsa Hippie',
    description: 'Bolso tejido a mano estilo bohemio con forro interno.',
    base_cost: 70,
    labor_hours: 7.5,
    labor_hourly_rate: 150,
    desired_margin: 30,
    price_cash: 2100,
    price_card: 2200,
    designer: 'Tani',
    stock: 9,
    images: ['https://images.unsplash.com/photo-1529458083742-20c24233ccab?q=80&w=600&auto=format&fit=crop'],
    is_active: true,
    materials: [
      { insumo_id: 'i22', quantity_used: 2 }
    ]
  },
  {
    id: 'prod16',
    name: 'Jeans Pompas',
    description: 'Jeans de mezclilla con ajuste y moldura trasera premium.',
    base_cost: 70,
    labor_hours: 10.0,
    labor_hourly_rate: 150,
    desired_margin: 30,
    price_cash: 2650,
    price_card: 2800,
    designer: 'Maripy',
    stock: 3,
    images: ['https://images.unsplash.com/photo-1542272604-787c3835535d?q=80&w=600&auto=format&fit=crop'],
    is_active: true,
    materials: [
      { insumo_id: 'i16', quantity_used: 1.7 }
    ]
  },
  {
    id: 'prod17',
    name: 'Tshirt Foto',
    description: 'Playera de algodón de alta calidad con estampado fotográfico y estambres.',
    base_cost: 70,
    labor_hours: 6.0,
    labor_hourly_rate: 150,
    desired_margin: 30,
    price_cash: 2200,
    price_card: 2300,
    designer: 'Tani',
    stock: 15,
    images: ['https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=600&auto=format&fit=crop'],
    is_active: true,
    materials: [
      { insumo_id: 'i23', quantity_used: 1 }
    ]
  },
  {
    id: 'prod18',
    name: 'Hoodie Boca',
    description: 'Sudadera premium en color block con labios bordados.',
    base_cost: 70,
    labor_hours: 5.0,
    labor_hourly_rate: 150,
    desired_margin: 30,
    price_cash: 1500,
    price_card: 1600,
    designer: 'Maripy',
    stock: 8,
    images: ['https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=600&auto=format&fit=crop'],
    is_active: true,
    materials: [
      { insumo_id: 'i17', quantity_used: 0.6 }
    ]
  },
  {
    id: 'prod19',
    name: 'Falda Blanca Lino',
    description: 'Falda fresca en color blanco de lino con encajes decorativos.',
    base_cost: 70,
    labor_hours: 6.0,
    labor_hourly_rate: 150,
    desired_margin: 30,
    price_cash: 1700,
    price_card: 1800,
    designer: 'Tani',
    stock: 5,
    images: ['https://images.unsplash.com/photo-1583496661160-fb488b2c1a82?q=80&w=600&auto=format&fit=crop'],
    is_active: true,
    materials: [
      { insumo_id: 'i24', quantity_used: 0.8 },
      { insumo_id: 'i25', quantity_used: 0.8 }
    ]
  }
];

// Default Expenses
const defaultExpenses: Expense[] = [
  { id: 'e1', date: '2026-03-19', concept: 'Impresiones', place: 'Office Depot', amount: 770.00, paid_by: 'Tani' },
  { id: 'e2', date: '2026-04-28', concept: 'Venado', place: 'Centro', amount: 1090.00, paid_by: 'Tani' },
  { id: 'e3', date: '2026-04-28', concept: 'La imperial', place: 'Centro', amount: 39.80, paid_by: 'Maripy' },
  { id: 'e4', date: '2026-04-28', concept: 'Chaquiras', place: 'Centro', amount: 265.00, paid_by: 'Tani' },
  { id: 'e5', date: '2026-04-28', concept: 'Nuevo Mundo', place: 'Centro', amount: 200.00, paid_by: 'Tani' },
  { id: 'e6', date: '2026-04-28', concept: 'Mercería', place: 'Centro', amount: 215.00, paid_by: 'Maripy' },
  { id: 'e7', date: '2026-04-28', concept: 'Copacabana', place: 'Centro', amount: 93.00, paid_by: 'Tani' },
  { id: 'e8', date: '2026-04-28', concept: 'Ganon', place: 'Centro', amount: 1260.00, paid_by: 'Maripy' },
  { id: 'e9', date: '2026-05-12', concept: 'junco', place: 'junco', amount: 950.00, paid_by: 'Tani' },
  { id: 'e10', date: '2026-05-20', concept: 'Anticipo bazar', place: 'Casa Bazar', amount: 1150.00, paid_by: 'Tani' },
  { id: 'e11', date: '2026-05-25', concept: 'Registro IMPI', place: 'IMPI', amount: 2813.77, paid_by: 'Maripy' },
  { id: 'e12', date: '2026-05-30', concept: 'Liq. Bazar', place: 'Casa Bazar', amount: 1150.00, paid_by: 'Tani' },
  { id: 'e13', date: '2026-06-05', concept: 'Cambio bazar', place: 'Bazar', amount: 1500.00, paid_by: 'Tani' },
  { id: 'e14', date: '2026-06-06', concept: 'Cambio bazar', place: 'Bazar', amount: 1500.00, paid_by: 'Tani' },
  { id: 'e15', date: '2026-06-10', concept: 'Ganchos', place: 'Costco', amount: 399.00, paid_by: 'Tani' },
];

// Default Revenues (Ventas mock)
const defaultRevenues: Revenue[] = [
  { id: 'r1', date: '2026-06-15', product_id: 'prod1', quantity: 2, total_amount: 3200, profit: 1006, payment_method: 'Cash', recorded_by: 'Tani', notes: 'Vendido en bazar' },
  { id: 'r2', date: '2026-06-18', product_id: 'prod2', quantity: 1, total_amount: 1700, profit: 518, payment_method: 'Card', recorded_by: 'Maripy', notes: 'Cliente instagram' },
  { id: 'r3', date: '2026-06-25', product_id: 'prod3', quantity: 1, total_amount: 3600, profit: 751, payment_method: 'Cash', recorded_by: 'Maripy', notes: 'Venta directa' }
];

// Default Calendar Events
const defaultEvents: CalendarEvent[] = [
  { id: 'ev1', title: 'Sesión de Fotos Otoño', description: 'Sesión de fotos con las nuevas prendas de lino en exteriores.', date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], category: 'Photo Shoot', status: 'Pending' },
  { id: 'ev2', title: 'Bazar Roma', description: 'Venta y exhibición en el bazar de la Roma, llevar stock de hoodies.', date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], category: 'Bazar', status: 'Pending' },
  { id: 'ev3', title: 'Prueba de Tallas - Cliente Especial', description: 'Ajuste final del corset negro a medida.', date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], category: 'Fitting', status: 'Pending' },
  { id: 'ev4', title: 'Lanzamiento de Colección Cápsula', description: 'Publicar las prendas de mezclilla reciclada en la tienda en línea.', date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], category: 'Launch', status: 'Completed' }
];

// Default Store Settings
const defaultSettings: StoreSettings = {
  id: 'main',
  whatsapp_number: '525500000000',
  store_title: 'Colección de Autor',
  store_subtitle: 'Prendas exclusivas confeccionadas a mano. Cada pieza es única y diseñada con pasión por nuestro estudio. Cotiza tu pedido y finaliza por WhatsApp.',
  instagram_url: 'https://instagram.com/tacuche.estudio',
  hero_banner_url: ''
};

// Helper to initialize localStorage if empty
const initLocalStorage = () => {
  if (!localStorage.getItem('tacuche_insumos')) {
    localStorage.setItem('tacuche_insumos', JSON.stringify(defaultInsumos));
  }
  if (!localStorage.getItem('tacuche_packaging')) {
    localStorage.setItem('tacuche_packaging', JSON.stringify(defaultPackaging));
  }
  if (!localStorage.getItem('tacuche_products')) {
    localStorage.setItem('tacuche_products', JSON.stringify(defaultProducts));
  }
  if (!localStorage.getItem('tacuche_expenses')) {
    localStorage.setItem('tacuche_expenses', JSON.stringify(defaultExpenses));
  }
  if (!localStorage.getItem('tacuche_revenues')) {
    localStorage.setItem('tacuche_revenues', JSON.stringify(defaultRevenues));
  }
  if (!localStorage.getItem('tacuche_events')) {
    localStorage.setItem('tacuche_events', JSON.stringify(defaultEvents));
  }
  if (!localStorage.getItem('tacuche_settings')) {
    localStorage.setItem('tacuche_settings', JSON.stringify(defaultSettings));
  }
};

initLocalStorage();

// Local Storage CRUD functions
export const mockDb = {
  insumos: {
    getAll: (): Insumo[] => {
      initLocalStorage();
      return JSON.parse(localStorage.getItem('tacuche_insumos') || '[]');
    },
    save: (item: Insumo) => {
      const items = mockDb.insumos.getAll();
      const existingIdx = items.findIndex(i => i.id === item.id);
      const unit_price = item.price / (item.quantity_per_unit || 1);
      const newItem = { ...item, unit_price };
      if (existingIdx > -1) {
        items[existingIdx] = newItem;
      } else {
        newItem.id = newItem.id || Math.random().toString(36).substr(2, 9);
        items.push(newItem);
      }
      localStorage.setItem('tacuche_insumos', JSON.stringify(items));
      return newItem;
    },
    delete: (id: string) => {
      const items = mockDb.insumos.getAll().filter(i => i.id !== id);
      localStorage.setItem('tacuche_insumos', JSON.stringify(items));
    }
  },
  
  packaging: {
    getAll: (): PackagingComponent[] => {
      initLocalStorage();
      return JSON.parse(localStorage.getItem('tacuche_packaging') || '[]');
    },
    save: (item: PackagingComponent) => {
      const items = mockDb.packaging.getAll();
      const existingIdx = items.findIndex(i => i.id === item.id);
      const cost_per_unit = (item.price * item.units_required) / (item.capacity_max || 1);
      const newItem = { ...item, cost_per_unit };
      if (existingIdx > -1) {
        items[existingIdx] = newItem;
      } else {
        newItem.id = newItem.id || Math.random().toString(36).substr(2, 9);
        items.push(newItem);
      }
      localStorage.setItem('tacuche_packaging', JSON.stringify(items));
      return newItem;
    },
    delete: (id: string) => {
      const items = mockDb.packaging.getAll().filter(i => i.id !== id);
      localStorage.setItem('tacuche_packaging', JSON.stringify(items));
    }
  },

  products: {
    getAll: (): Product[] => {
      initLocalStorage();
      return JSON.parse(localStorage.getItem('tacuche_products') || '[]');
    },
    save: (item: Product) => {
      const items = mockDb.products.getAll();
      const existingIdx = items.findIndex(i => i.id === item.id);
      const newItem = { ...item };
      if (existingIdx > -1) {
        items[existingIdx] = newItem;
      } else {
        newItem.id = newItem.id || Math.random().toString(36).substr(2, 9);
        items.push(newItem);
      }
      localStorage.setItem('tacuche_products', JSON.stringify(items));
      return newItem;
    },
    delete: (id: string) => {
      const items = mockDb.products.getAll().filter(i => i.id !== id);
      localStorage.setItem('tacuche_products', JSON.stringify(items));
    }
  },

  expenses: {
    getAll: (): Expense[] => {
      initLocalStorage();
      return JSON.parse(localStorage.getItem('tacuche_expenses') || '[]');
    },
    save: (item: Expense) => {
      const items = mockDb.expenses.getAll();
      const existingIdx = items.findIndex(i => i.id === item.id);
      const newItem = { ...item };
      if (existingIdx > -1) {
        items[existingIdx] = newItem;
      } else {
        newItem.id = newItem.id || Math.random().toString(36).substr(2, 9);
        items.push(newItem);
      }
      localStorage.setItem('tacuche_expenses', JSON.stringify(items));
      return newItem;
    },
    delete: (id: string) => {
      const items = mockDb.expenses.getAll().filter(i => i.id !== id);
      localStorage.setItem('tacuche_expenses', JSON.stringify(items));
    }
  },

  revenues: {
    getAll: (): Revenue[] => {
      initLocalStorage();
      return JSON.parse(localStorage.getItem('tacuche_revenues') || '[]');
    },
    save: (item: Revenue) => {
      const items = mockDb.revenues.getAll();
      const existingIdx = items.findIndex(i => i.id === item.id);
      const newItem = { ...item };
      if (existingIdx > -1) {
        items[existingIdx] = newItem;
      } else {
        newItem.id = newItem.id || Math.random().toString(36).substr(2, 9);
        items.push(newItem);
      }
      localStorage.setItem('tacuche_revenues', JSON.stringify(items));
      return newItem;
    },
    delete: (id: string) => {
      const items = mockDb.revenues.getAll().filter(i => i.id !== id);
      localStorage.setItem('tacuche_revenues', JSON.stringify(items));
    }
  },

  events: {
    getAll: (): CalendarEvent[] => {
      initLocalStorage();
      return JSON.parse(localStorage.getItem('tacuche_events') || '[]');
    },
    save: (item: CalendarEvent) => {
      const items = mockDb.events.getAll();
      const existingIdx = items.findIndex(i => i.id === item.id);
      const newItem = { ...item };
      if (existingIdx > -1) {
        items[existingIdx] = newItem;
      } else {
        newItem.id = newItem.id || Math.random().toString(36).substr(2, 9);
        items.push(newItem);
      }
      localStorage.setItem('tacuche_events', JSON.stringify(items));
      return newItem;
    },
    delete: (id: string) => {
      const items = mockDb.events.getAll().filter(i => i.id !== id);
      localStorage.setItem('tacuche_events', JSON.stringify(items));
    }
  },

  settings: {
    get: (): StoreSettings => {
      initLocalStorage();
      return JSON.parse(localStorage.getItem('tacuche_settings') || '{}');
    },
    save: (item: StoreSettings): StoreSettings => {
      localStorage.setItem('tacuche_settings', JSON.stringify(item));
      return item;
    }
  }
};
