import React, { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';

export default function App() {
  // État utilisateur (préparé pour la synchronisation Supabase)
  const [user, setUser] = useState({
    name: 'Ismaël',
    email: 'contact@exemple.com',
    isPremium: false,
    role: 'admin' // Défini en admin pour accès total
  });

  const [tab, setTab] = useState('home');
  const [isPaywallOpen, setIsPaywallOpen] = useState(false);

  // Gestion de la déconnexion
  const handleLogout = () => {
    alert('Déconnexion effectuée.');
    // La logique de déconnexion Supabase sera raccordée ici
  };

  // Gestion de l'ouverture du module de paiement
  const handleOpenPaywall = () => {
    setIsPaywallOpen(true);
    alert('Ouverture du module de paiement (FedaPay / Monero)');
  };

  return (
    <div style={{ backgroundColor: '#0D1117', minHeight: '100vh', display: 'flex', justifyContent: 'center' }}>
      <div style={{ width: '100%', maxWidth: '430px', display: 'flex', flexDirection: 'column', position: 'relative' }}>
        <Dashboard 
          user={user} 
          onLogout={handleLogout} 
          tab={tab} 
          setTab={setTab} 
          onOpenPaywall={handleOpenPaywall} 
        />
      </div>
    </div>
  );
}
