import React, { useState } from 'react';
import { Crown, Check, ArrowLeft, ShieldCheck, Smartphone } from 'lucide-react';

export default function Paywall({ onClose, user }) {
  const [loading, setLoading] = useState(false);

  // Fonction de déclenchement du paiement FedaPay
  const handlePayment = (plan, amount) => {
    setLoading(true);

    // Initialisation du SDK FedaPay ou redirection vers le checkout
    const checkoutUrl = `https://checkout.fedapay.com`; // URL de test / intégration
    
    // Simulation du processus de paiement
    alert(`Redirection vers le guichet FedaPay pour l'abonnement ${plan} (${amount.toLocaleString()} FCFA)...`);
    
    // Exemple d'ouverture du guichet FedaPay
    window.open(checkoutUrl, '_blank');
    setLoading(false);
  };

  return (
    <div style={{ backgroundColor: '#0D1117', color: '#FFF', minHeight: '100vh', padding: '20px' }}>
      {/* En-tête */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', borderBottom: '1px solid #1E293B', paddingBottom: '15px' }}>
        <button onClick={onClose} style={{ backgroundColor: 'transparent', border: 'none', color: '#818CF8', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '14px' }}>
          <ArrowLeft size={16} /> Fermer
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#F59E0B', fontWeight: 'bold' }}>
          <Crown size={18} /> PASSER À LA VITESSE SUPÉRIEURE
        </div>
      </div>

      <div style={{ textAlign: 'center', marginBottom: '25px' }}>
        <h2 style={{ fontSize: '20px', marginBottom: '8px' }}>Débloquez tout le potentiel</h2>
        <p style={{ color: '#94A3B8', fontSize: '13px', margin: 0 }}>Relancez vos clients sans limite et automatisez vos encaissements.</p>
      </div>

      {/* Carte Tarifaire : Mensuel */}
      <div style={{ backgroundColor: '#161B22', borderRadius: '12px', border: '1px solid #1E293B', padding: '20px', marginBottom: '15px', position: 'relative' }}>
        <h3 style={{ fontSize: '16px', margin: '0 0 10px 0' }}>Abonnement Mensuel</h3>
        <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#818CF8', marginBottom: '15px' }}>
          2 500 FCFA <span style={{ fontSize: '12px', color: '#64748B', fontWeight: 'normal' }}>/ mois (~3.80 €)</span>
        </div>

        <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 20px 0', fontSize: '13px', display: 'flex', flexDirection: 'column', gap: '8px', color: '#CBD5E1' }}>
          <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Check size={14} color="#22C55E" /> Relances WhatsApp illimitées</li>
          <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Check size={14} color="#22C55E" /> Sauvegarde automatique Supabase</li>
          <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Check size={14} color="#22C55E" /> Support prioritaire</li>
        </ul>

        <button 
          onClick={() => handlePayment('Mensuel', 2500)}
          disabled={loading}
          style={{ width: '100%', padding: '12px', backgroundColor: '#6366F1', color: '#FFF', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
        >
          <Smartphone size={16} /> Payer par Mobile Money (FCFA)
        </button>
      </div>

      {/* Carte Tarifaire : Annuel (Économique) */}
      <div style={{ backgroundColor: '#161B22', borderRadius: '12px', border: '2px solid #F59E0B', padding: '20px', position: 'relative' }}>
        <div style={{ position: 'absolute', top: '-10px', right: '15px', backgroundColor: '#F59E0B', color: '#000', padding: '2px 8px', borderRadius: '10px', fontSize: '10px', fontWeight: 'bold' }}>
          RÉDUCTION 20%
        </div>

        <h3 style={{ fontSize: '16px', margin: '0 0 10px 0' }}>Abonnement Annuel</h3>
        <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#F59E0B', marginBottom: '15px' }}>
          24 000 FCFA <span style={{ fontSize: '12px', color: '#64748B', fontWeight: 'normal' }}>/ an (~36.50 €)</span>
        </div>

        <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 20px 0', fontSize: '13px', display: 'flex', flexDirection: 'column', gap: '8px', color: '#CBD5E1' }}>
          <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Check size={14} color="#22C55E" /> Tout ce qui est inclus dans le plan mensuel</li>
          <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Check size={14} color="#22C55E" /> 2 mois offerts</li>
        </ul>

        <button 
          onClick={() => handlePayment('Annuel', 24000)}
          disabled={loading}
          style={{ width: '100%', padding: '12px', backgroundColor: '#F59E0B', color: '#000', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
        >
          <Smartphone size={16} /> Payer par Mobile Money (FCFA)
        </button>
      </div>

      <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '11px', color: '#64748B', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
        <ShieldCheck size={14} /> Paiement 100% sécurisé via FedaPay (MTN, Moov, Carte)
      </div>
    </div>
  );
}
