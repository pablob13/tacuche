import { supabase, isSupabaseConfigured } from './supabase';
import { mockDb } from './mockData';
import type { Insumo, PackagingComponent, Product, Expense, Revenue, CalendarEvent, StoreSettings } from '../types';

export const isUsingMock = !isSupabaseConfigured;

// Helper to safely execute Supabase query or fallback to mock
const execute = async <T>(
  supabaseAction: () => Promise<{ data: T | null; error: any }>,
  mockFallback: () => T
): Promise<T> => {
  if (isUsingMock) {
    return mockFallback();
  }
  try {
    const { data, error } = await supabaseAction();
    if (error) {
      console.warn("Supabase error, falling back to local storage:", error);
      return mockFallback();
    }
    return data as T;
  } catch (err) {
    console.error("Connection failed, falling back to local storage:", err);
    return mockFallback();
  }
};

export const db = {
  insumos: {
    getAll: async (): Promise<Insumo[]> => {
      return execute(
        async () => await supabase.from('insumos').select('*').order('name'),
        () => mockDb.insumos.getAll()
      );
    },
    save: async (item: Insumo): Promise<Insumo> => {
      if (isUsingMock) return mockDb.insumos.save(item);
      const { data, error } = await supabase
        .from('insumos')
        .upsert(item)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    delete: async (id: string): Promise<void> => {
      if (isUsingMock) return mockDb.insumos.delete(id);
      const { error } = await supabase.from('insumos').delete().eq('id', id);
      if (error) throw error;
    }
  },

  packaging: {
    getAll: async (): Promise<PackagingComponent[]> => {
      return execute(
        async () => await supabase.from('packaging_components').select('*').order('created_at'),
        () => mockDb.packaging.getAll()
      );
    },
    save: async (item: PackagingComponent): Promise<PackagingComponent> => {
      if (isUsingMock) return mockDb.packaging.save(item);
      const { data, error } = await supabase
        .from('packaging_components')
        .upsert(item)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    delete: async (id: string): Promise<void> => {
      if (isUsingMock) return mockDb.packaging.delete(id);
      const { error } = await supabase.from('packaging_components').delete().eq('id', id);
      if (error) throw error;
    }
  },

  products: {
    getAll: async (): Promise<Product[]> => {
      if (isUsingMock) return mockDb.products.getAll();
      try {
        // Hydrate product and materials
        const { data: prods, error: errProds } = await supabase
          .from('products')
          .select('*')
          .order('name');
        if (errProds) throw errProds;

        const { data: matJunctions, error: errMats } = await supabase
          .from('product_insumos')
          .select('*, insumos(name, unit, price, quantity_per_unit, unit_price)');
        if (errMats) throw errMats;

        // Map and join
        return (prods || []).map(p => {
          const mats = (matJunctions || [])
            .filter(m => m.product_id === p.id)
            .map(m => ({
              id: m.id,
              insumo_id: m.insumo_id,
              name: m.insumos?.name || 'Insumo desconocido',
              unit: m.insumos?.unit || '',
              unit_price: m.insumos?.unit_price || 0,
              quantity_used: Number(m.quantity_used)
            }));
          return { ...p, materials: mats };
        });
      } catch (err) {
        console.warn("Error loading products, fallback to mock:", err);
        return mockDb.products.getAll();
      }
    },
    save: async (item: Product): Promise<Product> => {
      if (isUsingMock) return mockDb.products.save(item);
      
      const { materials, ...productData } = item;
      
      // Save product
      const { data: savedProd, error: errProd } = await supabase
        .from('products')
        .upsert(productData)
        .select()
        .single();
      
      if (errProd) throw errProd;

      // Delete existing materials relations
      const { error: errDel } = await supabase
        .from('product_insumos')
        .delete()
        .eq('product_id', savedProd.id);
      if (errDel) throw errDel;

      // Insert new materials
      if (materials && materials.length > 0) {
        const materialInserts = materials.map(m => ({
          product_id: savedProd.id,
          insumo_id: m.insumo_id,
          quantity_used: m.quantity_used
        }));
        const { error: errIns } = await supabase
          .from('product_insumos')
          .insert(materialInserts);
        if (errIns) throw errIns;
      }

      return { ...savedProd, materials };
    },
    delete: async (id: string): Promise<void> => {
      if (isUsingMock) return mockDb.products.delete(id);
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) throw error;
    }
  },

  expenses: {
    getAll: async (): Promise<Expense[]> => {
      return execute(
        async () => await supabase.from('expenses').select('*').order('date', { ascending: false }),
        () => mockDb.expenses.getAll()
      );
    },
    save: async (item: Expense): Promise<Expense> => {
      if (isUsingMock) return mockDb.expenses.save(item);
      const { data, error } = await supabase
        .from('expenses')
        .upsert(item)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    delete: async (id: string): Promise<void> => {
      if (isUsingMock) return mockDb.expenses.delete(id);
      const { error } = await supabase.from('expenses').delete().eq('id', id);
      if (error) throw error;
    }
  },

  revenues: {
    getAll: async (): Promise<Revenue[]> => {
      if (isUsingMock) return mockDb.revenues.getAll();
      try {
        const { data, error } = await supabase
          .from('revenues')
          .select('*, products(name)')
          .order('date', { ascending: false });
        if (error) throw error;
        return (data || []).map(r => ({
          ...r,
          product_name: r.products?.name || 'Venta Manual / Bazar'
        }));
      } catch (err) {
        console.warn("Revenues fetch error, using mock:", err);
        return mockDb.revenues.getAll();
      }
    },
    save: async (item: Revenue): Promise<Revenue> => {
      if (isUsingMock) return mockDb.revenues.save(item);
      const { data, error } = await supabase
        .from('revenues')
        .upsert(item)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    delete: async (id: string): Promise<void> => {
      if (isUsingMock) return mockDb.revenues.delete(id);
      const { error } = await supabase.from('revenues').delete().eq('id', id);
      if (error) throw error;
    }
  },

  events: {
    getAll: async (): Promise<CalendarEvent[]> => {
      return execute(
        async () => await supabase.from('events').select('*').order('date'),
        () => mockDb.events.getAll()
      );
    },
    save: async (item: CalendarEvent): Promise<CalendarEvent> => {
      if (isUsingMock) return mockDb.events.save(item);
      const { data, error } = await supabase
        .from('events')
        .upsert(item)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    delete: async (id: string): Promise<void> => {
      if (isUsingMock) return mockDb.events.delete(id);
      const { error } = await supabase.from('events').delete().eq('id', id);
      if (error) throw error;
    }
  },

  settings: {
    get: async (): Promise<StoreSettings> => {
      if (isUsingMock) return mockDb.settings.get();
      try {
        const { data, error } = await supabase
          .from('store_settings')
          .select('*')
          .eq('id', 'main')
          .maybeSingle();
        if (error) throw error;
        return data || mockDb.settings.get();
      } catch (err) {
        console.warn("Error getting settings, fallback to local storage:", err);
        return mockDb.settings.get();
      }
    },
    save: async (item: StoreSettings): Promise<StoreSettings> => {
      if (isUsingMock) return mockDb.settings.save(item);
      const { data, error } = await supabase
        .from('store_settings')
        .upsert({ ...item, id: 'main' })
        .select()
        .single();
      if (error) throw error;
      return data;
    }
  }
};
