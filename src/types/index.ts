export interface Insumo {
  id: string;
  name: string;
  unit: string;
  quantity_per_unit: number;
  price: number;
  unit_price?: number; // Calculated dynamically: price / quantity_per_unit
  store?: string;
  created_at?: string;
}

export interface PackagingComponent {
  id: string;
  name: string;
  price: number;
  unit: string;
  units_required: number;
  capacity_max: number;
  cost_per_unit?: number; // Calculated dynamically: (price * units_required) / capacity_max
  created_at?: string;
}

export interface ProductMaterial {
  id?: string;
  insumo_id: string;
  name?: string; // hydrated from Insumo
  unit?: string; // hydrated from Insumo
  unit_price?: number; // hydrated from Insumo
  quantity_used: number;
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  base_cost: number;
  labor_hours: number;
  labor_hourly_rate: number;
  packaging_cost_override?: number | null;
  desired_margin: number;
  price_cash?: number;
  price_card?: number;
  designer: string;
  stock: number;
  images: string[];
  is_active: boolean;
  sizes?: string[];
  category?: string;
  stock_by_size?: Record<string, number>;
  materials?: ProductMaterial[];
  created_at?: string;
}

export interface Expense {
  id: string;
  date: string;
  concept: string;
  place?: string;
  amount: number;
  paid_by: string; // Tani, Maripy, Shared
  created_at?: string;
}

export interface Revenue {
  id: string;
  date: string;
  product_id?: string | null;
  product_name?: string; // hydrated from Product
  quantity: number;
  total_amount: number;
  profit: number;
  payment_method: string; // Cash, Card, Transfer
  recorded_by: string; // Tani, Maripy
  notes?: string;
  created_at?: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  date: string; // YYYY-MM-DD
  category: 'Production' | 'Bazar' | 'Fitting' | 'Photo Shoot' | 'Launch' | 'Other';
  status: 'Pending' | 'Completed';
  created_at?: string;
}

export interface StoreSettings {
  id: string;
  whatsapp_number: string;
  store_title: string;
  store_subtitle: string;
  instagram_url?: string;
  hero_banner_url?: string;
  category_corsets_url?: string;
  category_sueteres_url?: string;
  category_pantalones_url?: string;
  category_faldas_url?: string;
  created_at?: string;
}

export interface Shipping {
  id: string;
  customer_name: string;
  address: string;
  city: string;
  postal_code: string;
  tracking_number?: string;
  courier?: string; // DHL, FedEx, Estafeta, etc.
  status: 'Pending' | 'Shipped' | 'Delivered';
  shipping_cost: number;
  notes?: string;
  created_at?: string;
}
