import React, { useState } from 'react';
import Dashboard from './components/Dashboard';
import Admin from './components/Admin';

export default function App() {
  // État utilisateur (Configuré en administrateur par défaut)
  const [user, setUser] = useState({
    name: 'Ismaël',
    email: 'contact@exemple.com',
    isPremium: false,
    role: 'admin' // Accès d'administration activé
  });

  const [tab, setTab] = useState('home');
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // Gestion de la déconnexion
  const handleLogout = () => {
    alert('Déconnexion effectuée.');
  };

  // Gestion de l'ouverture du module de paiement
  const handleOpenPaywall = () => {
    alert('Ouverture du module de paiement (FedaPay / Mobile Money)');
  };

  return (
    <div style={{ backgroundColor: '#0D1117', minHeight: '100vh', display: 'flex', justifyContent: 'center' }}>
      <div style={{ width: '100%', maxWidth: '430px', display: 'flex', flexDirection: 'column', position: 'relative' }}>
        
        {/* Affichage du Panneau Admin ou du Tableau de bord */}
        {isAdminOpen ? (
          <Admin onClose={() => setIsAdminOpen(false)} />
        ) : (
          <Dashboard 
            user={user} 
            onLogout={handleLogout} 
            tab={tab} 
            setTab={setTab} 
            onOpenPaywall={handleOpenPaywall} 
            onOpenAdmin={() => setIsAdminOpen(true)}
          />
        )}

      </div>
    </div>
  );
}
