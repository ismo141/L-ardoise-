import React, { useState, useEffect } from "react";

const FREE_CLIENT_LIMIT = 15;
const USERS_KEY = "ardoise-users-v3";
const SESSION_KEY = "ardoise-session-v3";

function fcfa(n) {
  return Math.round(n || 0).toLocaleString("fr-FR") + " F CFA";
}

export default function App() {
  const [booted, setBooted] = useState(false);
  const [users, setUsers] = useState({});
  const [session, setSession] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    try {
      const ur = localStorage.getItem(USERS_KEY);
      if (ur) setUsers(JSON.parse(ur));
      const sr = localStorage.getItem(SESSION_KEY);
      if (sr) setSession(JSON.parse(sr));
    } catch (e) {
      console.error(e);
    }
    setBooted(true);
  }, []);

  useEffect(() => {
    if (!booted) return;
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }, [users, booted]);

  useEffect(() => {
    if (!booted) return;
    if (session) localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    else localStorage.removeItem(SESSION_KEY);
  }, [session, booted]);

  if (!booted) {
    return (
      <div style={{ backgroundColor: "#0B0F17", color: "#94A3B8", height: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        Chargement...
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: "#0B0F17", color: "#F8FAFC", minHeight: "100vh", fontFamily: "sans-serif", display: "flex", justifyContent: "center" }}>
      <div style={{ width: "100%", maxWidth: "430px", minHeight: "100vh", backgroundColor: "#0D1117", display: "flex", flexDirection: "column", borderLeft: "1px solid #1E293B", borderRight: "1px solid #1E293B", position: "relative" }}>
        {!session ? (
          <AuthScreen
            users={users}
            onAuth={(email, record) => {
              setUsers((p) => ({ ...p, [email]: record }));
              setSession({ email });
            }}
          />
        ) : (
          <MainDashboard
            email={session.email}
            user={users[session.email]}
            setUser={(updater) =>
              setUsers((prev) => ({ ...prev, [session.email]: updater(prev[session.email]) }))
            }
            onLogout={() => setSession(null)}
            setToast={setToast}
          />
        )}

        {toast && (
          <div style={{ position: "fixed", bottom: "80px", left: "50%", transform: "translateX(-50%)", backgroundColor: "#10B981", color: "#022C22", padding: "10px 20px", borderRadius: "20px", fontSize: "13px", fontWeight: "bold", zIndex: 100 }}>
            {toast}
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------------- AUTHENTIFICATION ---------------- */

function AuthScreen({ users, onAuth }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    const em = email.trim().toLowerCase();
    if (!em || !password) return setError("Veuillez remplir tous les champs.");

    if (isLogin) {
      if (!users[em] || users[em].password !== password) return setError("Email ou mot de passe incorrect.");
      onAuth(em, users[em]);
    } else {
      if (users[em]) return setError("Un compte existe déjà.");
      if (!name) return setError("Veuillez entrer votre nom.");
      onAuth(em, { name, password, isPremium: false });
    }
  };

  return (
    <div style={{ padding: "30px 24px", flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
      <div style={{ textAlign: "center", marginBottom: "32px" }}>
        <div style={{ width: "48px", height: "48px", backgroundColor: "rgba(99, 102, 241, 0.15)", border: "1px solid rgba(99, 102, 241, 0.3)", borderRadius: "16px", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px auto", color: "#818CF8", fontSize: "20px" }}>
          💳
        </div>
        <h1 style={{ fontSize: "24px", fontWeight: "bold", color: "#FFFFFF", margin: 0 }}>L'Ardoise SaaS</h1>
        <p style={{ fontSize: "13px", color: "#94A3B8", marginTop: "6px" }}>Gérez vos créances et recouvrements</p>
      </div>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {!isLogin && (
          <div>
            <label style={{ fontSize: "12px", color: "#94A3B8", display: "block", marginBottom: "4px" }}>Nom / Commerce</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Rosine Shop"
              style={inputStyle}
            />
          </div>
        )}

        <div>
          <label style={{ fontSize: "12px", color: "#94A3B8", display: "block", marginBottom: "4px" }}>Adresse Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="votre@email.com"
            style={inputStyle}
          />
        </div>

        <div>
          <label style={{ fontSize: "12px", color: "#94A3B8", display: "block", marginBottom: "4px" }}>Mot de passe</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            style={inputStyle}
          />
        </div>

        {error && <div style={{ fontSize: "12px", color: "#F87171", backgroundColor: "rgba(239, 68, 68, 0.1)", padding: "10px", borderRadius: "8px", border: "1px solid rgba(239, 68, 68, 0.2)" }}>{error}</div>}

        <button type="submit" style={btnPrimaryStyle}>
          {isLogin ? "Se connecter" : "Créer mon compte"}
        </button>
      </form>

      <button
        onClick={() => setIsLogin(!isLogin)}
        style={{ fontSize: "12px", color: "#818CF8", background: "none", border: "none", marginTop: "24px", cursor: "pointer" }}
      >
        {isLogin ? "Nouveau ici ? Créer un compte" : "Déjà un compte ? Se connecter"}
      </button>
    </div>
  );
}

/* ---------------- DASHBOARD PRINCIPAL ---------------- */

function MainDashboard({ email, user, setUser, onLogout, setToast }) {
  const [tab, setTab] = useState("home");
  const [selectedClient, setSelectedClient] = useState(null);
  const [modal, setModal] = useState(null);
  const [clients, setClients] = useState([]);

  const storageKey = `ardoise-clients-${email}`;

  useEffect(() => {
    const data = localStorage.getItem(storageKey);
    if (data) setClients(JSON.parse(data));
  }, [storageKey]);

  const saveClients = (newList) => {
    setClients(newList);
    localStorage.setItem(storageKey, JSON.stringify(newList));
  };

  const calculateBalance = (c) =>
    c.transactions.reduce((acc, t) => acc + (t.type === "credit" ? t.amount : -t.amount), 0);

  const totalDue = clients.reduce((sum, c) => sum + Math.max(0, calculateBalance(c)), 0);

  const handleAddTransaction = ({ name, amount, type, note }) => {
    let list = [...clients];
    let clientObj = list.find((c) => c.name.toLowerCase() === name.toLowerCase());

    if (!clientObj) {
      if (!user.isPremium && list.length >= FREE_CLIENT_LIMIT) {
        setModal("paywall");
        return;
      }
      clientObj = { id: "c_" + Date.now(), name, transactions: [] };
      list.push(clientObj);
    }

    clientObj.transactions.push({
      id: "t_" + Date.now(),
      type,
      amount: Number(amount),
      note,
      date: new Date().toISOString(),
    });

    saveClients(list);
    setModal(null);
    setToast(type === "credit" ? "Vente enregistrée !" : "Paiement encaissé !");
  };

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", paddingBottom: "70px" }}>
      {/* HEADER */}
      <div style={{ padding: "16px 20px", borderBottom: "1px solid #1E293B", display: "flex", alignItems: "center", justifyContent: "space-between", backgroundColor: "#0D1117", sticky: "top" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ width: "36px", height: "36px", borderRadius: "10px", backgroundColor: "#1E293B", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", color: "#818CF8" }}>
            {user.name ? user.name.charAt(0).toUpperCase() : "U"}
          </div>
          <div>
            <div style={{ fontSize: "14px", fontWeight: "600", color: "#FFF" }}>{user.name || "Mon Commerce"}</div>
            <div style={{ fontSize: "11px", color: "#64748B" }}>{email}</div>
          </div>
        </div>
        <button onClick={onLogout} style={{ padding: "8px 12px", backgroundColor: "#1E293B", border: "none", borderRadius: "8px", color: "#F87171", cursor: "pointer", fontSize: "12px" }}>
          Déconnexion
        </button>
      </div>

      {/* CONTENU ONGLET */}
      <div style={{ padding: "20px", flex: 1 }}>
        {selectedClient ? (
          <ClientDetailView
            client={selectedClient}
            balance={calculateBalance(selectedClient)}
            onBack={() => setSelectedClient(null)}
            onAddTx={(type) => setModal({ type, client: selectedClient })}
          />
        ) : (
          <>
            {tab === "home" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                <div style={{ background: "linear-gradient(135deg, #1E1B4B 0%, #0F172A 100%)", border: "1px solid rgba(99, 102, 241, 0.3)", borderRadius: "20px", padding: "20px" }}>
                  <div style={{ fontSize: "11px", color: "#818CF8", textTransform: "uppercase", letterSpacing: "1px", fontWeight: "bold" }}>Total à recouvrer</div>
                  <div style={{ fontSize: "28px", fontWeight: "800", color: "#FFF", marginTop: "4px" }}>{fcfa(totalDue)}</div>
                  <div style={{ fontSize: "12px", color: "#94A3B8", marginTop: "8px" }}>{clients.length} client(s) enregistrés</div>
                </div>

                <div>
                  <h3 style={{ fontSize: "14px", fontWeight: "600", color: "#CBD5E1", marginBottom: "12px" }}>Clients sur l'ardoise</h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    {clients.length === 0 ? (
                      <div style={{ textAlign: "center", padding: "30px", color: "#64748B", fontSize: "13px" }}>Aucune ardoise enregistrée.</div>
                    ) : (
                      clients.map((c) => {
                        const bal = calculateBalance(c);
                        return (
                          <div key={c.id} onClick={() => setSelectedClient(c)} style={cardStyle}>
                            <div>
                              <div style={{ fontSize: "14px", fontWeight: "600", color: "#FFF" }}>{c.name}</div>
                              <div style={{ fontSize: "11px", color: "#64748B" }}>{c.transactions.length} opération(s)</div>
                            </div>
                            <div style={{ fontSize: "14px", fontWeight: "bold", color: bal > 0 ? "#F59E0B" : "#10B981" }}>
                              {bal > 0 ? fcfa(bal) : "Soldé ✓"}
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              </div>
            )}

            {tab === "clients" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {clients.map((c) => (
                  <div key={c.id} onClick={() => setSelectedClient(c)} style={cardStyle}>
                    <div style={{ fontSize: "14px", color: "#FFF" }}>{c.name}</div>
                    <div style={{ fontSize: "14px", fontWeight: "bold", color: "#818CF8" }}>{fcfa(calculateBalance(c))}</div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* BARRE DE NAVIGATION FIXE EN BAS */}
      <div style={{ position: "fixed", bottom: 0, width: "100%", maxWidth: "430px", backgroundColor: "#0D1117", borderTop: "1px solid #1E293B", padding: "12px 20px", display: "flex", justifyContent: "space-around", alignItems: "center" }}>
        <button onClick={() => { setSelectedClient(null); setTab("home"); }} style={navBtnStyle(tab === "home" && !selectedClient)}>
          🏠 Home
        </button>
        <button onClick={() => setModal("credit")} style={{ width: "48px", height: "48px", borderRadius: "50%", backgroundColor: "#4F46E5", color: "#FFF", border: "none", fontSize: "22px", fontWeight: "bold", cursor: "pointer", marginTop: "-20px", boxShadow: "0 4px 12px rgba(79, 70, 229, 0.4)" }}>
          +
        </button>
        <button onClick={() => { setSelectedClient(null); setTab("clients"); }} style={navBtnStyle(tab === "clients" && !selectedClient)}>
          👥 Clients
        </button>
      </div>

      {/* MODALE TRANSACTION */}
      {modal && typeof modal === "object" ? (
        <TransactionModal type={modal.type} presetClient={modal.client} onClose={() => setModal(null)} onSubmit={handleAddTransaction} />
      ) : modal === "credit" ? (
        <TransactionModal type="credit" onClose={() => setModal(null)} onSubmit={handleAddTransaction} />
      ) : null}
    </div>
  );
}

function ClientDetailView({ client, balance, onBack, onAddTx }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <button onClick={onBack} style={{ background: "none", border: "none", color: "#818CF8", fontSize: "13px", cursor: "pointer", textAlign: "left", padding: 0 }}>
        ← Retour
      </button>

      <div style={{ backgroundColor: "#1E293B", padding: "16px", borderRadius: "16px" }}>
        <div style={{ fontSize: "18px", fontWeight: "bold", color: "#FFF" }}>{client.name}</div>
        <div style={{ fontSize: "12px", color: "#94A3B8", marginTop: "4px" }}>Reste à payer</div>
        <div style={{ fontSize: "24px", fontWeight: "bold", color: balance > 0 ? "#F59E0B" : "#10B981", marginTop: "4px" }}>
          {fcfa(balance)}
        </div>

        <button onClick={() => onAddTx("payment")} style={{ ...btnPrimaryStyle, backgroundColor: "#10B981", marginTop: "16px" }}>
          Encaisser un paiement
        </button>
      </div>
    </div>
  );
}

function TransactionModal({ type, presetClient, onClose, onSubmit }) {
  const [name, setName] = useState(presetClient ? presetClient.name : "");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");

  const handleSave = (e) => {
    e.preventDefault();
    if (!name || !amount) return;
    onSubmit({ name, amount, type, note });
  };

  return (
    <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.8)", display: "flex", items: "center", alignItems: "flex-end", justifyCenter: "center", zIndex: 50 }}>
      <div style={{ width: "100%", maxWidth: "430px", backgroundColor: "#0D1117", borderTop: "1px solid #1E293B", borderRadius: "24px 24px 0 0", padding: "24px", boxSizing: "border-box" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
          <h3 style={{ margin: 0, fontSize: "16px", color: "#FFF" }}>{type === "credit" ? "Nouvelle Vente" : "Paiement"}</h3>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "#94A3B8", fontSize: "18px", cursor: "pointer" }}>✕</button>
        </div>

        <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {!presetClient && (
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Nom du Client" style={inputStyle} />
          )}
          <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Montant FCFA" style={inputStyle} />
          <input type="text" value={note} onChange={(e) => setNote(e.target.value)} placeholder="Note (Optionnel)" style={inputStyle} />
          <button type="submit" style={btnPrimaryStyle}>Enregistrer</button>
        </form>
      </div>
    </div>
  );
}

/* STYLES CSS INLINE */
const inputStyle = {
  width: "100%",
  backgroundColor: "#1E293B",
  border: "1px solid #334155",
  borderRadius: "10px",
  padding: "12px",
  fontSize: "14px",
  color: "#FFFFFF",
  outline: "none",
  boxSizing: "border-box",
};

const btnPrimaryStyle = {
  width: "100%",
  backgroundColor: "#4F46E5",
  color: "#FFFFFF",
  fontWeight: "bold",
  padding: "14px",
  borderRadius: "10px",
  border: "none",
  fontSize: "14px",
  cursor: "pointer",
};

const cardStyle = {
  backgroundColor: "#1E293B",
  border: "1px solid #334155",
  borderRadius: "12px",
  padding: "14px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  cursor: "pointer",
};

const navBtnStyle = (active) => ({
  background: "none",
  border: "none",
  color: active ? "#818CF8" : "#64748B",
  fontSize: "13px",
  fontWeight: active ? "bold" : "normal",
  cursor: "pointer",
});
