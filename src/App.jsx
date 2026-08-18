import React, { useState } from 'react';
import Dashboard from './components/Dashboard';
import Admin from './components/Admin';
import Paywall from './components/Paywall';

export default function App() {
  const [user, setUser] = useState({
    name: 'Ismaël',
    email: 'contact@exemple.com',
    isPremium: false,
    role: 'admin'
  });

  const [tab, setTab] = useState('home');
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isPaywallOpen, setIsPaywallOpen] = useState(false);

  const handleLogout = () => {
    alert('Déconnexion effectuée.');
  };

  return (
    <div style={{ backgroundColor: '#0D1117', minHeight: '100vh', display: 'flex', justifyContent: 'center' }}>
      <div style={{ width: '100%', maxWidth: '430px', display: 'flex', flexDirection: 'column', position: 'relative' }}>
        
        {isAdminOpen ? (
          <Admin onClose={() => setIsAdminOpen(false)} />
        ) : isPaywallOpen ? (
          <Paywall user={user} onClose={() => setIsPaywallOpen(false)} />
        ) : (
          <Dashboard 
            user={user} 
            onLogout={handleLogout} 
            tab={tab} 
            setTab={setTab} 
            onOpenPaywall={() => setIsPaywallOpen(true)} 
            onOpenAdmin={() => setIsAdminOpen(true)}
          />
        )}

      </div>
    </div>
  );
}
