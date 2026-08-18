import React, { useState } from 'react';
import { ShieldAlert, ArrowLeft, RefreshCw, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

export default function Admin({ onClose }) {
  // Exemples de transactions et erreurs système pour le contrôle
  const [transactions, setTransactions] = useState([
    { id: 'TX-9901', user: 'Marc S.', amount: 15000, status: 'SUCCESS', date: '18/08/2026' },
    { id: 'TX-9902', user: 'Jean P.', amount: 5000, status: 'FAILED', date: '17/08/2026', reason: 'Échec FedaPay / Solde insuffisant' },
    { id: 'TX-9903', user: 'Awa K.', amount: 10000, status: 'PENDING', date: '16/08/2026' }
  ]);

  const [logs, setLogs] = useState([
    { id: 1, type: 'PAYMENT_ERROR', message: 'Webhook FedaPay non reçu pour TX-9902', time: '17/08/2026 14:32' },
    { id: 2, type: 'SYSTEM', message: 'Tentative d\'accès non autorisée rejetée', time: '16/08/2026 09:15' }
  ]);

  // Action pour rembourser/annuler une transaction
  const handleRefund = (txId) => {
    if (window.confirm(`Confirmer le remboursement pour la transaction ${txId} ?`)) {
      setTransactions(transactions.map(tx => 
        tx.id === txId ? { ...tx, status: 'REFUNDED' } : tx
      ));
    }
  };

  return (
    <div style={{ backgroundColor: '#0D1117', color: '#FFF', minHeight: '100vh', padding: '20px' }}>
      {/* En-tête Admin */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', borderBottom: '1px solid #1E293B', paddingBottom: '15px' }}>
        <button onClick={onClose} style={{ backgroundColor: 'transparent', border: 'none', color: '#818CF8', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '14px' }}>
          <ArrowLeft size={16} /> Retour
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#EF4444', fontWeight: 'bold' }}>
          <ShieldAlert size={18} /> PANNEAU ADMIN
        </div>
      </div>

      {/* Section 1 : Suivi des Paiements & Litiges */}
      <h3 style={{ fontSize: '16px', color: '#F87171', marginBottom: '10px' }}>Transactions & Paiements FedaPay</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '30px' }}>
        {transactions.map((tx) => (
          <div key={tx.id} style={{ backgroundColor: '#161B22', padding: '12px', borderRadius: '8px', border: '1px solid #1E293B', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontWeight: 'bold', fontSize: '13px' }}>{tx.id} - {tx.user}</div>
              <div style={{ fontSize: '12px', color: '#94A3B8' }}>{tx.amount.toLocaleString()} FCFA • {tx.date}</div>
              {tx.reason && <div style={{ fontSize: '11px', color: '#F87171', marginTop: '2px' }}>{tx.reason}</div>}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {tx.status === 'SUCCESS' && <span style={{ color: '#22C55E', fontSize: '12px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px' }}><CheckCircle size={14} /> Réussi</span>}
              {tx.status === 'FAILED' && <span style={{ color: '#EF4444', fontSize: '12px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px' }}><XCircle size={14} /> Échec</span>}
              {tx.status === 'PENDING' && <span style={{ color: '#F59E0B', fontSize: '12px', fontWeight: 'bold' }}>En attente</span>}
              {tx.status === 'REFUNDED' && <span style={{ color: '#94A3B8', fontSize: '12px', fontWeight: 'bold' }}>Remboursé</span>}

              {tx.status === 'FAILED' && (
                <button onClick={() => handleRefund(tx.id)} style={{ padding: '4px 8px', backgroundColor: '#7F1D1D', color: '#FFF', border: 'none', borderRadius: '4px', fontSize: '11px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <RefreshCw size={12} /> Rembourser
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Section 2 : Journal des Erreurs Système */}
      <h3 style={{ fontSize: '16px', color: '#F59E0B', marginBottom: '10px' }}>Rapports d'Erreurs & Webhooks</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {logs.map((log) => (
          <div key={log.id} style={{ backgroundColor: '#161B22', padding: '12px', borderRadius: '8px', border: '1px solid #1E293B' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#F59E0B', fontSize: '12px', fontWeight: 'bold' }}>
              <AlertTriangle size={14} /> {log.type}
            </div>
            <div style={{ fontSize: '13px', color: '#E2E8F0', marginTop: '4px' }}>{log.message}</div>
            <div style={{ fontSize: '11px', color: '#64748B', marginTop: '4px' }}>{log.time}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
