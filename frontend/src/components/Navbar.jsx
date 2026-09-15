import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sparkles, History, PlusCircle, LogOut, User, Cpu } from 'lucide-react';

export function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header style={{
      borderBottom: '1px solid var(--border-subtle)',
      background: 'rgba(9, 13, 22, 0.8)',
      backdropFilter: 'blur(12px)',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '70px'
      }}>
        {/* Logo */}
        <Link to="/" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          textDecoration: 'none',
          color: 'var(--text-main)'
        }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 15px var(--primary-glow)'
          }}>
            <Cpu size={22} color="#fff" />
          </div>
          <div>
            <span style={{ fontWeight: 800, fontSize: '1.2rem', letterSpacing: '-0.5px' }}>
              Interview<span style={{ color: 'var(--primary)' }}>AI</span>
            </span>
            <span style={{
              display: 'inline-block',
              marginLeft: '6px',
              fontSize: '0.65rem',
              fontWeight: 700,
              padding: '2px 6px',
              borderRadius: '4px',
              background: 'rgba(99, 102, 241, 0.2)',
              color: 'var(--secondary)',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>Adaptive</span>
          </div>
        </Link>

        {/* Nav Links */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {user ? (
            <>
              <Link
                to="/interview/setup"
                className="btn btn-primary"
                style={{ padding: '8px 16px', fontSize: '0.88rem' }}
              >
                <PlusCircle size={16} />
                New Interview
              </Link>
              <Link
                to="/history"
                className="btn btn-secondary"
                style={{
                  padding: '8px 16px',
                  fontSize: '0.88rem',
                  borderColor: location.pathname === '/history' ? 'var(--primary)' : 'var(--border-subtle)'
                }}
              >
                <History size={16} />
                History
              </Link>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 12px',
                borderRadius: '8px',
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid var(--border-subtle)'
              }}>
                <User size={15} color="var(--primary)" />
                <span style={{ fontSize: '0.88rem', fontWeight: 600 }}>{user.name}</span>
              </div>
              <button
                onClick={handleLogout}
                className="btn btn-secondary"
                style={{ padding: '8px 12px', color: 'var(--danger)' }}
                title="Log out"
              >
                <LogOut size={16} />
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-secondary" style={{ padding: '8px 18px' }}>
                Log in
              </Link>
              <Link to="/register" className="btn btn-primary" style={{ padding: '8px 18px' }}>
                Get Started
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
