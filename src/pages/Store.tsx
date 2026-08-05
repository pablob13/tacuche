import { useState, useEffect } from 'react';
import { db, isUsingMock } from '../lib/db';
import type { Product, StoreSettings } from '../types';
import { ShoppingBag, Trash2, Lock, Database } from 'lucide-react';
import { Link } from 'react-router-dom';

interface CartItem {
  product: Product;
  quantity: number;
}

export default function Store() {
  const [products, setProducts] = useState<Product[]>([]);
  const [settings, setSettings] = useState<StoreSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card'>('cash');
  const [filterDesigner, setFilterDesigner] = useState<string>('all');

  useEffect(() => {
    async function loadStoreData() {
      try {
        const [productsData, settingsData] = await Promise.all([
          db.products.getAll(),
          db.settings.get()
        ]);
        setProducts(productsData.filter(p => p.is_active));
        setSettings(settingsData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadStoreData();
  }, []);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        if (existing.quantity >= product.stock) return prev;
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const updateCartQuantity = (productId: string, delta: number) => {
    setCart(prev =>
      prev
        .map(item => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            if (newQty > item.product.stock) return item;
            return { ...item, quantity: newQty };
          }
          return item;
        })
        .filter(item => item.quantity > 0)
    );
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => {
      const price = paymentMethod === 'cash'
        ? (item.product.price_cash || 0)
        : (item.product.price_card || 0);
      return total + price * item.quantity;
    }, 0);
  };

  const handleCheckout = () => {
    const phone = settings?.whatsapp_number || '525500000000';
    let message = `*¡Hola Tacuche!* 🛍️✨\nMe interesa comprar las siguientes prendas:\n\n`;
    
    cart.forEach(item => {
      const price = paymentMethod === 'cash' ? item.product.price_cash : item.product.price_card;
      message += `• *${item.product.name}* (Cant: ${item.quantity}) - $${price?.toLocaleString('es-MX')} MXN c/u\n`;
    });

    const total = getCartTotal();
    message += `\n*Método de pago deseado:* ${paymentMethod === 'cash' ? 'Efectivo (Cash)' : 'Tarjeta / Transferencia'}\n`;
    message += `*Total estimado:* $${total.toLocaleString('es-MX')} MXN\n\n¿Están disponibles? ¡Gracias!`;

    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/${phone}?text=${encoded}`, '_blank');
  };

  // Filter products by designer
  const filteredProducts = filterDesigner === 'all' 
    ? products 
    : products.filter(p => p.designer.toLowerCase() === filterDesigner.toLowerCase());

  return (
    <div className="store-container fade-in" style={{ 
      backgroundColor: 'var(--bg-primary)', 
      color: 'var(--text-primary)', 
      fontFamily: "'Outfit', sans-serif",
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Dynamic Fonts Import */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,400&family=Outfit:wght@300;400;500;600;700&display=swap');
        
        .lookbook-link {
          font-size: 13px;
          font-weight: 500;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          color: var(--text-primary);
          text-decoration: none;
          position: relative;
          transition: opacity 0.2s ease;
        }
        .lookbook-link:hover {
          opacity: 0.7;
        }
        .lookbook-link::after {
          content: '';
          position: absolute;
          width: 0;
          height: 1px;
          bottom: -4px;
          left: 0;
          background-color: var(--text-primary);
          transition: width 0.2s ease;
        }
        .lookbook-link:hover::after {
          width: 100%;
        }
        .category-card {
          position: relative;
          overflow: hidden;
          aspect-ratio: 3/4;
          cursor: pointer;
          border-radius: 4px;
        }
        .category-card img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.8s cubic-bezier(0.25, 1, 0.5, 1);
        }
        .category-card:hover img {
          transform: scale(1.04);
        }
        .product-card {
          display: flex;
          flex-direction: column;
          border: none;
          background: transparent;
          transition: transform 0.3s ease;
        }
        .product-card:hover {
          transform: translateY(-2px);
        }
        .product-img-container {
          position: relative;
          width: 100%;
          aspect-ratio: 3/4;
          background-color: var(--bg-secondary);
          overflow: hidden;
          border-radius: 4px;
        }
        .product-img-container img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.6s cubic-bezier(0.25, 1, 0.5, 1);
        }
        .product-card:hover .product-img-container img {
          transform: scale(1.03);
        }
      `}</style>

      {/* Demo Warning Banner */}
      {isUsingMock && (
        <div style={{
          backgroundColor: 'var(--accent-glow)',
          borderBottom: '1px solid var(--accent)',
          padding: '8px 16px',
          fontSize: '12px',
          textAlign: 'center',
          color: 'var(--accent)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '8px',
          zIndex: 100
        }}>
          <Database size={13} />
          <span>Modo Demo (Almacenamiento Local). Los datos se guardan en el navegador.</span>
        </div>
      )}

      {/* Minimalist Premium Header (Alo Yoga style) */}
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        backgroundColor: 'rgba(253, 252, 251, 0.95)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--border-color)',
        padding: '0 32px',
        height: '80px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        {/* Brand Logo */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <img src="/logo-black.png" alt="TACUCHE" style={{ height: '42px', objectFit: 'contain' }} />
        </div>

        {/* Center navigation */}
        <nav style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
          <a href="#lookbook-banner" className="lookbook-link">Estudio</a>
          <a href="#popular-categories" className="lookbook-link">Populares</a>
          <a href="#product-catalog" className="lookbook-link">Colección</a>
          {settings?.instagram_url && (
            <a href={settings.instagram_url} target="_blank" rel="noreferrer" className="lookbook-link" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '4px' }}>
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
              Instagram
            </a>
          )}
        </nav>

        {/* Action icons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <Link to="/admin" style={{ color: 'var(--text-primary)', display: 'flex', alignItems: 'center' }} title="Administración">
            <Lock size={18} />
          </Link>
          
          <button 
            onClick={() => setIsCartOpen(true)}
            style={{ 
              background: 'none', 
              border: 'none', 
              color: 'var(--text-primary)', 
              cursor: 'pointer',
              position: 'relative',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <ShoppingBag size={20} />
            {cart.length > 0 && (
              <span style={{
                position: 'absolute',
                top: '-8px',
                right: '-8px',
                backgroundColor: 'var(--text-primary)',
                color: 'var(--bg-primary)',
                borderRadius: '50%',
                width: '18px',
                height: '18px',
                fontSize: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700
              }}>
                {cart.reduce((s, i) => s + i.quantity, 0)}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Mega Hero Banner Lookbook */}
      <section id="lookbook-banner" style={{
        position: 'relative',
        height: '75vh',
        width: '100%',
        backgroundColor: '#111',
        overflow: 'hidden'
      }}>
        {/* Background looking model photo */}
        <img 
          src={settings?.hero_banner_url || "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1200&auto=format&fit=crop"} 
          alt="Tacuche Lookbook" 
          style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.65, objectPosition: 'center 30%' }}
        />
        
        {/* Overlay Dark/Beige Gradient */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(to bottom, rgba(9, 10, 15, 0.1) 0%, rgba(9, 10, 15, 0.7) 100%)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          padding: '64px 48px'
        }}>
          <div style={{ maxWidth: '700px' }}>
            <span style={{ 
              fontFamily: "'Outfit', sans-serif", 
              textTransform: 'uppercase', 
              letterSpacing: '3px', 
              fontSize: '12px', 
              color: '#d6af37', 
              fontWeight: 600,
              display: 'block',
              marginBottom: '16px'
            }}>
              Atelier Co-Diseñado
            </span>
            <h1 style={{ 
              fontFamily: "'Cormorant Garamond', serif", 
              fontSize: 'clamp(36px, 6vw, 64px)', 
              color: '#fff', 
              margin: '0 0 16px 0', 
              fontWeight: 300,
              lineHeight: 1.1
            }}>
              {settings?.store_title || 'Colección de Autor'}
            </h1>
            <p style={{ 
              color: '#eae9e5', 
              fontSize: '15px', 
              fontWeight: 300, 
              lineHeight: 1.6, 
              marginBottom: '28px',
              fontFamily: "'Outfit', sans-serif"
            }}>
              {settings?.store_subtitle || 'Prendas exclusivas confeccionadas a mano. Cada pieza es única y diseñada con pasión por nuestro estudio. Cotiza tu pedido y finaliza por WhatsApp.'}
            </p>
            <a 
              href="#product-catalog" 
              className="btn" 
              style={{ 
                display: 'inline-block',
                backgroundColor: '#fff', 
                color: '#111', 
                fontWeight: 600, 
                padding: '14px 28px', 
                borderRadius: '0', 
                textTransform: 'uppercase', 
                letterSpacing: '2px', 
                fontSize: '11px',
                textDecoration: 'none'
              }}
            >
              Comprar la Colección
            </a>
          </div>
        </div>
      </section>

      {/* Featured Categories (LO MÁS POPULAR) */}
      <section id="popular-categories" style={{ padding: '64px 32px 32px 32px' }}>
        <h2 style={{
          textAlign: 'center',
          fontFamily: "'Outfit', sans-serif",
          fontSize: '18px',
          letterSpacing: '3px',
          fontWeight: 600,
          textTransform: 'uppercase',
          marginBottom: '32px',
          color: 'var(--text-primary)'
        }}>
          Lo Más Popular
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '24px'
        }}>
          {/* Category Corsets */}
          <div className="category-card" onClick={() => setFilterDesigner('all')}>
            <img src={settings?.category_corsets_url || "https://images.unsplash.com/photo-1618220179428-22790b461013?q=80&w=600&auto=format&fit=crop"} alt="Corsets" />
            <div style={{ position: 'absolute', bottom: '16px', left: '16px', color: '#fff' }}>
              <span style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase' }}>Corsets</span>
            </div>
          </div>

          {/* Category Suéteres */}
          <div className="category-card" onClick={() => setFilterDesigner('all')}>
            <img src={settings?.category_sueteres_url || "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=600&auto=format&fit=crop"} alt="Suéteres" />
            <div style={{ position: 'absolute', bottom: '16px', left: '16px', color: '#fff' }}>
              <span style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase' }}>Suéteres</span>
            </div>
          </div>

          {/* Category Pantalones */}
          <div className="category-card" onClick={() => setFilterDesigner('all')}>
            <img src={settings?.category_pantalones_url || "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=600&auto=format&fit=crop"} alt="Pantalones" />
            <div style={{ position: 'absolute', bottom: '16px', left: '16px', color: '#fff' }}>
              <span style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase' }}>Pantalones</span>
            </div>
          </div>

          {/* Category Faldas */}
          <div className="category-card" onClick={() => setFilterDesigner('all')}>
            <img src={settings?.category_faldas_url || "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=600&auto=format&fit=crop"} alt="Faldas" />
            <div style={{ position: 'absolute', bottom: '16px', left: '16px', color: '#fff' }}>
              <span style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase' }}>Faldas</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Catalog Section */}
      <section id="product-catalog" style={{ padding: '48px 32px 64px 32px', flex: 1 }}>
        
        {/* Designer filter & Header */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          borderBottom: '1px solid var(--border-color)', 
          paddingBottom: '16px',
          marginBottom: '32px'
        }}>
          <h3 style={{ 
            fontFamily: "'Cormorant Garamond', serif", 
            fontSize: '28px', 
            fontWeight: 400 
          }}>
            Catálogo de Prendas
          </h3>

          {/* Filters buttons */}
          <div style={{ display: 'flex', gap: '12px' }}>
            <button 
              onClick={() => setFilterDesigner('all')} 
              className={`btn ${filterDesigner === 'all' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ padding: '6px 14px', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', borderRadius: '0' }}
            >
              Todos
            </button>
            <button 
              onClick={() => setFilterDesigner('Tani')} 
              className={`btn ${filterDesigner === 'Tani' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ padding: '6px 14px', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', borderRadius: '0' }}
            >
              Diseños Tani
            </button>
            <button 
              onClick={() => setFilterDesigner('Maripy')} 
              className={`btn ${filterDesigner === 'Maripy' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ padding: '6px 14px', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', borderRadius: '0' }}
            >
              Diseños Maripy
            </button>
          </div>
        </div>

        {/* Loading Spinner */}
        {loading ? (
          <div className="flex-center" style={{ minHeight: '300px', flexDirection: 'column', gap: '16px' }}>
            <div className="spinner" style={{
              width: '32px',
              height: '32px',
              border: '2px solid var(--border-color)',
              borderTopColor: 'var(--accent)',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }}></div>
            <p className="text-muted" style={{ fontSize: '12px', letterSpacing: '1px' }}>CARGANDO...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '64px 24px', border: '1px dashed var(--border-color)', borderRadius: '4px' }}>
            <ShoppingBag size={32} style={{ color: 'var(--text-muted)', marginBottom: '16px' }} />
            <h3 style={{ marginBottom: '8px', fontWeight: 500 }}>No hay productos disponibles</h3>
            <p className="text-muted" style={{ fontSize: '13px' }}>Vuelve a consultar el catálogo de Tacuche más tarde.</p>
          </div>
        ) : (
          /* Products Grid */
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: '32px'
          }}>
            {filteredProducts.map(product => {
              const hasStock = product.stock > 0;
              const mainImage = product.images && product.images[0] 
                ? product.images[0] 
                : 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=600&auto=format&fit=crop';

              return (
                <div key={product.id} className="product-card">
                  {/* Image container */}
                  <div className="product-img-container">
                    <img src={mainImage} alt={product.name} />
                    
                    {/* Designer Badge */}
                    <span style={{
                      position: 'absolute',
                      bottom: '12px',
                      left: '12px',
                      padding: '3px 8px',
                      fontSize: '10px',
                      fontWeight: 600,
                      backgroundColor: 'rgba(253, 252, 251, 0.95)',
                      border: '1px solid var(--border-color)',
                      color: 'var(--text-primary)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>
                      Atelier: {product.designer}
                    </span>

                    {/* Stock status overlay */}
                    {!hasStock && (
                      <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(253, 252, 251, 0.7)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <span style={{ 
                          fontSize: '11px', 
                          fontWeight: 600, 
                          letterSpacing: '2px', 
                          textTransform: 'uppercase',
                          color: '#ef4444',
                          border: '1px solid #ef4444',
                          padding: '6px 12px'
                        }}>
                          Agotado
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Body Content */}
                  <div style={{ padding: '16px 0', display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                      <h4 style={{ 
                        fontSize: '14px', 
                        fontWeight: 500, 
                        letterSpacing: '0.5px',
                        textTransform: 'uppercase',
                        margin: 0,
                        color: 'var(--text-primary)'
                      }}>
                        {product.name}
                      </h4>
                      <span style={{ 
                        fontSize: '14px', 
                        fontWeight: 600, 
                        color: 'var(--text-primary)' 
                      }}>
                        ${(product.price_cash || 0).toLocaleString('es-MX')} MXN
                      </span>
                    </div>

                    <p style={{
                      fontSize: '12px',
                      color: 'var(--text-secondary)',
                      lineHeight: '1.5',
                      margin: '0 0 16px 0',
                      flex: 1,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}>
                      {product.description || 'Prenda exclusiva diseñada en nuestro atelier.'}
                    </p>

                    {/* Add to Bag Button */}
                    <button
                      onClick={() => addToCart(product)}
                      disabled={!hasStock}
                      className="btn btn-primary"
                      style={{
                        borderRadius: '0',
                        fontSize: '11px',
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        letterSpacing: '1.5px',
                        padding: '10px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px'
                      }}
                    >
                      <ShoppingBag size={13} />
                      Añadir a Bolsa
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Slide-out Shopping Cart */}
      {isCartOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.3)',
          backdropFilter: 'blur(4px)',
          zIndex: 100,
          display: 'flex',
          justifyContent: 'flex-end'
        }} onClick={() => setIsCartOpen(false)}>
          
          <div style={{
            width: '100%',
            maxWidth: '420px',
            backgroundColor: 'var(--bg-primary)',
            height: '100%',
            boxShadow: '-4px 0 30px rgba(0,0,0,0.15)',
            display: 'flex',
            flexDirection: 'column',
            padding: '32px'
          }} onClick={e => e.stopPropagation()}>
            
            {/* Cart Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px', marginBottom: '24px' }}>
              <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '24px', margin: 0, fontWeight: 400 }}>Bolsa de Compras</h3>
              <button onClick={() => setIsCartOpen(false)} style={{ background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer', color: 'var(--text-secondary)' }}>&times;</button>
            </div>

            {/* Cart Items List */}
            <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '20px', paddingRight: '4px' }}>
              {cart.map(item => (
                <div key={item.product.id} style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                  <img 
                    src={item.product.images && item.product.images[0] ? item.product.images[0] : 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=600&auto=format&fit=crop'} 
                    alt={item.product.name} 
                    style={{ width: '64px', height: '80px', objectFit: 'cover', borderRadius: '2px' }}
                  />
                  <div style={{ flex: 1 }}>
                    <h4 style={{ fontSize: '13px', fontWeight: 500, margin: '0 0 4px 0', textTransform: 'uppercase', color: 'var(--text-primary)' }}>{item.product.name}</h4>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>
                      ${((paymentMethod === 'cash' ? item.product.price_cash : item.product.price_card) || 0).toLocaleString('es-MX')} c/u
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <button onClick={() => updateCartQuantity(item.product.id, -1)} style={{ background: 'none', border: '1px solid var(--border-color)', borderRadius: '50%', width: '22px', height: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>-</button>
                      <span style={{ fontSize: '13px', fontWeight: 500 }}>{item.quantity}</span>
                      <button onClick={() => updateCartQuantity(item.product.id, 1)} style={{ background: 'none', border: '1px solid var(--border-color)', borderRadius: '50%', width: '22px', height: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>+</button>
                    </div>
                  </div>
                  <button onClick={() => removeFromCart(item.product.id)} style={{ background: 'none', border: 'none', color: 'var(--error)', cursor: 'pointer' }}><Trash2 size={16} /></button>
                </div>
              ))}

              {cart.length === 0 && (
                <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
                  Tu bolsa está vacía.
                </div>
              )}
            </div>

            {/* Cart Footer */}
            {cart.length > 0 && (
              <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '20px', marginTop: '24px' }}>
                {/* Payment method selector */}
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '8px' }}>Método de Pago</label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    <button 
                      onClick={() => setPaymentMethod('cash')} 
                      style={{ 
                        padding: '10px', 
                        fontSize: '11px', 
                        fontWeight: 600, 
                        textTransform: 'uppercase', 
                        letterSpacing: '0.5px',
                        border: '1px solid var(--border-color)',
                        backgroundColor: paymentMethod === 'cash' ? 'var(--text-primary)' : 'transparent',
                        color: paymentMethod === 'cash' ? 'var(--bg-primary)' : 'var(--text-primary)',
                        cursor: 'pointer'
                      }}
                    >
                      Efectivo
                    </button>
                    <button 
                      onClick={() => setPaymentMethod('card')} 
                      style={{ 
                        padding: '10px', 
                        fontSize: '11px', 
                        fontWeight: 600, 
                        textTransform: 'uppercase', 
                        letterSpacing: '0.5px',
                        border: '1px solid var(--border-color)',
                        backgroundColor: paymentMethod === 'card' ? 'var(--text-primary)' : 'transparent',
                        color: paymentMethod === 'card' ? 'var(--bg-primary)' : 'var(--text-primary)',
                        cursor: 'pointer'
                      }}
                    >
                      Tarjeta / Transf.
                    </button>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <span style={{ fontSize: '13px', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '1px' }}>Total Estimado:</span>
                  <span style={{ fontSize: '20px', fontWeight: 600 }}>${getCartTotal().toLocaleString('es-MX')} MXN</span>
                </div>

                <button 
                  onClick={handleCheckout}
                  style={{
                    width: '100%',
                    backgroundColor: 'var(--text-primary)',
                    color: 'var(--bg-primary)',
                    border: 'none',
                    padding: '14px',
                    fontSize: '12px',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '2px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}
                >
                  Pedido por WhatsApp
                </button>
              </div>
            )}

          </div>
        </div>
      )}

      {/* Aesthetic Minimal Footer */}
      <footer style={{
        backgroundColor: 'var(--bg-secondary)',
        borderTop: '1px solid var(--border-color)',
        padding: '48px 32px',
        textAlign: 'center',
        fontSize: '13px',
        color: 'var(--text-secondary)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', marginBottom: '16px' }}>
          <img src="/logo-black.png" alt="TACUCHE" style={{ height: '36px', objectFit: 'contain' }} />
        </div>
        <p style={{ margin: '0 0 12px 0' }}>Diseño y Confección Lenta en Ciudad de México</p>
        <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: 0 }}>&copy; {new Date().getFullYear()} Tacuche. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}
