import React, { useState, useEffect } from 'react';
import { MessageCircle, UserPlus } from 'lucide-react';
import { supabase } from '../lib/supabase'; // Connexion à votre base de données

export default function Clients() {
  const [clients, setClients] = useState([]);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [amount, setAmount] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [loading, setLoading] = useState(true);

  // Charger les clients depuis Supabase au démarrage
  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (data) setClients(data);
    } catch (error) {
      console.error('Erreur de chargement:', error.message);
    } finally {
      setLoading(false);
    }
  };

  // Ajouter un nouveau client dans Supabase
  const handleAddClient = async (e) => {
    e.preventDefault();
    if (!name || !phone || !amount) return;

    const newClient = {
      name,
      phone,
      amount: parseFloat(amount),
      dueDate: dueDate || null
    };

    try {
      const { data, error } = await supabase
        .from('clients')
        .insert([newClient])
        .select();

      if (error) throw error;
      
      if (data) {
        setClients([data[0], ...clients]);
        setName('');
        setPhone('');
        setAmount('');
        setDueDate('');
      }
    } catch (error) {
      alert("Erreur lors de l'ajout : " + error.message);
    }
  };

  // Envoi de la relance WhatsApp
  const sendWhatsAppReminder = (client) => {
    const formattedPhone = client.phone.replace(/\s+/g, '').replace('+', '');
    const dateText = client.dueDate ? `le ${client.dueDate}` : `prochainement`;
    const message = encodeURIComponent(
      `Bonjour ${client.name},\n\nSauf erreur de notre part, votre règlement de ${client.amount.toLocaleString()} FCFA prévu ${dateText} n'a pas encore été enregistré.\n\nMerci de procéder à la régularisation dans les plus brefs délais.\n\nCordialement.`
    );
    window.open(`https://wa.me/${formattedPhone}?text=${message}`, '_blank');
  };

  return (
    <div style={{ color: '#FFF' }}>
      <h2 style={{ fontSize: '18px', marginBottom: '15px' }}>Gestion des Clients & Relances</h2>

      {/* Formulaire d'ajout sécurisé */}
      <form onSubmit={handleAddClient} style={{ backgroundColor: '#161B22', padding: '15px', borderRadius: '10px', border: '1px solid #1E293B', marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <h3 style={{ fontSize: '14px', margin: '0 0 5px 0', color: '#818CF8' }}>Ajouter un débiteur</h3>
        
        <input type="text" placeholder="Nom du client" value={name} onChange={(e) => setName(e.target.value)} style={{ width: '100%', padding: '10px', backgroundColor: '#0D1117', border: '1px solid #1E293B', borderRadius: '6px', color: '#FFF', boxSizing: 'border-box' }} />
        <input type="text" placeholder="Numéro WhatsApp (ex: +229...)" value={phone} onChange={(e) => setPhone(e.target.value)} style={{ width: '100%', padding: '10px', backgroundColor: '#0D1117', border: '1px solid #1E293B', borderRadius: '6px', color: '#FFF', boxSizing: 'border-box' }} />
        
        <div style={{ display: 'flex', gap: '10px' }}>
          <input type="number" placeholder="Montant (FCFA)" value={amount} onChange={(e) => setAmount(e.target.value)} style={{ width: '50%', padding: '10px', backgroundColor: '#0D1117', border: '1px solid #1E293B', borderRadius: '6px', color: '#FFF', boxSizing: 'border-box' }} />
          <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} style={{ width: '50%', padding: '10px', backgroundColor: '#0D1117', border: '1px solid #1E293B', borderRadius: '6px', color: '#FFF', boxSizing: 'border-box' }} />
        </div>

        <button type="submit" style={{ padding: '10px', backgroundColor: '#6366F1', color: '#FFF', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
          <UserPlus size={16} /> Enregistrer en ligne
        </button>
      </form>

      {/* Liste des créances synchronisées */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {loading ? (
          <p style={{ color: '#94A3B8', fontSize: '14px', textAlign: 'center' }}>Connexion à la base de données...</p>
        ) : clients.length === 0 ? (
          <p style={{ color: '#94A3B8', fontSize: '14px', textAlign: 'center' }}>Aucun client enregistré.</p>
        ) : (
          clients.map((client) => (
            <div key={client.id} style={{ backgroundColor: '#161B22', padding: '12px 15px', borderRadius: '10px', border: '1px solid #1E293B', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: 'bold', fontSize: '14px' }}>{client.name}</div>
                <div style={{ fontSize: '12px', color: '#F87171', marginTop: '2px' }}>{client.amount.toLocaleString()} FCFA</div>
                <div style={{ fontSize: '11px', color: '#64748B', marginTop: '2px' }}>Échéance : {client.dueDate || 'Non définie'}</div>
              </div>

              <button onClick={() => sendWhatsAppReminder(client)} style={{ padding: '8px 12px', backgroundColor: '#22C55E', color: '#FFF', border: 'none', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 'bold', fontSize: '12px' }}>
                <MessageCircle size={14} /> Relancer
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
