import React, { useState } from 'react';
import { MessageCircle, UserPlus, Phone, DollarSign, Calendar } from 'lucide-react';

export default function Clients() {
  const [clients, setClients] = useState([
    { id: 1, name: 'Sessinou Marc', phone: '+22990000000', amount: 15000, dueDate: '2026-08-20' }
  ]);

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [amount, setAmount] = useState('');
  const [dueDate, setDueDate] = useState('');

  // Ajout d'un client
  const handleAddClient = (e) => {
    e.preventDefault();
    if (!name || !phone || !amount) return;

    const newClient = {
      id: Date.now(),
      name,
      phone,
      amount: parseFloat(amount),
      dueDate: dueDate || 'Non définie'
    };

    setClients([...clients, newClient]);
    setName('');
    setPhone('');
    setAmount('');
    setDueDate('');
  };

  // Envoi de la relance WhatsApp
  const sendWhatsAppReminder = (client) => {
    const formattedPhone = client.phone.replace(/\s+/g, '').replace('+', '');
    const message = encodeURIComponent(
      `Bonjour ${client.name},\n\nSauf erreur de notre part, votre règlement de ${client.amount.toLocaleString()} FCFA prévu pour le ${client.dueDate} n'a pas encore été enregistré.\n\nMerci de procéder au régularisation dans les plus brefs délais.\n\nCordialement.`
    );
    
    window.open(`https://wa.me/${formattedPhone}?text=${message}`, '_blank');
  };

  return (
    <div style={{ color: '#FFF' }}>
      <h2 style={{ fontSize: '18px', marginBottom: '15px' }}>Gestion des Clients & Relances</h2>

      {/* Formulaire d'ajout */}
      <form onSubmit={handleAddClient} style={{ backgroundColor: '#161B22', padding: '15px', borderRadius: '10px', border: '1px solid #1E293B', marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <h3 style={{ fontSize: '14px', margin: '0 0 5px 0', color: '#818CF8' }}>Ajouter un débiteur</h3>
        
        <input 
          type="text" 
          placeholder="Nom du client" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          style={{ width: '100%', padding: '10px', backgroundColor: '#0D1117', border: '1px solid #1E293B', borderRadius: '6px', color: '#FFF', boxSizing: 'border-box' }} 
        />
        
        <input 
          type="text" 
          placeholder="Numéro WhatsApp (ex: +229...)" 
          value={phone} 
          onChange={(e) => setPhone(e.target.value)} 
          style={{ width: '100%', padding: '10px', backgroundColor: '#0D1117', border: '1px solid #1E293B', borderRadius: '6px', color: '#FFF', boxSizing: 'border-box' }} 
        />
        
        <div style={{ display: 'flex', gap: '10px' }}>
          <input 
            type="number" 
            placeholder="Montant (FCFA)" 
            value={amount} 
            onChange={(e) => setAmount(e.target.value)} 
            style={{ width: '50%', padding: '10px', backgroundColor: '#0D1117', border: '1px solid #1E293B', borderRadius: '6px', color: '#FFF', boxSizing: 'border-box' }} 
          />
          <input 
            type="date" 
            value={dueDate} 
            onChange={(e) => setDueDate(e.target.value)} 
            style={{ width: '50%', padding: '10px', backgroundColor: '#0D1117', border: '1px solid #1E293B', borderRadius: '6px', color: '#FFF', boxSizing: 'border-box' }} 
          />
        </div>

        <button type="submit" style={{ padding: '10px', backgroundColor: '#6366F1', color: '#FFF', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
          <UserPlus size={16} /> Enregistrer
        </button>
      </form>

      {/* Liste des créances */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {clients.map((client) => (
          <div key={client.id} style={{ backgroundColor: '#161B22', padding: '12px 15px', borderRadius: '10px', border: '1px solid #1E293B', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontWeight: 'bold', fontSize: '14px' }}>{client.name}</div>
              <div style={{ fontSize: '12px', color: '#F87171', marginTop: '2px' }}>{client.amount.toLocaleString()} FCFA</div>
              <div style={{ fontSize: '11px', color: '#64748B', marginTop: '2px' }}>Échéance : {client.dueDate}</div>
            </div>

            <button onClick={() => sendWhatsAppReminder(client)} style={{ padding: '8px 12px', backgroundColor: '#22C55E', color: '#FFF', border: 'none', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 'bold', fontSize: '12px' }}>
              <MessageCircle size={14} /> Relancer
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
