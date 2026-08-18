import React from 'react';
import { Home, Users, BarChart3, LogOut, Crown, AlertCircle } from 'lucide-react';

export default function Dashboard({ user, onLogout, tab, setTab, onOpenPaywall }) {
  const navItems = [
    { name: 'Accueil', id: 'home', icon: Home },
    { name: 'Clients', id: 'clients', icon: Users },
    { name: 'Stats', id: 'stats', icon: BarChart3 },
  ];

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: '#0D1117', minHeight: '100vh' }}>
      {/* En-tête de l'application */}
      <header style={{ padding: '16px 20px', borderBottom: '1px solid #1E293B', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: '#1E293B', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#818CF8', fontWeight: 'bold' }}>
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div>
            <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#FFF' }}>{user?.name || 'Utilisateur'}</div>
            <div style={{ fontSize: '12px', color: '#64748B' }}>{user?.email || 'email@exemple.com'}</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          {!user?.isPremium && (
            <button onClick={onOpenPaywall} style={{ padding: '8px 12px', backgroundColor: '#F59E0B', color: '#000', borderRadius: '8px', border: 'none', fontWeight: 'bold', fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Crown size={14} /> PRO
            </button>
          )}
          <button onClick={onLogout} style={{ padding: '8px 12px', backgroundColor: '#1E293B', color: '#F87171', borderRadius: '8px', border: 'none', fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <LogOut size={14} />
          </button>
        </div>
      </header>

      {/* Contenu principal */}
      <main style={{ padding: '20px', flex: 1, color: '#FFF', paddingBottom: '80px' }}>
        {tab === 'home' && (
          <div>
            <h2 style={{ fontSize: '18px', marginBottom: '15px' }}>Tableau de bord</h2>
            <div style={{ backgroundColor: '#161B22', padding: '15px', borderRadius: '10px', border: '1px solid #1E293B' }}>
              <p style={{ margin: 0, color: '#94A3B8', fontSize: '14px' }}>Bienvenue dans votre espace de gestion.</p>
            </div>
          </div>
        )}
        {tab === 'clients' && <h2>Gestion des Clients & Relances</h2>}
        {tab === 'stats' && <h2>Statistiques Financières</h2>}
      </main>

      {/* Navigation inférieure */}
      <nav style={{ position: 'fixed', bottom: 0, width: '100%', backgroundColor: '#0D1117', borderTop: '1px solid #1E293B', padding: '12px 20px', display: 'flex', justifyContent: 'space-around', boxSizing: 'border-box' }}>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <button key={item.id} onClick={() => setTab(item.id)} style={{ background: 'none', border: 'none', color: tab === item.id ? '#818CF8' : '#64748B', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', fontSize: '12px', cursor: 'pointer' }}>
              <Icon size={20} />
              {item.name}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
