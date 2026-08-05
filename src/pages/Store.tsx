import { useState, useEffect } from 'react';
import { db, isUsingMock } from '../lib/db';
import type { Product } from '../types';
import { ShoppingBag, Trash2, Lock, Plus, Minus, Check, Database } from 'lucide-react';
import { Link } from 'react-router-dom';

interface CartItem {
  product: Product;
  quantity: number;
}

export default function Store() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card'>('cash');

  useEffect(() => {
    async function loadProducts() {
      try {
        const data = await db.products.getAll();
        // Only active and in-stock or catalog-ready items
        setProducts(data.filter(p => p.is_active));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, []);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        // Limit by stock
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
            // Check stock limits
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
    const phone = '5215555555555'; // Default WhatsApp number, user can configure or we can pull from settings
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

  return (
    <div className="store-container fade-in" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      
      {/* Demo Warning Banner */}
      {isUsingMock && (
        <div style={{
          backgroundColor: 'var(--accent-glow)',
          borderBottom: '1px solid var(--accent)',
          padding: '8px 16px',
          fontSize: '13px',
          textAlign: 'center',
          color: 'var(--accent)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '8px'
        }}>
          <Database size={14} />
          <span>Ejecutando en Modo de Demostración (Almacenamiento Local). Los datos se guardan en este navegador.</span>
        </div>
      )}

      {/* Navigation */}
      <header className="glass" style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        borderBottom: '1px solid var(--border-color)',
        padding: '16px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <img src="/logo.png" alt="TACUCHE" style={{ height: '48px', objectFit: 'contain' }} />
          <span style={{
            fontSize: '11px',
            letterSpacing: '1px',
            color: 'var(--text-muted)',
            textTransform: 'uppercase',
            border: '1px solid var(--border-color)',
            padding: '2px 8px',
            borderRadius: '4px'
          }}>
            Estudio de Ropa
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Link to="/admin" className="btn btn-secondary" style={{ padding: '8px 14px', fontSize: '13px' }}>
            <Lock size={14} style={{ marginRight: '6px' }} />
            Administrador
          </Link>

          <button
            onClick={() => setIsCartOpen(true)}
            className="btn btn-primary"
            style={{ padding: '8px 16px', position: 'relative' }}
          >
            <ShoppingBag size={16} />
            <span style={{ marginLeft: '4px', fontWeight: 600 }}>Carrito</span>
            {cart.length > 0 && (
              <span style={{
                position: 'absolute',
                top: '-6px',
                right: '-6px',
                backgroundColor: '#ef4444',
                color: '#fff',
                borderRadius: '50%',
                width: '20px',
                height: '20px',
                fontSize: '11px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
              }}>
                {cart.reduce((s, i) => s + i.quantity, 0)}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Hero Header */}
      <section style={{
        padding: '64px 24px',
        textAlign: 'center',
        background: 'radial-gradient(circle at 50% 50%, rgba(214, 175, 55, 0.08) 0%, transparent 60%)',
        borderBottom: '1px solid var(--border-color)'
      }}>
        <h2 style={{ fontSize: '48px', marginBottom: '16px', color: '#fff', fontFamily: 'var(--font-heading)' }}>
          Colección de Autor
        </h2>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto', fontSize: '15px' }}>
          Prendas exclusivas confeccionadas a mano. Cada pieza es única y diseñada con pasión por nuestro estudio. Cotiza tu pedido y finaliza por WhatsApp.
        </p>
      </section>

      {/* Main Catalog */}
      <main className="container" style={{ padding: '48px 24px', flex: 1 }}>
        {loading ? (
          <div className="flex-center" style={{ minHeight: '300px', flexDirection: 'column', gap: '16px' }}>
            <div className="spinner" style={{
              width: '40px',
              height: '40px',
              border: '3px solid var(--border-color)',
              borderTopColor: 'var(--accent)',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }}></div>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            <p className="text-muted">Cargando catálogo...</p>
          </div>
        ) : products.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '64px 24px', border: '1px dashed var(--border-color)', borderRadius: '16px' }}>
            <ShoppingBag size={48} style={{ color: 'var(--text-muted)', marginBottom: '16px' }} />
            <h3 style={{ color: '#fff', marginBottom: '8px' }}>Catálogo vacío</h3>
            <p className="text-muted">No hay prendas disponibles en este momento. Vuelve pronto.</p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '32px'
          }}>
            {products.map(product => {
              const hasStock = product.stock > 0;
              return (
                <div key={product.id} className="card" style={{
                  padding: 0,
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  height: '100%',
                  background: 'var(--bg-card)',
                  borderColor: 'var(--border-color)'
                }}>
                  {/* Image container */}
                  <div style={{ width: '100%', height: '320px', backgroundColor: '#111', position: 'relative', overflow: 'hidden' }}>
                    {product.images && product.images[0] ? (
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
                        onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'}
                        onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
                      />
                    ) : (
                      <div className="flex-center" style={{ width: '100%', height: '100%', color: 'var(--text-muted)' }}>
                        <ShoppingBag size={40} />
                      </div>
                    )}
                    
                    {/* Badge Stock */}
                    <span style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      padding: '4px 10px',
                      borderRadius: '4px',
                      fontSize: '11px',
                      fontWeight: 600,
                      backgroundColor: hasStock ? 'rgba(16, 185, 129, 0.9)' : 'rgba(239, 68, 68, 0.9)',
                      color: '#fff'
                    }}>
                      {hasStock ? `${product.stock} disponibles` : 'Agotado'}
                    </span>

                    {/* Designer Badge */}
                    <span style={{
                      position: 'absolute',
                      bottom: '12px',
                      left: '12px',
                      padding: '4px 10px',
                      borderRadius: '4px',
                      fontSize: '11px',
                      fontWeight: 500,
                      backgroundColor: 'rgba(9, 10, 15, 0.85)',
                      border: '1px solid var(--border-color)',
                      color: 'var(--accent)'
                    }}>
                      Diseño: {product.designer}
                    </span>
                  </div>

                  {/* Body Content */}
                  <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <h3 style={{ fontSize: '18px', color: '#fff', marginBottom: '8px', fontWeight: 500 }}>
                      {product.name}
                    </h3>
                    <p style={{
                      fontSize: '13px',
                      color: 'var(--text-secondary)',
                      marginBottom: '16px',
                      flex: 1,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}>
                      {product.description || 'Prenda exclusiva del atelier Tacuche.'}
                    </p>

                    {/* Pricing */}
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-end',
                      borderTop: '1px solid var(--border-color)',
                      paddingTop: '16px',
                      marginBottom: '16px'
                    }}>
                      <div>
                        <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block' }}>Efectivo / Cash</span>
                        <strong style={{ fontSize: '20px', color: 'var(--accent)', fontWeight: 600 }}>
                          ${product.price_cash?.toLocaleString('es-MX')}
                        </strong>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block' }}>Tarjeta / Transf</span>
                        <span style={{ fontSize: '15px', color: 'var(--text-secondary)', fontWeight: 500 }}>
                          ${product.price_card?.toLocaleString('es-MX')}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => addToCart(product)}
                      disabled={!hasStock}
                      className="btn btn-primary"
                      style={{ width: '100%', padding: '10px' }}
                    >
                      {hasStock ? 'Agregar al carrito' : 'No disponible'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Cart Sidebar Drawer */}
      {isCartOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          backdropFilter: 'blur(4px)',
          zIndex: 100,
          display: 'flex',
          justifyContent: 'flex-end'
        }} onClick={() => setIsCartOpen(false)}>
          <div style={{
            width: '100%',
            maxWidth: '450px',
            height: '100%',
            backgroundColor: 'var(--bg-secondary)',
            borderLeft: '1px solid var(--border-color)',
            padding: '28px',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: 'var(--shadow-lg)'
          }} onClick={e => e.stopPropagation()}>
            {/* Header */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '24px',
              borderBottom: '1px solid var(--border-color)',
              paddingBottom: '16px'
            }}>
              <h3 style={{ fontSize: '22px', color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShoppingBag size={20} className="text-accent" />
                Mi Carrito
              </h3>
              <button
                onClick={() => setIsCartOpen(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                  fontSize: '20px'
                }}
              >
                &times;
              </button>
            </div>

            {/* List */}
            <div style={{ flex: 1, overflowY: 'auto', marginBottom: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {cart.length === 0 ? (
                <div className="flex-center" style={{ height: '80%', flexDirection: 'column', color: 'var(--text-muted)' }}>
                  <ShoppingBag size={48} style={{ marginBottom: '16px' }} />
                  <p>Tu carrito está vacío</p>
                </div>
              ) : (
                cart.map(item => {
                  const itemPrice = paymentMethod === 'cash'
                    ? (item.product.price_cash || 0)
                    : (item.product.price_card || 0);
                  return (
                    <div key={item.product.id} style={{
                      display: 'flex',
                      gap: '16px',
                      backgroundColor: 'var(--bg-card)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '8px',
                      padding: '12px'
                    }}>
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        style={{ width: '70px', height: '70px', objectFit: 'cover', borderRadius: '4px' }}
                      />
                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                        <div>
                          <h4 style={{ fontSize: '14px', color: '#fff', margin: 0 }}>{item.product.name}</h4>
                          <span style={{ fontSize: '12px', color: 'var(--accent)' }}>
                            ${itemPrice.toLocaleString('es-MX')} MXN
                          </span>
                        </div>
                        
                        {/* Qty controls */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <button
                            onClick={() => updateCartQuantity(item.product.id, -1)}
                            style={{
                              background: 'var(--bg-secondary)',
                              border: '1px solid var(--border-color)',
                              color: 'var(--text-primary)',
                              cursor: 'pointer',
                              width: '24px',
                              height: '24px',
                              borderRadius: '4px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                          >
                            <Minus size={10} />
                          </button>
                          <span style={{ fontSize: '13px', fontWeight: 600 }}>{item.quantity}</span>
                          <button
                            onClick={() => updateCartQuantity(item.product.id, 1)}
                            style={{
                              background: 'var(--bg-secondary)',
                              border: '1px solid var(--border-color)',
                              color: 'var(--text-primary)',
                              cursor: 'pointer',
                              width: '24px',
                              height: '24px',
                              borderRadius: '4px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                          >
                            <Plus size={10} />
                          </button>
                        </div>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: 'var(--error)',
                          cursor: 'pointer',
                          alignSelf: 'center',
                          padding: '8px'
                        }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  );
                })
              )}
            </div>

            {/* Bottom Actions */}
            {cart.length > 0 && (
              <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '20px' }}>
                {/* Payment Selector */}
                <div style={{ marginBottom: '16px' }}>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>
                    Método de Pago
                  </span>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '10px',
                    backgroundColor: 'var(--bg-secondary)',
                    padding: '4px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-color)'
                  }}>
                    <button
                      onClick={() => setPaymentMethod('cash')}
                      style={{
                        padding: '8px',
                        borderRadius: '6px',
                        border: 'none',
                        cursor: 'pointer',
                        fontWeight: 600,
                        fontSize: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        backgroundColor: paymentMethod === 'cash' ? 'var(--accent)' : 'transparent',
                        color: paymentMethod === 'cash' ? '#000' : 'var(--text-secondary)'
                      }}
                    >
                      {paymentMethod === 'cash' && <Check size={12} />}
                      Efectivo (Descuento)
                    </button>
                    <button
                      onClick={() => setPaymentMethod('card')}
                      style={{
                        padding: '8px',
                        borderRadius: '6px',
                        border: 'none',
                        cursor: 'pointer',
                        fontWeight: 600,
                        fontSize: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        backgroundColor: paymentMethod === 'card' ? 'var(--accent)' : 'transparent',
                        color: paymentMethod === 'card' ? '#000' : 'var(--text-secondary)'
                      }}
                    >
                      {paymentMethod === 'card' && <Check size={12} />}
                      Tarjeta / Transferencia
                    </button>
                  </div>
                </div>

                {/* Total */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '20px'
                }}>
                  <span style={{ fontSize: '16px', color: 'var(--text-secondary)' }}>Total:</span>
                  <strong style={{ fontSize: '24px', color: '#fff' }}>
                    ${getCartTotal().toLocaleString('es-MX')} MXN
                  </strong>
                </div>

                <button
                  onClick={handleCheckout}
                  className="btn btn-primary"
                  style={{ width: '100%', padding: '12px', fontSize: '15px' }}
                >
                  Confirmar y enviar WhatsApp
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <footer style={{
        padding: '32px 24px',
        textAlign: 'center',
        borderTop: '1px solid var(--border-color)',
        color: 'var(--text-muted)',
        fontSize: '13px',
        backgroundColor: 'var(--bg-secondary)'
      }}>
        <p>© 2026 TACUCHE Estudio. Todos los derechos reservados.</p>
        <p style={{ marginTop: '4px' }}>Hecho en México. Confección ética artesanal.</p>
      </footer>
    </div>
  );
}
