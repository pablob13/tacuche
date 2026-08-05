import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { db, isUsingMock } from '../lib/db';
import type { Insumo, PackagingComponent, Product, Expense, Revenue, ProductMaterial, CalendarEvent } from '../types';
import {
  LayoutDashboard,
  Calculator,
  Shirt,
  Package,
  Box,
  TrendingDown,
  Coins,
  Calendar,
  LogOut,
  Trash2,
  Edit,
  Save,
  DollarSign,
  Info,
  AlertTriangle
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell
} from 'recharts';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [currentTab, setCurrentTab] = useState<'overview' | 'cotizador' | 'inventory' | 'insumos' | 'packaging' | 'expenses' | 'revenues' | 'calendar'>('overview');
  
  // Data States
  const [insumos, setInsumos] = useState<Insumo[]>([]);
  const [packaging, setPackaging] = useState<PackagingComponent[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [revenues, setRevenues] = useState<Revenue[]>([]);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);

  // Auth check
  useEffect(() => {
    const isLogged = sessionStorage.getItem('tacuche_admin_logged') === 'true';
    if (isSupabaseConfigured) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (!session && !isLogged) {
          navigate('/admin/login');
        }
      });
    } else if (!isLogged) {
      navigate('/admin/login');
    }
  }, [navigate]);

  // Load all data
  const loadData = async () => {
    setLoading(true);
    try {
      const [ins, pack, prod, exp, rev, evs] = await Promise.all([
        db.insumos.getAll(),
        db.packaging.getAll(),
        db.products.getAll(),
        db.expenses.getAll(),
        db.revenues.getAll(),
        db.events.getAll()
      ]);
      setInsumos(ins);
      setPackaging(pack);
      setProducts(prod);
      setExpenses(exp);
      setRevenues(rev);
      setEvents(evs);
    } catch (err) {
      console.error("Error loading admin data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleLogout = async () => {
    sessionStorage.removeItem('tacuche_admin_logged');
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    }
    navigate('/admin/login');
  };

  // Helper: Get standard packaging cost sum
  const getStandardPackagingCost = () => {
    return packaging.reduce((sum, item) => sum + (item.cost_per_unit || 0), 0);
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--bg-primary)' }}>
      {/* Sidebar */}
      <aside style={{
        width: '260px',
        backgroundColor: 'var(--bg-secondary)',
        borderRight: '1px solid var(--border-color)',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '32px'
      }}>
        <div>
          <img src="/logo-black.png" alt="TACUCHE" style={{ height: '36px', objectFit: 'contain', marginBottom: '12px', display: 'block' }} />
          <span style={{ fontSize: '11px', color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '1.5px', display: 'block' }}>
            Panel de Control
          </span>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
          <button
            onClick={() => setCurrentTab('overview')}
            className={`btn ${currentTab === 'overview' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ justifyContent: 'flex-start', border: 'none', width: '100%' }}
          >
            <LayoutDashboard size={18} />
            Resumen Financiero
          </button>

          <button
            onClick={() => setCurrentTab('cotizador')}
            className={`btn ${currentTab === 'cotizador' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ justifyContent: 'flex-start', border: 'none', width: '100%' }}
          >
            <Calculator size={18} />
            Cotizador / Precios
          </button>

          <button
            onClick={() => setCurrentTab('inventory')}
            className={`btn ${currentTab === 'inventory' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ justifyContent: 'flex-start', border: 'none', width: '100%' }}
          >
            <Shirt size={18} />
            Prendas / Inventario
          </button>

          <button
            onClick={() => setCurrentTab('insumos')}
            className={`btn ${currentTab === 'insumos' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ justifyContent: 'flex-start', border: 'none', width: '100%' }}
          >
            <Box size={18} />
            Insumos / Materias
          </button>

          <button
            onClick={() => setCurrentTab('packaging')}
            className={`btn ${currentTab === 'packaging' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ justifyContent: 'flex-start', border: 'none', width: '100%' }}
          >
            <Package size={18} />
            Empaque / Packaging
          </button>

          <button
            onClick={() => setCurrentTab('expenses')}
            className={`btn ${currentTab === 'expenses' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ justifyContent: 'flex-start', border: 'none', width: '100%' }}
          >
            <TrendingDown size={18} />
            Gastos Operativos
          </button>

          <button
            onClick={() => setCurrentTab('revenues')}
            className={`btn ${currentTab === 'revenues' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ justifyContent: 'flex-start', border: 'none', width: '100%' }}
          >
            <Coins size={18} />
            Ingresos / Ventas
          </button>

          <button
            onClick={() => setCurrentTab('calendar')}
            className={`btn ${currentTab === 'calendar' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ justifyContent: 'flex-start', border: 'none', width: '100%' }}
          >
            <Calendar size={18} />
            Calendario
          </button>
        </nav>

        <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '20px' }}>
          <button
            onClick={handleLogout}
            className="btn btn-danger"
            style={{ width: '100%', justifyContent: 'center' }}
          >
            <LogOut size={16} />
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100vh', overflowY: 'auto' }}>
        {/* Top Navbar */}
        <header style={{
          padding: '16px 32px',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: 'var(--bg-secondary)'
        }}>
          <div>
            <h1 style={{ fontSize: '22px', margin: 0, color: 'var(--text-primary)' }}>
              {currentTab === 'overview' && 'Resumen Financiero y Dashboards'}
              {currentTab === 'cotizador' && 'Cotizador de Prendas y Fórmulas'}
              {currentTab === 'inventory' && 'Inventario de Ropa'}
              {currentTab === 'insumos' && 'Catálogo de Insumos'}
              {currentTab === 'packaging' && 'Costo de Empaque (Packaging)'}
              {currentTab === 'expenses' && 'Control de Gastos Operativos'}
              {currentTab === 'revenues' && 'Registro de Ingresos / Ventas'}
              {currentTab === 'calendar' && 'Calendario de Colecciones y Actividades'}
            </h1>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              {isUsingMock ? 'Modo de demostración: los datos se guardan en el navegador' : 'Conectado a la base de datos de Supabase'}
            </p>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button onClick={loadData} className="btn btn-secondary" style={{ padding: '8px 14px', fontSize: '13px' }}>
              Refrescar Datos
            </button>
            <button onClick={() => navigate('/')} className="btn btn-secondary" style={{ padding: '8px 14px', fontSize: '13px' }}>
              Ir a la tienda
            </button>
          </div>
        </header>

        {/* Tab Body */}
        <div style={{ padding: '32px', flex: 1 }}>
          {loading ? (
            <div className="flex-center" style={{ height: '70%', flexDirection: 'column', gap: '16px' }}>
              <div className="spinner" style={{
                width: '36px',
                height: '36px',
                border: '3px solid var(--border-color)',
                borderTopColor: 'var(--accent)',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }}></div>
              <p className="text-muted">Cargando información...</p>
            </div>
          ) : (
            <div className="fade-in">
              {currentTab === 'overview' && (
                <OverviewTab
                  expenses={expenses}
                  revenues={revenues}
                  products={products}
                />
              )}
              {currentTab === 'cotizador' && (
                <CotizadorTab
                  insumos={insumos}
                  packagingCost={getStandardPackagingCost()}
                  products={products}
                  onSave={loadData}
                />
              )}
              {currentTab === 'inventory' && (
                <InventoryTab
                  products={products}
                  onSave={loadData}
                />
              )}
              {currentTab === 'insumos' && (
                <InsumosTab
                  insumos={insumos}
                  onSave={loadData}
                />
              )}
              {currentTab === 'packaging' && (
                <PackagingTab
                  packaging={packaging}
                  onSave={loadData}
                />
              )}
              {currentTab === 'expenses' && (
                <ExpensesTab
                  expenses={expenses}
                  onSave={loadData}
                />
              )}
              {currentTab === 'revenues' && (
                <RevenuesTab
                  revenues={revenues}
                  products={products}
                  onSave={loadData}
                />
              )}
              {currentTab === 'calendar' && (
                <CalendarTab
                  events={events}
                  onSave={loadData}
                />
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

// ==========================================
// 1. OVERVIEW DASHBOARD TAB
// ==========================================
interface OverviewProps {
  expenses: Expense[];
  revenues: Revenue[];
  products: Product[];
}

function OverviewTab({ expenses, revenues, products }: OverviewProps) {
  // Key Metrics
  const totalRevenues = revenues.reduce((s, r) => s + r.total_amount, 0);
  const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0);
  
  // Real Net profit = totalRevenues - totalExpenses
  const netProfit = totalRevenues - totalExpenses;

  // Split calculations (Tani vs Maripy)
  // Expenses paid by
  const expensesTani = expenses.filter(e => e.paid_by.toLowerCase() === 'tani').reduce((s, e) => s + e.amount, 0);
  const expensesMaripy = expenses.filter(e => e.paid_by.toLowerCase().includes('maripi') || e.paid_by.toLowerCase().includes('maripy')).reduce((s, e) => s + e.amount, 0);
  const expensesShared = expenses.filter(e => e.paid_by.toLowerCase() === 'shared' || e.paid_by.toLowerCase() === 'compartido').reduce((s, e) => s + e.amount, 0);

  // Products stock status
  const lowStockProducts = products.filter(p => p.stock <= 3);

  // Group revenues & expenses by month for bar chart
  const getMonthlyData = () => {
    const monthlyMap: Record<string, { month: string; ingresos: number; gastos: number }> = {};

    revenues.forEach(r => {
      if (!r.date) return;
      const month = r.date.substring(0, 7); // YYYY-MM
      if (!monthlyMap[month]) {
        monthlyMap[month] = { month, ingresos: 0, gastos: 0 };
      }
      monthlyMap[month].ingresos += r.total_amount;
    });

    expenses.forEach(e => {
      if (!e.date) return;
      const month = e.date.substring(0, 7); // YYYY-MM
      if (!monthlyMap[month]) {
        monthlyMap[month] = { month, ingresos: 0, gastos: 0 };
      }
      monthlyMap[month].gastos += e.amount;
    });

    return Object.values(monthlyMap).sort((a, b) => a.month.localeCompare(b.month));
  };

  const chartData = getMonthlyData();

  // Pie chart data for expenses
  const expensesPieData = [
    { name: 'Tani', value: expensesTani, color: '#d4af37' },
    { name: 'Maripy', value: expensesMaripy, color: '#3b82f6' },
    { name: 'Compartido', value: expensesShared, color: '#10b981' }
  ].filter(d => d.value > 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      
      {/* Metric Cards Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
        
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div className="flex-center" style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: 'var(--success-glow)', color: 'var(--success)' }}>
            <Coins size={24} />
          </div>
          <div>
            <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Ingresos Totales</span>
            <h3 style={{ fontSize: '24px', color: 'var(--text-primary)' }}>${totalRevenues.toLocaleString('es-MX')}</h3>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div className="flex-center" style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: 'var(--error-glow)', color: 'var(--error)' }}>
            <TrendingDown size={24} />
          </div>
          <div>
            <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Gastos Totales</span>
            <h3 style={{ fontSize: '24px', color: 'var(--text-primary)' }}>${totalExpenses.toLocaleString('es-MX')}</h3>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div className="flex-center" style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            backgroundColor: netProfit >= 0 ? 'var(--success-glow)' : 'var(--error-glow)',
            color: netProfit >= 0 ? 'var(--success)' : 'var(--error)'
          }}>
            <DollarSign size={24} />
          </div>
          <div>
            <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Utilidad Neta Real</span>
            <h3 style={{ fontSize: '24px', color: 'var(--text-primary)' }}>${netProfit.toLocaleString('es-MX')}</h3>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div className="flex-center" style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: 'var(--accent-glow)', color: 'var(--accent)' }}>
            <Shirt size={24} />
          </div>
          <div>
            <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Prendas en Catálogo</span>
            <h3 style={{ fontSize: '24px', color: 'var(--text-primary)' }}>{products.length}</h3>
          </div>
        </div>

      </div>

      {/* Charts Section */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '32px' }}>
        
        {/* Income vs Expenses Bar Chart */}
        <div className="card" style={{ minHeight: '350px' }}>
          <h3 style={{ fontSize: '18px', color: 'var(--text-primary)', marginBottom: '20px' }}>Ingresos vs Gastos Mensuales</h3>
          {chartData.length === 0 ? (
            <div className="flex-center" style={{ height: '80%', color: 'var(--text-muted)' }}>
              No hay datos financieros registrados todavía.
            </div>
          ) : (
            <div style={{ width: '100%', height: '300px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="month" stroke="var(--text-muted)" fontSize={11} />
                  <YAxis stroke="var(--text-muted)" fontSize={11} />
                  <Tooltip contentStyle={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }} />
                  <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: '12px' }} />
                  <Bar dataKey="ingresos" name="Ingresos" fill="var(--success)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="gastos" name="Gastos" fill="var(--error)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Expenses Paid By Pie Chart */}
        <div className="card" style={{ minHeight: '350px', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: '18px', color: 'var(--text-primary)', marginBottom: '20px' }}>Inversión / Gastos por Socio</h3>
          {expensesPieData.length === 0 ? (
            <div className="flex-center" style={{ height: '80%', color: 'var(--text-muted)' }}>
              Sin egresos registrados.
            </div>
          ) : (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
              <div style={{ width: '100%', height: '180px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={expensesPieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={70}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {expensesPieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Legends with detail */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%', marginTop: '16px' }}>
                {expensesPieData.map((d, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: d.color }}></span>
                      <span style={{ color: 'var(--text-secondary)' }}>{d.name}</span>
                    </div>
                    <strong style={{ color: 'var(--text-primary)' }}>${d.value.toLocaleString('es-MX')}</strong>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

      </div>

      {/* Warnings & Low Stock Section */}
      <div className="card">
        <h3 style={{ fontSize: '18px', color: 'var(--text-primary)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <AlertTriangle className="text-accent" size={18} />
          Alertas de Stock e Inventario Bajo
        </h3>
        
        {lowStockProducts.length === 0 ? (
          <p style={{ fontSize: '14px', color: 'var(--success)' }}>
            ✓ ¡Perfecto! Todas las prendas tienen buen nivel de stock.
          </p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px' }}>
            {lowStockProducts.map(p => (
              <div key={p.id} style={{
                padding: '12px 16px',
                border: '1px solid rgba(245, 158, 11, 0.2)',
                borderRadius: '8px',
                backgroundColor: 'rgba(245, 158, 11, 0.05)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <h4 style={{ fontSize: '14px', color: 'var(--text-primary)', margin: 0 }}>{p.name}</h4>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Diseñador: {p.designer}</span>
                </div>
                <strong style={{
                  color: p.stock === 0 ? 'var(--error)' : 'var(--warning)',
                  fontSize: '14px',
                  border: `1px solid ${p.stock === 0 ? 'var(--error)' : 'var(--warning)'}`,
                  padding: '2px 8px',
                  borderRadius: '4px'
                }}>
                  {p.stock === 0 ? 'Agotado' : `${p.stock} pz`}
                </strong>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}

// ==========================================
// 2. COTIZADOR TAB (Quoter & Price Calc)
// ==========================================
interface CotizadorProps {
  insumos: Insumo[];
  packagingCost: number;
  products: Product[];
  onSave: () => void;
}

function CotizadorTab({ insumos, packagingCost, products, onSave }: CotizadorProps) {
  // Input fields
  const [selectedProductId, setSelectedProductId] = useState<string>('');
  
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [designer, setDesigner] = useState('Tani');
  const [baseCost, setBaseCost] = useState<number>(70);
  const [laborHours, setLaborHours] = useState<number>(6);
  const [laborHourlyRate, setLaborHourlyRate] = useState<number>(150);
  const [desiredMargin, setDesiredMargin] = useState<number>(33);
  const [packagingOverride, setPackagingOverride] = useState<string>('');
  const [stock, setStock] = useState<number>(5);
  const [imageUrl, setImageUrl] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [uploadingImage, setUploadingImage] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      if (isUsingMock) {
        // Read file as Base64 Data URL
        const reader = new FileReader();
        reader.onloadend = () => {
          setImageUrl(reader.result as string);
          setUploadingImage(false);
        };
        reader.readAsDataURL(file);
      } else {
        // Upload to Supabase Storage bucket 'product-images'
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `${fileName}`;

        // Ensure file is uploaded to the bucket
        const { error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(filePath, file);

        if (uploadError) {
          console.warn("Supabase storage upload failed, falling back to Base64:", uploadError);
          const reader = new FileReader();
          reader.onloadend = () => {
            setImageUrl(reader.result as string);
            setUploadingImage(false);
          };
          reader.readAsDataURL(file);
          return;
        }

        // Get public URL
        const { data } = supabase.storage
          .from('product-images')
          .getPublicUrl(filePath);

        setImageUrl(data.publicUrl);
        setUploadingImage(false);
      }
    } catch (err) {
      console.error("Image upload error:", err);
      alert("Error al subir la imagen. Usando respaldo...");
      setUploadingImage(false);
    }
  };

  // Materials added to current garment
  const [materials, setMaterials] = useState<ProductMaterial[]>([]);
  const [selectedInsumoId, setSelectedInsumoId] = useState('');
  const [insumoQty, setInsumoQty] = useState<number>(1);

  // Hydrate fields if loading existing product
  const handleProductSelect = (id: string) => {
    setSelectedProductId(id);
    if (!id) {
      // Clear form
      setName('');
      setDescription('');
      setDesigner('Tani');
      setBaseCost(70);
      setLaborHours(6);
      setDesiredMargin(33);
      setPackagingOverride('');
      setStock(5);
      setImageUrl('');
      setIsActive(true);
      setMaterials([]);
      return;
    }

    const p = products.find(prod => prod.id === id);
    if (p) {
      setName(p.name);
      setDescription(p.description || '');
      setDesigner(p.designer);
      setBaseCost(p.base_cost);
      setLaborHours(p.labor_hours);
      setLaborHourlyRate(p.labor_hourly_rate);
      setDesiredMargin(p.desired_margin);
      setPackagingOverride(p.packaging_cost_override !== null && p.packaging_cost_override !== undefined ? String(p.packaging_cost_override) : '');
      setStock(p.stock);
      setImageUrl(p.images[0] || '');
      setIsActive(p.is_active);
      setMaterials(p.materials || []);
    }
  };

  // Add material
  const addMaterial = () => {
    if (!selectedInsumoId) return;
    const ins = insumos.find(i => i.id === selectedInsumoId);
    if (!ins) return;

    // Check if already added
    const existing = materials.find(m => m.insumo_id === selectedInsumoId);
    if (existing) {
      setMaterials(materials.map(m =>
        m.insumo_id === selectedInsumoId
          ? { ...m, quantity_used: m.quantity_used + insumoQty }
          : m
      ));
    } else {
      setMaterials([...materials, {
        insumo_id: selectedInsumoId,
        name: ins.name,
        unit: ins.unit,
        unit_price: ins.unit_price || (ins.price / ins.quantity_per_unit),
        quantity_used: insumoQty
      }]);
    }
    
    setSelectedInsumoId('');
    setInsumoQty(1);
  };

  // Remove material
  const removeMaterial = (insumoId: string) => {
    setMaterials(materials.filter(m => m.insumo_id !== insumoId));
  };

  // Pricing calculations
  const totalMaterialsCost = materials.reduce((sum, m) => {
    const price = m.unit_price || 0;
    return sum + (price * m.quantity_used);
  }, 0);

  const totalLaborCost = laborHours * laborHourlyRate;
  
  const selectedPackagingCost = packagingOverride !== '' ? Number(packagingOverride) : packagingCost;
  
  // Total dress cost = base_cost (garment cost) + materials_cost + labor_cost + packaging_cost
  const totalCost = baseCost + totalMaterialsCost + totalLaborCost + selectedPackagingCost;

  // calculated retail price = totalCost / (1 - (margin / 100))
  const calculatedPrice = desiredMargin >= 100 ? totalCost : totalCost / (1 - desiredMargin / 100);
  
  // round cash price to nearest 50 pesos
  const priceCash = Math.round(calculatedPrice / 50) * 50;
  
  // card price covers card fee (4.06% in their excel) -> card_price = cash_price / (1 - 0.0406) or in their excel they set rounded prices
  // Let's implement card fee: card_price = cash_price * 1.0406, and let's round it to nearest 50 too or round up.
  // In Excel: $1600 cash -> $1700 card. (Diff is +$100, which is roughly +6.25%).
  // Let's use card_price = Math.round((priceCash * 1.0406) / 50) * 50 or simply round up. Let's make it a nice round figure.
  const priceCard = Math.round((priceCash * 1.05) / 50) * 50;

  // Profit/Utility calculations
  const profitCash = priceCash - totalCost;
  const cardCommission = priceCard * 0.0406;
  const profitCard = priceCard - totalCost - cardCommission;

  // Save product to DB
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      const productToSave: Product = {
        id: selectedProductId || undefined as any, // Supabase generates if empty
        name,
        description,
        base_cost: baseCost,
        labor_hours: laborHours,
        labor_hourly_rate: laborHourlyRate,
        packaging_cost_override: packagingOverride !== '' ? Number(packagingOverride) : null,
        desired_margin: desiredMargin,
        price_cash: priceCash,
        price_card: priceCard,
        designer,
        stock,
        images: imageUrl ? [imageUrl] : [],
        is_active: isActive,
        materials: materials.map(m => ({
          insumo_id: m.insumo_id,
          quantity_used: m.quantity_used
        }))
      };

      await db.products.save(productToSave);
      
      // Reset form
      handleProductSelect('');
      onSave(); // Refresh parent lists
      alert('✓ Prenda guardada exitosamente');
    } catch (err) {
      console.error(err);
      alert('Error al guardar la prenda');
    }
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '32px' }}>
      
      {/* Editor Column */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h3 style={{ fontSize: '18px', color: 'var(--text-primary)' }}>Editor de Fórmulas y Costos</h3>
          
          <select
            className="form-select"
            style={{ maxWidth: '220px', padding: '6px 12px' }}
            value={selectedProductId}
            onChange={e => handleProductSelect(e.target.value)}
          >
            <option value="">-- Crear Nueva Prenda --</option>
            {products.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>

        <form onSubmit={handleSaveProduct} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">Nombre de Prenda</label>
              <input type="text" className="form-input" value={name} onChange={e => setName(e.target.value)} required placeholder="Ej: Suéter Negro" />
            </div>
            
            <div className="form-group">
              <label className="form-label">Creador / Diseñador</label>
              <select className="form-select" value={designer} onChange={e => setDesigner(e.target.value)}>
                <option value="Tani">Tani</option>
                <option value="Maripy">Maripy</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Descripción (Para la tienda)</label>
            <textarea className="form-textarea" rows={2} value={description} onChange={e => setDescription(e.target.value)} placeholder="Escribe detalles del diseño o confección..." />
          </div>

          {/* Core pricing parameters */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                Costo Base Prenda
                <span title="Costo inicial o valor de adquisición/confección base" style={{ cursor: 'help', color: 'var(--text-muted)' }}><Info size={12} /></span>
              </label>
              <input type="number" className="form-input" value={baseCost} onChange={e => setBaseCost(Number(e.target.value))} required />
            </div>

            <div className="form-group">
              <label className="form-label">Horas Confección</label>
              <input type="number" step="0.1" className="form-input" value={laborHours} onChange={e => setLaborHours(Number(e.target.value))} required />
            </div>

            <div className="form-group">
              <label className="form-label">Margen Deseado (%)</label>
              <input type="number" className="form-input" value={desiredMargin} onChange={e => setDesiredMargin(Number(e.target.value))} required />
            </div>
          </div>

          {/* Add materials section */}
          <div style={{ border: '1px solid var(--border-color)', borderRadius: '8px', padding: '16px', backgroundColor: 'var(--bg-secondary)' }}>
            <h4 style={{ fontSize: '14px', color: 'var(--text-primary)', marginBottom: '12px' }}>Materiales e Insumos Añadidos</h4>
            
            <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
              <select
                className="form-select"
                style={{ flex: 1 }}
                value={selectedInsumoId}
                onChange={e => setSelectedInsumoId(e.target.value)}
              >
                <option value="">-- Seleccionar Insumo --</option>
                {insumos.map(i => (
                  <option key={i.id} value={i.id}>
                    {i.name} (${(i.unit_price || (i.price / i.quantity_per_unit)).toFixed(2)} / {i.unit})
                  </option>
                ))}
              </select>

              <input
                type="number"
                step="0.01"
                className="form-input"
                style={{ width: '80px' }}
                value={insumoQty}
                onChange={e => setInsumoQty(Number(e.target.value))}
                placeholder="Cant"
              />

              <button type="button" onClick={addMaterial} className="btn btn-secondary">
                Agregar
              </button>
            </div>

            {/* List of materials currently in this calculation */}
            {materials.length === 0 ? (
              <p className="text-muted" style={{ fontSize: '13px', textAlign: 'center', paddingTop: '10px', paddingBottom: '10px' }}>No hay insumos añadidos.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '150px', overflowY: 'auto' }}>
                {materials.map((m, idx) => {
                  const uPrice = m.unit_price || 0;
                  return (
                    <div key={idx} style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      backgroundColor: 'var(--bg-card)',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      fontSize: '13px'
                    }}>
                      <span>
                        <strong>{m.name || insumos.find(i => i.id === m.insumo_id)?.name}</strong>: {m.quantity_used} {m.unit || insumos.find(i => i.id === m.insumo_id)?.unit}
                      </span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span>${(uPrice * m.quantity_used).toFixed(2)}</span>
                        <button type="button" onClick={() => removeMaterial(m.insumo_id)} style={{ background: 'none', border: 'none', color: 'var(--error)', cursor: 'pointer' }}>
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Packaging and stock */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                Costo Packaging
                <span title="Si se deja en blanco, usa el costo calculado global ($42.55)" style={{ cursor: 'help', color: 'var(--text-muted)' }}><Info size={12} /></span>
              </label>
              <input
                type="number"
                placeholder={packagingCost.toFixed(2)}
                className="form-input"
                value={packagingOverride}
                onChange={e => setPackagingOverride(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Stock de Inventario</label>
              <input type="number" className="form-input" value={stock} onChange={e => setStock(Number(e.target.value))} required />
            </div>

            <div className="form-group">
              <label className="form-label">Mostrar en Tienda</label>
              <select className="form-select" value={isActive ? 'true' : 'false'} onChange={e => setIsActive(e.target.value === 'true')}>
                <option value="true">Activo</option>
                <option value="false">Oculto</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Imagen de la Prenda</label>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <input
                type="text"
                className="form-input"
                style={{ flex: 1 }}
                value={imageUrl}
                onChange={e => setImageUrl(e.target.value)}
                placeholder="Escribe la URL de la imagen..."
              />
              
              <label className="btn btn-secondary" style={{ whiteSpace: 'nowrap', cursor: 'pointer', margin: 0, padding: '10px 14px' }}>
                {uploadingImage ? 'Subiendo...' : 'Subir Archivo'}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  style={{ display: 'none' }}
                  disabled={uploadingImage}
                />
              </label>
            </div>
            
            {imageUrl && (
              <div style={{ marginTop: '10px', position: 'relative', width: '100px', height: '100px', border: '1px solid var(--border-color)', borderRadius: '8px', overflow: 'hidden' }}>
                <img src={imageUrl} alt="Vista previa" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <button
                  type="button"
                  onClick={() => setImageUrl('')}
                  style={{
                    position: 'absolute',
                    top: '4px',
                    right: '4px',
                    backgroundColor: 'rgba(0,0,0,0.6)',
                    border: 'none',
                    borderRadius: '50%',
                    color: 'var(--text-primary)',
                    width: '20px',
                    height: '20px',
                    cursor: 'pointer',
                    fontSize: '11px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  &times;
                </button>
              </div>
            )}
          </div>

          <button type="submit" className="btn btn-primary" style={{ padding: '12px' }}>
            <Save size={16} />
            Guardar Prenda en Catálogo
          </button>

        </form>
      </div>

      {/* Live Calculation Results Column */}
      <div className="card" style={{
        background: 'radial-gradient(circle at 100% 0%, rgba(214, 175, 55, 0.05) 0%, var(--bg-card) 70%)',
        borderColor: 'var(--border-color)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
      }}>
        <div>
          <h3 style={{ fontSize: '18px', color: 'var(--text-primary)', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Calculator size={20} className="text-accent" />
            Desglose de Costos de la Prenda
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
              <span className="text-muted">Costo Base Inicial:</span>
              <strong style={{ color: 'var(--text-primary)' }}>${baseCost.toFixed(2)}</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
              <span className="text-muted">Insumos y Materiales:</span>
              <strong style={{ color: 'var(--text-primary)' }}>${totalMaterialsCost.toFixed(2)}</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
              <span className="text-muted">Mano de Obra Confección ({laborHours} hrs x ${laborHourlyRate}):</span>
              <strong style={{ color: 'var(--text-primary)' }}>${totalLaborCost.toFixed(2)}</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
              <span className="text-muted">Packaging / Envase:</span>
              <strong style={{ color: 'var(--text-primary)' }}>${selectedPackagingCost.toFixed(2)}</strong>
            </div>

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '16px',
              borderTop: '1px dashed var(--border-color)',
              paddingTop: '14px',
              marginTop: '8px'
            }}>
              <span style={{ color: 'var(--accent)' }}>Costo Total Vestido:</span>
              <strong style={{ color: 'var(--accent)', fontSize: '18px' }}>${totalCost.toFixed(2)}</strong>
            </div>

          </div>
        </div>

        {/* Sales prices calculations */}
        <div style={{ marginTop: '24px', backgroundColor: 'var(--bg-secondary)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
          <h4 style={{ fontSize: '14px', color: 'var(--text-primary)', marginBottom: '14px' }}>Precios de Venta Calculados</h4>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            
            {/* Cash price */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Precio de Venta Cash:</span>
                <strong style={{ fontSize: '22px', color: 'var(--success)' }}>${priceCash.toLocaleString('es-MX')}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                <span>Margen obtenido: {desiredMargin}%</span>
                <span>Utilidad neta: +${profitCash.toFixed(2)}</span>
              </div>
            </div>

            {/* Card price */}
            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '12px', marginTop: '4px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Precio de Venta Tarjeta:</span>
                <strong style={{ fontSize: '18px', color: 'var(--text-primary)' }}>${priceCard.toLocaleString('es-MX')}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                <span>Comisión de tarjeta (4.06%): -${cardCommission.toFixed(2)}</span>
                <span>Utilidad neta: +${profitCard.toFixed(2)}</span>
              </div>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}

// ==========================================
// 3. INVENTORY TAB
// ==========================================
interface InventoryProps {
  products: Product[];
  onSave: () => void;
}

function InventoryTab({ products, onSave }: InventoryProps) {
  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este producto del inventario?')) return;
    try {
      await db.products.delete(id);
      onSave();
    } catch (err) {
      console.error(err);
      alert('Error al borrar producto');
    }
  };

  const handleStockChange = async (p: Product, delta: number) => {
    const newStock = Math.max(0, p.stock + delta);
    try {
      await db.products.save({ ...p, stock: newStock });
      onSave();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="card">
      <h3 style={{ fontSize: '18px', color: 'var(--text-primary)', marginBottom: '20px' }}>Inventario de Prendas</h3>
      
      {products.length === 0 ? (
        <p className="text-muted">No hay productos en inventario.</p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                <th style={{ padding: '12px' }}>Prenda</th>
                <th style={{ padding: '12px' }}>Diseñador</th>
                <th style={{ padding: '12px' }}>Efectivo (Cash)</th>
                <th style={{ padding: '12px' }}>Tarjeta</th>
                <th style={{ padding: '12px', textAlign: 'center' }}>Stock</th>
                <th style={{ padding: '12px' }}>Estado</th>
                <th style={{ padding: '12px', textAlign: 'right' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p.id} style={{ borderBottom: '1px solid var(--border-color)', verticalAlign: 'middle' }}>
                  <td style={{ padding: '16px 12px', fontWeight: 600, color: 'var(--text-primary)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      {p.images && p.images[0] && (
                        <img src={p.images[0]} alt={p.name} style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />
                      )}
                      {p.name}
                    </div>
                  </td>
                  <td style={{ padding: '12px' }}>{p.designer}</td>
                  <td style={{ padding: '12px', color: 'var(--accent)' }}>${p.price_cash?.toLocaleString('es-MX')}</td>
                  <td style={{ padding: '12px' }}>${p.price_card?.toLocaleString('es-MX')}</td>
                  <td style={{ padding: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                      <button onClick={() => handleStockChange(p, -1)} style={{ width: '24px', height: '24px', borderRadius: '4px', border: '1px solid var(--border-color)', background: 'none', color: 'var(--text-primary)', cursor: 'pointer' }}>-</button>
                      <strong style={{ minWidth: '24px', textAlign: 'center' }}>{p.stock}</strong>
                      <button onClick={() => handleStockChange(p, 1)} style={{ width: '24px', height: '24px', borderRadius: '4px', border: '1px solid var(--border-color)', background: 'none', color: 'var(--text-primary)', cursor: 'pointer' }}>+</button>
                    </div>
                  </td>
                  <td style={{ padding: '12px' }}>
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '11px',
                      fontWeight: 600,
                      backgroundColor: p.is_active ? 'var(--success-glow)' : 'rgba(239, 68, 68, 0.1)',
                      color: p.is_active ? 'var(--success)' : 'var(--error)'
                    }}>
                      {p.is_active ? 'Público' : 'Oculto'}
                    </span>
                  </td>
                  <td style={{ padding: '12px', textAlign: 'right' }}>
                    <button onClick={() => handleDelete(p.id)} className="btn btn-danger" style={{ padding: '6px 10px', fontSize: '12px' }}>
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ==========================================
// 4. INSUMOS (Supplies CRUD) TAB
// ==========================================
interface InsumosProps {
  insumos: Insumo[];
  onSave: () => void;
}

function InsumosTab({ insumos, onSave }: InsumosProps) {
  const [name, setName] = useState('');
  const [unit, setUnit] = useState('metros');
  const [qtyPerUnit, setQtyPerUnit] = useState<number>(1);
  const [price, setPrice] = useState<number>(0);
  const [store, setStore] = useState('');
  const [editId, setEditId] = useState<string | null>(null);

  // Filter and Sort states
  const [searchTerm, setSearchTerm] = useState('');
  const [filterUnit, setFilterUnit] = useState('all');
  const [sortBy, setSortBy] = useState<'name' | 'unit_price_asc' | 'unit_price_desc' | 'price_asc' | 'price_desc' | 'store'>('name');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      const insumo: Insumo = {
        id: editId || undefined as any,
        name,
        unit,
        quantity_per_unit: qtyPerUnit,
        price,
        store
      };
      await db.insumos.save(insumo);
      
      // Reset
      setName('');
      setUnit('metros');
      setQtyPerUnit(1);
      setPrice(0);
      setStore('');
      setEditId(null);
      onSave();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (i: Insumo) => {
    setEditId(i.id);
    setName(i.name);
    setUnit(i.unit);
    setQtyPerUnit(i.quantity_per_unit);
    setPrice(i.price);
    setStore(i.store || '');
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar insumo? Se quitará de cualquier cálculo de prenda.')) return;
    try {
      await db.insumos.delete(id);
      onSave();
    } catch (err) {
      console.error(err);
    }
  };

  // Filter and sort computation
  const filteredAndSortedInsumos = insumos
    .filter(i => {
      const matchSearch = i.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (i.store || '').toLowerCase().includes(searchTerm.toLowerCase());
      const matchUnit = filterUnit === 'all' || i.unit === filterUnit;
      return matchSearch && matchUnit;
    })
    .sort((a, b) => {
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      }
      if (sortBy === 'unit_price_asc') {
        const upA = a.unit_price || (a.price / a.quantity_per_unit);
        const upB = b.unit_price || (b.price / b.quantity_per_unit);
        return upA - upB;
      }
      if (sortBy === 'unit_price_desc') {
        const upA = a.unit_price || (a.price / a.quantity_per_unit);
        const upB = b.unit_price || (b.price / b.quantity_per_unit);
        return upB - upA;
      }
      if (sortBy === 'price_asc') {
        return a.price - b.price;
      }
      if (sortBy === 'price_desc') {
        return b.price - a.price;
      }
      if (sortBy === 'store') {
        return (a.store || '').localeCompare(b.store || '');
      }
      return 0;
    });

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.8fr', gap: '32px' }}>
      
      {/* Form */}
      <div className="card">
        <h3 style={{ fontSize: '18px', color: 'var(--text-primary)', marginBottom: '20px' }}>
          {editId ? 'Editar Insumo' : 'Registrar Insumo'}
        </h3>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="form-group">
            <label className="form-label">Nombre del Insumo</label>
            <input type="text" className="form-input" value={name} onChange={e => setName(e.target.value)} required placeholder="Ej: Hilos recta" />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="form-group">
              <label className="form-label">Unidad de Compra</label>
              <select className="form-select" value={unit} onChange={e => setUnit(e.target.value)}>
                <option value="metros">Metros</option>
                <option value="gramos">Gramos</option>
                <option value="millar">Millar</option>
                <option value="unidad">Unidad</option>
                <option value="paquete">Paquete</option>
                <option value="caja">Caja</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Cantidad por Unidad</label>
              <input type="number" step="0.01" className="form-input" value={qtyPerUnit} onChange={e => setQtyPerUnit(Number(e.target.value))} required />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="form-group">
              <label className="form-label">Precio Unitario Paquete</label>
              <input type="number" step="0.01" className="form-input" value={price} onChange={e => setPrice(Number(e.target.value))} required />
            </div>

            <div className="form-group">
              <label className="form-label">Tienda / Proveedor</label>
              <input type="text" className="form-input" value={store} onChange={e => setStore(e.target.value)} placeholder="Ej: Nuevo Mundo" />
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ marginTop: '8px' }}>
            {editId ? 'Guardar Cambios' : 'Añadir Insumo'}
          </button>
          
          {editId && (
            <button type="button" onClick={() => {
              setEditId(null);
              setName('');
              setPrice(0);
              setStore('');
            }} className="btn btn-secondary">
              Cancelar
            </button>
          )}
        </form>
      </div>

      {/* List */}
      <div className="card">
        <h3 style={{ fontSize: '18px', color: 'var(--text-primary)', marginBottom: '20px' }}>Lista de Insumos</h3>
        
        {/* Filters */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
          <input
            type="text"
            className="form-input"
            style={{ flex: 2, minWidth: '180px' }}
            placeholder="Buscar por nombre o proveedor..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
          <select
            className="form-select"
            style={{ flex: 1, minWidth: '120px' }}
            value={filterUnit}
            onChange={e => setFilterUnit(e.target.value)}
          >
            <option value="all">Unidades: Todas</option>
            <option value="metros">Metros</option>
            <option value="gramos">Gramos</option>
            <option value="millar">Millar</option>
            <option value="unidad">Unidad</option>
            <option value="paquete">Paquete</option>
            <option value="caja">Caja</option>
          </select>
          <select
            className="form-select"
            style={{ flex: 1, minWidth: '150px' }}
            value={sortBy}
            onChange={e => setSortBy(e.target.value as any)}
          >
            <option value="name">Ordenar: Nombre (A-Z)</option>
            <option value="unit_price_asc">Costo Unitario (Menor-Mayor)</option>
            <option value="unit_price_desc">Costo Unitario (Mayor-Menor)</option>
            <option value="price_asc">Precio Paquete (Menor-Mayor)</option>
            <option value="price_desc">Precio Paquete (Mayor-Menor)</option>
            <option value="store">Proveedor (A-Z)</option>
          </select>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
              <th style={{ padding: '8px 12px', textAlign: 'left' }}>Insumo</th>
              <th style={{ padding: '8px 12px', textAlign: 'left' }}>Cantidad</th>
              <th style={{ padding: '8px 12px', textAlign: 'left' }}>Costo Unidad</th>
              <th style={{ padding: '8px 12px', textAlign: 'left' }}>Costo Unitario</th>
              <th style={{ padding: '8px 12px', textAlign: 'left' }}>Proveedor</th>
              <th style={{ padding: '8px 12px', textAlign: 'right' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredAndSortedInsumos.map(i => (
              <tr key={i.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '12px 8px', fontWeight: 600, color: 'var(--text-primary)' }}>{i.name}</td>
                <td style={{ padding: '12px 8px' }}>{i.quantity_per_unit} {i.unit}</td>
                <td style={{ padding: '12px 8px' }}>${i.price.toFixed(2)}</td>
                <td style={{ padding: '12px 8px', color: 'var(--accent)' }}>
                  ${(i.unit_price || (i.price / i.quantity_per_unit)).toFixed(4)}
                </td>
                <td style={{ padding: '12px 8px' }}>{i.store || '-'}</td>
                <td style={{ padding: '12px 8px', textAlign: 'right', display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                  <button onClick={() => handleEdit(i)} className="btn btn-secondary" style={{ padding: '4px 8px', fontSize: '11px' }}>
                    <Edit size={12} />
                  </button>
                  <button onClick={() => handleDelete(i.id)} className="btn btn-danger" style={{ padding: '4px 8px', fontSize: '11px' }}>
                    <Trash2 size={12} />
                  </button>
                </td>
              </tr>
            ))}
            {filteredAndSortedInsumos.length === 0 && (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)' }}>
                  No se encontraron insumos.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
}

// ==========================================
// 4.5 CALENDAR EVENTS TAB
// ==========================================
// ==========================================
// 4.5 CALENDAR EVENTS TAB (Monthly Grid Layout)
// ==========================================
interface CalendarProps {
  events: CalendarEvent[];
  onSave: () => void;
}

function CalendarTab({ events, onSave }: CalendarProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [category, setCategory] = useState<'Production' | 'Bazar' | 'Fitting' | 'Photo Shoot' | 'Launch' | 'Other'>('Production');
  const [status, setStatus] = useState<'Pending' | 'Completed'>('Pending');
  const [editId, setEditId] = useState<string | null>(null);

  // Month navigation state
  const [currentDate, setCurrentDate] = useState(new Date());
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  };

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  // Start day: 0 = Mon, 1 = Tue, ..., 6 = Sun
  const getStartDay = () => {
    const day = new Date(currentYear, currentMonth, 1).getDay();
    return day === 0 ? 6 : day - 1;
  };
  const startDay = getStartDay();

  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !date) return;

    try {
      const event: CalendarEvent = {
        id: editId || undefined as any,
        title,
        description,
        date,
        category,
        status
      };
      await db.events.save(event);
      
      // Reset
      setTitle('');
      setDescription('');
      setDate('');
      setCategory('Production');
      setStatus('Pending');
      setEditId(null);
      onSave();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (ev: CalendarEvent) => {
    setEditId(ev.id);
    setTitle(ev.title);
    setDescription(ev.description || '');
    setDate(ev.date);
    setCategory(ev.category);
    setStatus(ev.status);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar evento del calendario?')) return;
    try {
      await db.events.delete(id);
      onSave();
    } catch (err) {
      console.error(err);
    }
  };

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'Production': return { bg: '#8f9f87', text: '#fff', label: 'Prod' };
      case 'Bazar': return { bg: '#c58b68', text: '#fff', label: 'Bazar' };
      case 'Fitting': return { bg: '#9a7d56', text: '#fff', label: 'Fit' };
      case 'Photo Shoot': return { bg: '#c5a880', text: '#fff', label: 'Foto' };
      case 'Launch': return { bg: '#db7b5f', text: '#fff', label: 'Launch' };
      default: return { bg: '#9e9b92', text: '#fff', label: 'Otro' };
    }
  };

  const getEventsForDay = (day: number) => {
    const dateString = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return events.filter(ev => ev.date === dateString);
  };

  // Generate grid cells array
  const gridCells = [];
  for (let i = 0; i < startDay; i++) {
    gridCells.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    gridCells.push(i);
  }

  const weekdays = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '32px' }}>
      
      {/* Event Form Column */}
      <div className="card" style={{ height: 'fit-content' }}>
        <h3 style={{ fontSize: '18px', color: 'var(--text-primary)', marginBottom: '20px' }}>
          {editId ? 'Editar Evento' : 'Programar Evento'}
        </h3>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="form-group">
            <label className="form-label">Título del Evento</label>
            <input 
              type="text" 
              className="form-input" 
              value={title} 
              onChange={e => setTitle(e.target.value)} 
              required 
              placeholder="Ej: Bazar de Diseño Roma" 
            />
          </div>

          <div className="form-group">
            <label className="form-label">Fecha</label>
            <input 
              type="date" 
              className="form-input" 
              value={date} 
              onChange={e => setDate(e.target.value)} 
              required 
            />
          </div>

          <div className="form-group">
            <label className="form-label">Categoría</label>
            <select className="form-select" value={category} onChange={e => setCategory(e.target.value as any)}>
              <option value="Launch">Lanzamiento</option>
              <option value="Photo Shoot">Sesión de Fotos</option>
              <option value="Bazar">Bazar / Evento</option>
              <option value="Production">Producción</option>
              <option value="Fitting">Prueba Tallas (Fitting)</option>
              <option value="Other">Otro</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Estado</label>
            <select className="form-select" value={status} onChange={e => setStatus(e.target.value as any)}>
              <option value="Pending">Pendiente</option>
              <option value="Completed">Completado</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Notas / Descripción</label>
            <textarea 
              className="form-input" 
              value={description} 
              onChange={e => setDescription(e.target.value)} 
              placeholder="Notas del lanzamiento o detalles de entrega..." 
              style={{ minHeight: '60px', resize: 'vertical' }} 
            />
          </div>

          <div style={{ display: 'flex', gap: '8px', marginTop: '4px', flexWrap: 'wrap' }}>
            <button type="submit" className="btn btn-primary" style={{ flex: 1, padding: '10px', minWidth: '100px' }}>
              {editId ? 'Guardar' : 'Agendar'}
            </button>
            {editId && (
              <>
                <button 
                  type="button" 
                  onClick={() => handleDelete(editId)}
                  className="btn btn-danger"
                  style={{ padding: '10px' }}
                >
                  Eliminar
                </button>
                <button 
                  type="button" 
                  onClick={() => {
                    setEditId(null);
                    setTitle('');
                    setDescription('');
                    setDate('');
                    setCategory('Production');
                    setStatus('Pending');
                  }} 
                  className="btn btn-secondary"
                  style={{ padding: '10px' }}
                >
                  Cancelar
                </button>
              </>
            )}
          </div>
        </form>
      </div>

      {/* Monthly Grid Column */}
      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        {/* Month Header and controls */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontSize: '20px', color: 'var(--text-primary)', fontFamily: 'var(--font-heading)', fontWeight: 600 }}>
            {monthNames[currentMonth]} {currentYear}
          </h3>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="btn btn-secondary" onClick={handlePrevMonth} style={{ padding: '6px 12px' }}>
              &larr; Ant
            </button>
            <button className="btn btn-secondary" onClick={handleNextMonth} style={{ padding: '6px 12px' }}>
              Sig &rarr;
            </button>
          </div>
        </div>

        {/* Weekly Header row */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(7, 1fr)', 
          textAlign: 'center', 
          borderBottom: '1px solid var(--border-color)',
          paddingBottom: '8px',
          fontWeight: 600,
          color: 'var(--text-secondary)',
          fontSize: '12px',
          letterSpacing: '1px',
          textTransform: 'uppercase'
        }}>
          {weekdays.map(d => (
            <div key={d}>{d}</div>
          ))}
        </div>

        {/* Calendar Grid Cells */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(7, 1fr)', 
          gap: '8px',
          minHeight: '400px'
        }}>
          {gridCells.map((day, idx) => {
            if (day === null) {
              return (
                <div key={`empty-${idx}`} style={{ 
                  backgroundColor: 'rgba(0,0,0,0.01)', 
                  borderRadius: '6px',
                  border: '1px solid transparent'
                }}></div>
              );
            }

            const dayEvents = getEventsForDay(day);
            const isToday = new Date().getDate() === day && new Date().getMonth() === currentMonth && new Date().getFullYear() === currentYear;

            return (
              <div 
                key={`day-${day}`} 
                onClick={() => {
                  const dateString = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                  setDate(dateString);
                }}
                style={{ 
                  backgroundColor: isToday ? 'var(--bg-secondary)' : 'var(--bg-card)', 
                  borderRadius: '8px',
                  border: isToday ? '1px solid var(--accent)' : '1px solid var(--border-color)',
                  padding: '8px',
                  minHeight: '80px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px',
                  cursor: 'pointer',
                  position: 'relative',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = 'var(--accent)';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = isToday ? 'var(--accent)' : 'var(--border-color)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                {/* Day number */}
                <span style={{ 
                  fontSize: '12px', 
                  fontWeight: isToday ? 700 : 500, 
                  color: isToday ? 'var(--accent)' : 'var(--text-primary)',
                  alignSelf: 'flex-start'
                }}>
                  {day}
                </span>

                {/* Event pills inside cells */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', overflowY: 'hidden', flex: 1 }}>
                  {dayEvents.map(ev => {
                    const colors = getCategoryColor(ev.category);
                    return (
                      <div 
                        key={ev.id}
                        onClick={(e) => {
                          e.stopPropagation(); // Don't trigger day click
                          handleEdit(ev);
                        }}
                        style={{
                          backgroundColor: colors.bg,
                          color: colors.text,
                          fontSize: '9px',
                          fontWeight: 600,
                          padding: '2px 4px',
                          borderRadius: '3px',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          border: ev.status === 'Completed' ? '1px solid var(--success)' : 'none',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center'
                        }}
                        title={`${ev.title}${ev.description ? '\n' + ev.description : ''}`}
                      >
                        <span>{ev.title}</span>
                        {ev.status === 'Completed' && <span style={{ marginLeft: '2px' }}>✓</span>}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

interface PackagingProps {
  packaging: PackagingComponent[];
  onSave: () => void;
}

function PackagingTab({ packaging, onSave }: PackagingProps) {
  const [name, setName] = useState('');
  const [price, setPrice] = useState<number>(0);
  const [unit, setUnit] = useState('Metro');
  const [unitsRequired, setUnitsRequired] = useState<number>(1);
  const [capacityMax, setCapacityMax] = useState<number>(1);
  const [editId, setEditId] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      const item: PackagingComponent = {
        id: editId || undefined as any,
        name,
        price,
        unit,
        units_required: unitsRequired,
        capacity_max: capacityMax
      };
      await db.packaging.save(item);
      
      // Reset
      setName('');
      setPrice(0);
      setUnit('Metro');
      setUnitsRequired(1);
      setCapacityMax(1);
      setEditId(null);
      onSave();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar componente de packaging?')) return;
    try {
      await db.packaging.delete(id);
      onSave();
    } catch (err) {
      console.error(err);
    }
  };

  const totalPackCost = packaging.reduce((sum, item) => sum + (item.cost_per_unit || 0), 0);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.8fr', gap: '32px' }}>
      
      {/* Form */}
      <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <h3 style={{ fontSize: '18px', color: 'var(--text-primary)', marginBottom: '20px' }}>
            {editId ? 'Editar Elemento Packaging' : 'Añadir Elemento Packaging'}
          </h3>
          
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">Nombre del Componente</label>
              <input type="text" className="form-input" value={name} onChange={e => setName(e.target.value)} required placeholder="Ej: Bolsa de manta (manta)" />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="form-group">
                <label className="form-label">Precio Unitario</label>
                <input type="number" step="0.01" className="form-input" value={price} onChange={e => setPrice(Number(e.target.value))} required />
              </div>
              <div className="form-group">
                <label className="form-label">Unidad de Medida</label>
                <input type="text" className="form-input" value={unit} onChange={e => setUnit(e.target.value)} required placeholder="Metro, Carrete, Hora" />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="form-group">
                <label className="form-label">Unidades Requeridas</label>
                <input type="number" step="0.01" className="form-input" value={unitsRequired} onChange={e => setUnitsRequired(Number(e.target.value))} required />
              </div>
              <div className="form-group">
                <label className="form-label">Capacidad Máxima</label>
                <input type="number" step="0.01" className="form-input" value={capacityMax} onChange={e => setCapacityMax(Number(e.target.value))} required />
              </div>
            </div>

            <button type="submit" className="btn btn-primary">
              {editId ? 'Guardar Cambios' : 'Añadir Componente'}
            </button>
          </form>
        </div>

        {/* Global summary */}
        <div style={{ marginTop: '24px', borderTop: '1px solid var(--border-color)', paddingTop: '20px' }}>
          <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Costo Total Calculado de Packaging:</span>
          <h2 style={{ fontSize: '32px', color: 'var(--accent)', fontWeight: 700 }}>
            ${totalPackCost.toFixed(2)} <span style={{ fontSize: '14px', color: 'var(--text-secondary)', fontWeight: 'normal' }}>MXN por prenda</span>
          </h2>
        </div>
      </div>

      {/* List */}
      <div className="card">
        <h3 style={{ fontSize: '18px', color: 'var(--text-primary)', marginBottom: '20px' }}>Lista de Componentes</h3>
        
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
              <th style={{ padding: '8px 12px', textAlign: 'left' }}>Componente</th>
              <th style={{ padding: '8px 12px', textAlign: 'left' }}>Precio</th>
              <th style={{ padding: '8px 12px', textAlign: 'left' }}>Requerido</th>
              <th style={{ padding: '8px 12px', textAlign: 'left' }}>Capacidad Max</th>
              <th style={{ padding: '8px 12px', textAlign: 'left' }}>Costo por Pieza</th>
              <th style={{ padding: '8px 12px', textAlign: 'right' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {packaging.map(item => (
              <tr key={item.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '12px 8px', fontWeight: 600, color: 'var(--text-primary)' }}>{item.name}</td>
                <td style={{ padding: '12px 8px' }}>${item.price.toFixed(2)} ({item.unit})</td>
                <td style={{ padding: '12px 8px' }}>{item.units_required}</td>
                <td style={{ padding: '12px 8px' }}>{item.capacity_max}</td>
                <td style={{ padding: '12px 8px', color: 'var(--accent)', fontWeight: 600 }}>
                  ${(item.cost_per_unit || ((item.price * item.units_required) / item.capacity_max)).toFixed(2)}
                </td>
                <td style={{ padding: '12px 8px', textAlign: 'right', display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                  <button onClick={() => {
                    setEditId(item.id);
                    setName(item.name);
                    setPrice(item.price);
                    setUnit(item.unit);
                    setUnitsRequired(item.units_required);
                    setCapacityMax(item.capacity_max);
                  }} className="btn btn-secondary" style={{ padding: '4px 8px', fontSize: '11px' }}>
                    <Edit size={12} />
                  </button>
                  <button onClick={() => handleDelete(item.id)} className="btn btn-danger" style={{ padding: '4px 8px', fontSize: '11px' }}>
                    <Trash2 size={12} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}

// ==========================================
// 6. EXPENSES TAB (Gastos Operativos)
// ==========================================
interface ExpensesProps {
  expenses: Expense[];
  onSave: () => void;
}

function ExpensesTab({ expenses, onSave }: ExpensesProps) {
  const [concept, setConcept] = useState('');
  const [place, setPlace] = useState('');
  const [amount, setAmount] = useState<number>(0);
  const [paidBy, setPaidBy] = useState('Tani');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!concept.trim()) return;

    try {
      const exp: Expense = {
        id: undefined as any,
        concept,
        place,
        amount,
        paid_by: paidBy,
        date
      };
      await db.expenses.save(exp);
      
      // Reset
      setConcept('');
      setPlace('');
      setAmount(0);
      setPaidBy('Tani');
      onSave();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar registro de gasto?')) return;
    try {
      await db.expenses.delete(id);
      onSave();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.8fr', gap: '32px' }}>
      
      {/* Form */}
      <div className="card">
        <h3 style={{ fontSize: '18px', color: 'var(--text-primary)', marginBottom: '20px' }}>Registrar Gasto</h3>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="form-group">
            <label className="form-label">Fecha</label>
            <input type="date" className="form-input" value={date} onChange={e => setDate(e.target.value)} required />
          </div>

          <div className="form-group">
            <label className="form-label">Concepto (¿Qué se compró?)</label>
            <input type="text" className="form-input" value={concept} onChange={e => setConcept(e.target.value)} required placeholder="Ej: Impresiones de etiquetas" />
          </div>

          <div className="form-group">
            <label className="form-label">Lugar / Establecimiento</label>
            <input type="text" className="form-input" value={place} onChange={e => setPlace(e.target.value)} placeholder="Ej: Office Depot" />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="form-group">
              <label className="form-label">Monto (Total MXN)</label>
              <input type="number" step="0.01" className="form-input" value={amount} onChange={e => setAmount(Number(e.target.value))} required />
            </div>

            <div className="form-group">
              <label className="form-label">Quién Pagó</label>
              <select className="form-select" value={paidBy} onChange={e => setPaidBy(e.target.value)}>
                <option value="Tani">Tani</option>
                <option value="Maripy">Maripy</option>
                <option value="Shared">Shared / Ambos</option>
              </select>
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ marginTop: '8px' }}>
            Registrar Gasto
          </button>
        </form>
      </div>

      {/* List */}
      <div className="card">
        <h3 style={{ fontSize: '18px', color: 'var(--text-primary)', marginBottom: '20px' }}>Historial de Egresos</h3>
        
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
              <th style={{ padding: '8px 12px', textAlign: 'left' }}>Fecha</th>
              <th style={{ padding: '8px 12px', textAlign: 'left' }}>Concepto</th>
              <th style={{ padding: '8px 12px', textAlign: 'left' }}>Lugar</th>
              <th style={{ padding: '8px 12px', textAlign: 'left' }}>Pagó</th>
              <th style={{ padding: '8px 12px', textAlign: 'left' }}>Monto</th>
              <th style={{ padding: '8px 12px', textAlign: 'right' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map(e => (
              <tr key={e.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '12px 8px' }}>{e.date}</td>
                <td style={{ padding: '12px 8px', fontWeight: 600, color: 'var(--text-primary)' }}>{e.concept}</td>
                <td style={{ padding: '12px 8px' }}>{e.place || '-'}</td>
                <td style={{ padding: '12px 8px' }}>
                  <span style={{
                    padding: '2px 6px',
                    borderRadius: '4px',
                    fontSize: '11px',
                    backgroundColor: e.paid_by.toLowerCase() === 'tani' ? 'var(--accent-glow)' : 'rgba(59, 130, 246, 0.1)',
                    color: e.paid_by.toLowerCase() === 'tani' ? 'var(--accent)' : '#3b82f6'
                  }}>{e.paid_by}</span>
                </td>
                <td style={{ padding: '12px 8px', fontWeight: 600, color: 'var(--error)' }}>
                  -${e.amount.toFixed(2)}
                </td>
                <td style={{ padding: '12px 8px', textAlign: 'right' }}>
                  <button onClick={() => handleDelete(e.id)} className="btn btn-danger" style={{ padding: '4px 8px', fontSize: '11px' }}>
                    <Trash2 size={12} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}

// ==========================================
// 7. REVENUES TAB (Ingresos / Ventas manuales)
// ==========================================
interface RevenuesProps {
  revenues: Revenue[];
  products: Product[];
  onSave: () => void;
}

function RevenuesTab({ revenues, products, onSave }: RevenuesProps) {
  const [productId, setProductId] = useState('');
  const [quantity, setQuantity] = useState<number>(1);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const [recordedBy, setRecordedBy] = useState('Tani');
  const [notes, setNotes] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  // Autofill price if product changes
  const handleProductChange = (prodId: string) => {
    setProductId(prodId);
    if (!prodId) {
      setTotalAmount(0);
      return;
    }
    const p = products.find(prod => prod.id === prodId);
    if (p) {
      const unitPrice = paymentMethod.toLowerCase() === 'cash' ? (p.price_cash || 0) : (p.price_card || 0);
      setTotalAmount(unitPrice * quantity);
    }
  };

  // Recalculate price when quantity or payment method changes
  useEffect(() => {
    if (!productId) return;
    const p = products.find(prod => prod.id === productId);
    if (p) {
      const unitPrice = paymentMethod.toLowerCase() === 'cash' ? (p.price_cash || 0) : (p.price_card || 0);
      setTotalAmount(unitPrice * quantity);
    }
  }, [quantity, paymentMethod, productId, products]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Calculate profit
    let profit = totalAmount; // Default profit equals sale amount if no product is selected (manual/general bazar)
    if (productId) {
      const p = products.find(prod => prod.id === productId);
      if (p) {
        // Calculate total cost of making this product (materials + base + labor + packaging)
        // For profit tracking, let's deduct the total estimated cost of goods
        // (For simplicity we'll store this as standard profit)
        const materialsCost = p.materials?.reduce((s, m) => s + (m.unit_price || 0) * m.quantity_used, 0) || 0;
        const laborCost = p.labor_hours * p.labor_hourly_rate;
        const unitCost = p.base_cost + materialsCost + laborCost + (p.packaging_cost_override || 42);
        
        const cardCommission = paymentMethod.toLowerCase() === 'card' ? totalAmount * 0.0406 : 0;
        profit = totalAmount - (unitCost * quantity) - cardCommission;
      }
    }

    try {
      const rev: Revenue = {
        id: undefined as any,
        product_id: productId || null,
        quantity,
        total_amount: totalAmount,
        profit,
        payment_method: paymentMethod,
        recorded_by: recordedBy,
        notes,
        date
      };
      await db.revenues.save(rev);

      // Deduct stock if a product was sold!
      if (productId) {
        const p = products.find(prod => prod.id === productId);
        if (p) {
          const newStock = Math.max(0, p.stock - quantity);
          await db.products.save({ ...p, stock: newStock });
        }
      }
      
      // Reset
      setProductId('');
      setQuantity(1);
      setTotalAmount(0);
      setNotes('');
      onSave();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar registro de venta?')) return;
    try {
      await db.revenues.delete(id);
      onSave();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.8fr', gap: '32px' }}>
      
      {/* Form */}
      <div className="card">
        <h3 style={{ fontSize: '18px', color: 'var(--text-primary)', marginBottom: '20px' }}>Registrar Venta / Ingreso</h3>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="form-group">
            <label className="form-label">Fecha</label>
            <input type="date" className="form-input" value={date} onChange={e => setDate(e.target.value)} required />
          </div>

          <div className="form-group">
            <label className="form-label">Prenda / Producto</label>
            <select className="form-select" value={productId} onChange={e => handleProductChange(e.target.value)}>
              <option value="">-- Venta General / Bazar (Sin asociar prenda) --</option>
              {products.map(p => (
                <option key={p.id} value={p.id}>{p.name} (Stock: {p.stock})</option>
              ))}
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '12px' }}>
            <div className="form-group">
              <label className="form-label">Cantidad</label>
              <input type="number" min="1" className="form-input" value={quantity} onChange={e => setQuantity(Number(e.target.value))} required />
            </div>

            <div className="form-group">
              <label className="form-label">Método Pago</label>
              <select className="form-select" value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)}>
                <option value="Cash">Efectivo / Cash</option>
                <option value="Card">Tarjeta / Transf</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '12px' }}>
            <div className="form-group">
              <label className="form-label">Monto de Venta (Total MXN)</label>
              <input type="number" step="0.01" className="form-input" value={totalAmount} onChange={e => setTotalAmount(Number(e.target.value))} required />
            </div>

            <div className="form-group">
              <label className="form-label">Registró Venta</label>
              <select className="form-select" value={recordedBy} onChange={e => setRecordedBy(e.target.value)}>
                <option value="Tani">Tani</option>
                <option value="Maripy">Maripy</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Notas / Comprador</label>
            <input type="text" className="form-input" value={notes} onChange={e => setNotes(e.target.value)} placeholder="Ej: Venta en Bazar local" />
          </div>

          <button type="submit" className="btn btn-primary" style={{ marginTop: '8px' }}>
            Registrar Venta
          </button>
        </form>
      </div>

      {/* List */}
      <div className="card">
        <h3 style={{ fontSize: '18px', color: 'var(--text-primary)', marginBottom: '20px' }}>Historial de Ventas</h3>
        
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
              <th style={{ padding: '8px 12px', textAlign: 'left' }}>Fecha</th>
              <th style={{ padding: '8px 12px', textAlign: 'left' }}>Detalle</th>
              <th style={{ padding: '8px 12px', textAlign: 'left' }}>Método</th>
              <th style={{ padding: '8px 12px', textAlign: 'left' }}>Vendedor</th>
              <th style={{ padding: '8px 12px', textAlign: 'left' }}>Total</th>
              <th style={{ padding: '8px 12px', textAlign: 'left' }}>Ganancia Est.</th>
              <th style={{ padding: '8px 12px', textAlign: 'right' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {revenues.map(r => (
              <tr key={r.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '12px 8px' }}>{r.date}</td>
                <td style={{ padding: '12px 8px', fontWeight: 600, color: 'var(--text-primary)' }}>
                  {r.product_name} {r.quantity > 1 && `(x${r.quantity})`}
                  {r.notes && <span style={{ display: 'block', fontSize: '11px', fontWeight: 'normal', color: 'var(--text-muted)' }}>{r.notes}</span>}
                </td>
                <td style={{ padding: '12px 8px' }}>{r.payment_method}</td>
                <td style={{ padding: '12px 8px' }}>{r.recorded_by}</td>
                <td style={{ padding: '12px 8px', fontWeight: 600, color: 'var(--success)' }}>
                  +${r.total_amount.toLocaleString('es-MX')}
                </td>
                <td style={{ padding: '12px 8px', color: 'var(--accent)' }}>
                  +${r.profit.toLocaleString('es-MX')}
                </td>
                <td style={{ padding: '12px 8px', textAlign: 'right' }}>
                  <button onClick={() => handleDelete(r.id)} className="btn btn-danger" style={{ padding: '4px 8px', fontSize: '11px' }}>
                    <Trash2 size={12} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}
