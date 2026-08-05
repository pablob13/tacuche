import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Lock, ArrowLeft, Key, Mail, Database } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (!isSupabaseConfigured) {
      // Simulate login for demo mode
      setTimeout(() => {
        setLoading(false);
        // Save demo auth status in session storage
        sessionStorage.setItem('tacuche_admin_logged', 'true');
        navigate('/admin');
      }, 800);
      return;
    }

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      if (error) throw error;
      navigate('/admin');
    } catch (err: any) {
      setError(err.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = () => {
    sessionStorage.setItem('tacuche_admin_logged', 'true');
    navigate('/admin');
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '24px',
      background: 'radial-gradient(circle at center, var(--bg-card) 0%, var(--bg-primary) 100%)'
    }}>
      
      {/* Return to Store */}
      <Link to="/" style={{
        position: 'absolute',
        top: '24px',
        left: '24px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        color: 'var(--text-secondary)',
        fontSize: '14px',
        fontWeight: 500
      }}>
        <ArrowLeft size={16} />
        Volver a la tienda
      </Link>

      <div className="card fade-in" style={{
        width: '100%',
        maxWidth: '400px',
        padding: '36px',
        border: '1px solid var(--border-color)',
        boxShadow: 'var(--shadow-lg)'
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div className="flex-center" style={{
            width: '64px',
            height: '64px',
            borderRadius: '16px',
            backgroundColor: 'var(--accent-glow)',
            color: 'var(--accent)',
            margin: '0 auto 16px auto',
            border: '1px solid rgba(214, 175, 55, 0.3)'
          }}>
            <Lock size={28} />
          </div>
          <h2 style={{ fontSize: '24px', color: '#fff', marginBottom: '8px' }}>Atelier Tacuche</h2>
          <p className="text-muted" style={{ fontSize: '14px' }}>Panel de Control del Negocio</p>
        </div>

        {/* Setup Status Banner */}
        {!isSupabaseConfigured && (
          <div style={{
            backgroundColor: 'rgba(245, 158, 11, 0.1)',
            border: '1px solid rgba(245, 158, 11, 0.2)',
            borderRadius: '8px',
            padding: '12px',
            marginBottom: '24px',
            fontSize: '12px',
            color: 'var(--warning)',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '8px'
          }}>
            <Database size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <strong>Modo de demostración activo.</strong> Las llaves de Supabase no están configuradas en <code>.env</code>. Puedes usar cualquier contraseña o hacer clic abajo para ingresar.
            </div>
          </div>
        )}

        {error && (
          <div style={{
            backgroundColor: 'var(--error-glow)',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            borderRadius: '8px',
            color: 'var(--error)',
            padding: '12px',
            marginBottom: '24px',
            fontSize: '13px',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Mail size={12} /> Correo Electrónico
            </label>
            <input
              type="email"
              placeholder={isSupabaseConfigured ? "admin@tacuche.com" : "admin (modo demo)"}
              className="form-input"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required={isSupabaseConfigured}
            />
          </div>

          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Key size={12} /> Contraseña
            </label>
            <input
              type="password"
              placeholder="••••••••"
              className="form-input"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required={isSupabaseConfigured}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ width: '100%', padding: '12px', marginTop: '8px' }}
          >
            {loading ? 'Iniciando sesión...' : 'Ingresar'}
          </button>
        </form>

        {/* Demo Fast Login */}
        {!isSupabaseConfigured && (
          <button
            onClick={handleDemoLogin}
            className="btn btn-secondary"
            style={{ width: '100%', padding: '12px', marginTop: '12px' }}
          >
            Ingreso Rápido (Demo)
          </button>
        )}
      </div>
    </div>
  );
}
