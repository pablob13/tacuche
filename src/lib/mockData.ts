import type { Insumo, PackagingComponent, Product, Expense, Revenue } from '../types';

// Default Insumos
const defaultInsumos: Insumo[] = [
  { id: 'i1', name: 'Chakiras', unit: 'gramos', quantity_per_unit: 500, price: 75, store: 'Mercería' },
  { id: 'i2', name: 'Ojillos OK145N', unit: 'millar', quantity_per_unit: 1000, price: 189.53, store: 'Ganon' },
  { id: 'i3', name: 'Ojillos OL3NE', unit: 'millar', quantity_per_unit: 1000, price: 300.00, store: 'Ganon' },
  { id: 'i4', name: 'Hilos Recta', unit: 'metros', quantity_per_unit: 1000, price: 218.00, store: 'Centro' },
  { id: 'i5', name: 'Hilos Over', unit: 'metros', quantity_per_unit: 1600, price: 62.00, store: 'Nuevo Mundo' },
  { id: 'i6', name: 'Chakirón', unit: 'gramos', quantity_per_unit: 500, price: 75, store: 'Mercería' },
  { id: 'i7', name: 'Tinte Mariposa', unit: 'paquete', quantity_per_unit: 1, price: 28.75, store: 'Farmacia' },
  { id: 'i8', name: 'Listón 1"', unit: 'metros', quantity_per_unit: 50, price: 90.00, store: 'Fantasías Miguel' },
  { id: 'i9', name: 'Listón 1 1/2"', unit: 'metros', quantity_per_unit: 50, price: 160.00, store: 'Fantasías Miguel' },
].map(item => ({
  ...item,
  unit_price: item.price / item.quantity_per_unit
}));

// Default Packaging Components
const defaultPackaging: PackagingComponent[] = [
  { id: 'p1', name: 'Bolsa de manta (manta)', price: 100.00, unit: 'Metro', units_required: 1.0, capacity_max: 7.5 },
  { id: 'p2', name: 'Bolsa de manta (hilo)', price: 218.00, unit: 'Carrete 1000m', units_required: 4.0, capacity_max: 1000 },
  { id: 'p3', name: 'Bolsa de manta (ojillos)', price: 300.00, unit: 'Millar', units_required: 2.0, capacity_max: 1000 },
  { id: 'p4', name: 'Bolsa de manta (listón)', price: 75.00, unit: 'Metros', units_required: 1.5, capacity_max: 50 },
  { id: 'p5', name: 'Bolsa de manta (mano de obra)', price: 150.00, unit: 'Hora', units_required: 0.17, capacity_max: 1 },
].map(item => ({
  ...item,
  cost_per_unit: (item.price * item.units_required) / item.capacity_max
}));

// Default Products (Prendas)
const defaultProducts: Product[] = [
  {
    id: 'prod1',
    name: 'Suéter Negro',
    description: 'Suéter tejido artesanal en color negro con detalles de ojillos.',
    base_cost: 70,
    labor_hours: 6,
    labor_hourly_rate: 150,
    desired_margin: 33,
    price_cash: 1600,
    price_card: 1700,
    designer: 'Tani',
    stock: 10,
    images: ['https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=600&auto=format&fit=crop'],
    is_active: true,
    materials: [
      { insumo_id: 'i4', quantity_used: 10 },
      { insumo_id: 'i2', quantity_used: 6 }
    ]
  },
  {
    id: 'prod2',
    name: 'Falda Militar',
    description: 'Falda con diseño estructurado estilo militar, resistente y moderna.',
    base_cost: 70,
    labor_hours: 8,
    labor_hourly_rate: 150,
    desired_margin: 33,
    price_cash: 1600,
    price_card: 1700,
    designer: 'Maripy',
    stock: 5,
    images: ['https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=600&auto=format&fit=crop'],
    is_active: true,
    materials: [
      { insumo_id: 'i4', quantity_used: 8 },
      { insumo_id: 'i1', quantity_used: 20 }
    ]
  },
  {
    id: 'prod3',
    name: 'Corset Negro',
    description: 'Corset premium entallado negro con listones y herrajes.',
    base_cost: 100,
    labor_hours: 15,
    labor_hourly_rate: 150,
    desired_margin: 35,
    price_cash: 3600,
    price_card: 3800,
    designer: 'Maripy',
    stock: 2,
    images: ['https://images.unsplash.com/photo-1618220179428-22790b461013?q=80&w=600&auto=format&fit=crop'],
    is_active: true,
    materials: [
      { insumo_id: 'i3', quantity_used: 12 },
      { insumo_id: 'i8', quantity_used: 3 }
    ]
  },
  {
    id: 'prod4',
    name: 'Espurucunchitos',
    description: 'Prenda ligera de la colección Tacuche.',
    base_cost: 60,
    labor_hours: 4.5,
    labor_hourly_rate: 150,
    desired_margin: 33,
    price_cash: 1200,
    price_card: 1300,
    designer: 'Maripy',
    stock: 12,
    images: ['https://images.unsplash.com/photo-1434389677669-e08b4cac3105?q=80&w=600&auto=format&fit=crop'],
    is_active: true,
    materials: []
  },
  {
    id: 'prod5',
    name: 'Top Vaca',
    description: 'Top corto con estampado de vaca y acabados artesanales.',
    base_cost: 50,
    labor_hours: 4,
    labor_hourly_rate: 150,
    desired_margin: 33,
    price_cash: 1100,
    price_card: 1150,
    designer: 'Maripy',
    stock: 4,
    images: ['https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=600&auto=format&fit=crop'],
    is_active: true,
    materials: []
  },
  {
    id: 'prod6',
    name: 'Jines Pol',
    description: 'Pantalones premium estilizados con costuras decorativas.',
    base_cost: 90,
    labor_hours: 10,
    labor_hourly_rate: 150,
    desired_margin: 33,
    price_cash: 2050,
    price_card: 2150,
    designer: 'Maripy',
    stock: 3,
    images: ['https://images.unsplash.com/photo-1542272604-787c3835535d?q=80&w=600&auto=format&fit=crop'],
    is_active: true,
    materials: []
  },
  {
    id: 'prod7',
    name: 'Top Mezclilla',
    description: 'Top artesanal en mezclilla reciclada de alta calidad.',
    base_cost: 60,
    labor_hours: 5,
    labor_hourly_rate: 150,
    desired_margin: 33,
    price_cash: 1200,
    price_card: 1300,
    designer: 'Tani',
    stock: 8,
    images: ['https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=600&auto=format&fit=crop'],
    is_active: true,
    materials: []
  },
  {
    id: 'prod8',
    name: 'Hoodie Flores',
    description: 'Sudadera premium bordada a mano con motivos florales.',
    base_cost: 80,
    labor_hours: 7,
    labor_hourly_rate: 150,
    desired_margin: 33,
    price_cash: 1800,
    price_card: 1900,
    designer: 'Maripy',
    stock: 6,
    images: ['https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=600&auto=format&fit=crop'],
    is_active: true,
    materials: []
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
  { id: 'r1', date: '2026-06-15', product_id: 'prod1', quantity: 2, total_amount: 3200, profit: 1200, payment_method: 'Cash', recorded_by: 'Tani', notes: 'Vendido en bazar' },
  { id: 'r2', date: '2026-06-18', product_id: 'prod2', quantity: 1, total_amount: 1700, profit: 450, payment_method: 'Card', recorded_by: 'Maripy', notes: 'Cliente instagram' },
  { id: 'r3', date: '2026-06-25', product_id: 'prod3', quantity: 1, total_amount: 3600, profit: 1100, payment_method: 'Cash', recorded_by: 'Maripy', notes: 'Venta directa' },
  { id: 'r4', date: '2026-07-02', product_id: 'prod7', quantity: 1, total_amount: 1200, profit: 400, payment_method: 'Cash', recorded_by: 'Tani' },
  { id: 'r5', date: '2026-07-05', product_id: 'prod5', quantity: 1, total_amount: 1150, profit: 450, payment_method: 'Card', recorded_by: 'Maripy' }
];

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
  }
};
