import React, { useState, useEffect } from "react";
import {
  Plus, ChevronLeft, X, Check, Phone, Search,
  Eye, EyeOff, User, LogOut, Crown, Bell, BarChart3, Lock,
  Home, Users, Wallet, CreditCard, ArrowUpRight, ArrowDownLeft
} from "lucide-react";

const FREE_CLIENT_LIMIT = 15;
const USERS_KEY = "ardoise-users-v2";
const SESSION_KEY = "ardoise-session-v2";

function fcfa(n) {
  return Math.round(n || 0).toLocaleString("fr-FR") + " F CFA";
}

export default function App() {
  const [booted, setBooted] = useState(false);
  const [users, setUsers] = useState({});
  const [session, setSession] = useState(null);
  const [toast, setToast] = useState(null);

  // Charger le SDK FedaPay pour les paiements Mobile Money
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://cdn.fedapay.com/checkout.js?v=1.1.7";
    script.async = true;
    document.body.appendChild(script);
  }, []);

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

  if (!booted) return <div className="bg-[#0B0F17] h-screen flex items-center justify-center text-slate-400">Chargement...</div>;

  return (
    <div className="bg-[#0B0F17] text-slate-100 min-h-screen font-sans flex justify-center">
      <div className="w-full max-w-md min-h-screen relative flex flex-col bg-[#0D1117] border-x border-slate-800 shadow-2xl">
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
          <div className="fixed bottom-20 left-1/2 -translate-x-1/2 bg-emerald-500 text-slate-950 font-medium px-4 py-2.5 rounded-full text-sm shadow-xl z-50 animate-bounce">
            {toast}
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------------- AUTHENTIFICATION (Style SaaS Modern) ---------------- */

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
      if (users[em]) return setError("Un compte existe déjà avec cet email.");
      if (!name) return setError("Veuillez entrer votre nom.");
      onAuth(em, { name, password, isPremium: false });
    }
  };

  return (
    <div className="p-6 flex-1 flex flex-col justify-center">
      <div className="text-center mb-8">
        <div className="w-12 h-12 bg-indigo-600/20 border border-indigo-500/30 rounded-2xl flex items-center justify-center mx-auto mb-4 text-indigo-400">
          <Wallet size={24} />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-white">L'Ardoise SaaS</h1>
        <p className="text-sm text-slate-400 mt-1">Gérez vos créances et recouvrements en toute simplicité</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {!isLogin && (
          <div>
            <label className="text-xs font-medium text-slate-400">Nom complet / Boutique</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Rosine Shop"
              className="w-full bg-slate-900/80 border border-slate-800 rounded-xl px-4 py-3 text-sm mt-1 focus:border-indigo-500 outline-none text-white"
            />
          </div>
        )}

        <div>
          <label className="text-xs font-medium text-slate-400">Adresse Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="votre@email.com"
            className="w-full bg-slate-900/80 border border-slate-800 rounded-xl px-4 py-3 text-sm mt-1 focus:border-indigo-500 outline-none text-white"
          />
        </div>

        <div>
          <label className="text-xs font-medium text-slate-400">Mot de passe</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full bg-slate-900/80 border border-slate-800 rounded-xl px-4 py-3 text-sm mt-1 focus:border-indigo-500 outline-none text-white"
          />
        </div>

        {error && <div className="text-xs text-rose-400 bg-rose-500/10 p-3 rounded-lg border border-rose-500/20">{error}</div>}

        <button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3.5 rounded-xl text-sm transition-all shadow-lg shadow-indigo-600/20 active:scale-95"
        >
          {isLogin ? "Se connecter" : "Créer mon compte"}
        </button>
      </form>

      <button
        onClick={() => setIsLogin(!isLogin)}
        className="text-xs text-slate-400 text-center mt-6 hover:text-indigo-400 transition-colors"
      >
        {isLogin ? "Nouveau ici ? Créer un compte" : "Déjà un compte ? Se connecter"}
      </button>
    </div>
  );
}

/* ---------------- DASHBOARD PRINCIPAL ---------------- */

function MainDashboard({ email, user, setUser, onLogout, setToast }) {
  const [tab, setTab] = useState("home"); // 'home' | 'clients' | 'stats'
  const [selectedClient, setSelectedClient] = useState(null);
  const [modal, setModal] = useState(null); // 'credit' | 'payment' | 'paywall'
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

  // Fonction de paiement via FedaPay SDK
  const handleFedaPay = (planAmount) => {
    if (window.FedaPay) {
      const widget = window.FedaPay.init({
        public_key: "pk_sandbox_votre_cle_ici", // Remplacez par votre clé publique FedaPay
        transaction: {
          amount: planAmount,
          description: "Abonnement L'Ardoise Premium",
        },
        customer: {
          email: email,
          lastname: user.name || "Client",
        },
        onComplete: ({ reason, transaction }) => {
          if (reason === window.FedaPay.DIALOG_DISMISSED) {
            setToast("Paiement annulé.");
          } else if (transaction.status === "approved") {
            setUser((u) => ({ ...u, isPremium: true }));
            setModal(null);
            setToast("Félicitations ! Abonnement Premium Activé.");
          }
        },
      });
      widget.open();
    } else {
      // Fallback de simulation si la clé n'est pas encore configurée
      setTimeout(() => {
        setUser((u) => ({ ...u, isPremium: true }));
        setModal(null);
        setToast("Mode Demo : Premium Activé !");
      }, 1000);
    }
  };

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
    setToast(type === "credit" ? "Vente à crédit enregistrée !" : "Paiement encaissé !");
  };

  return (
    <div className="flex-1 flex flex-col justify-between pb-20">
      {/* HEADER */}
      <div className="p-5 border-b border-slate-800/80 flex items-center justify-between bg-[#0D1117]/90 backdrop-blur sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-indigo-400">
            {user.name ? user.name.charAt(0).toUpperCase() : "U"}
          </div>
          <div>
            <div className="text-sm font-semibold text-white flex items-center gap-1.5">
              {user.name || "Mon Commerce"}
              {user.isPremium && <Crown size={14} className="text-amber-400 fill-amber-400" />}
            </div>
            <div className="text-xs text-slate-400">{email}</div>
          </div>
        </div>

        <button onClick={onLogout} className="p-2 text-slate-400 hover:text-rose-400 rounded-lg bg-slate-900 border border-slate-800">
          <LogOut size={18} />
        </button>
      </div>

      {/* RENDER VUE EN FONCTION DE L'ONGLET SÉLECTIONNÉ */}
      <div className="p-5 flex-1 overflow-y-auto">
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
              <HomeTab
                totalDue={totalDue}
                clients={clients}
                calculateBalance={calculateBalance}
                onSelectClient={setSelectedClient}
                onOpenPaywall={() => setModal("paywall")}
                isPremium={user.isPremium}
              />
            )}
            {tab === "clients" && (
              <ClientsTab
                clients={clients}
                calculateBalance={calculateBalance}
                onSelectClient={setSelectedClient}
              />
            )}
            {tab === "stats" && <StatsTab clients={clients} calculateBalance={calculateBalance} />}
          </>
        )}
      </div>

      {/* BOTTOM NAVIGATION BAR (FIXÉE EN BAS) */}
      <div className="fixed bottom-0 w-full max-w-md bg-[#0D1117]/95 border-t border-slate-800/80 p-3 flex items-center justify-around backdrop-blur z-20">
        <button
          onClick={() => { setSelectedClient(null); setTab("home"); }}
          className={`flex flex-col items-center gap-1 text-xs ${tab === "home" && !selectedClient ? "text-indigo-400 font-semibold" : "text-slate-500"}`}
        >
          <Home size={20} />
          <span>Accueil</span>
        </button>

        <button
          onClick={() => setModal("credit")}
          className="w-12 h-12 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full flex items-center justify-center -mt-6 shadow-lg shadow-indigo-600/30 border-4 border-[#0D1117] transition-transform active:scale-95"
        >
          <Plus size={24} />
        </button>

        <button
          onClick={() => { setSelectedClient(null); setTab("clients"); }}
          className={`flex flex-col items-center gap-1 text-xs ${tab === "clients" && !selectedClient ? "text-indigo-400 font-semibold" : "text-slate-500"}`}
        >
          <Users size={20} />
          <span>Clients</span>
        </button>

        <button
          onClick={() => { setSelectedClient(null); setTab("stats"); }}
          className={`flex flex-col items-center gap-1 text-xs ${tab === "stats" && !selectedClient ? "text-indigo-400 font-semibold" : "text-slate-500"}`}
        >
          <BarChart3 size={20} />
          <span>Stats</span>
        </button>
      </div>

      {/* MODALES & PAYWALL */}
      {modal === "credit" && (
        <TransactionModal
          type="credit"
          onClose={() => setModal(null)}
          onSubmit={handleAddTransaction}
        />
      )}
      {modal?.type === "payment" && (
        <TransactionModal
          type="payment"
          presetClient={modal.client}
          onClose={() => setModal(null)}
          onSubmit={handleAddTransaction}
        />
      )}
      {modal === "paywall" && (
        <PaywallModal onClose={() => setModal(null)} onPay={handleFedaPay} />
      )}
    </div>
  );
}

/* ---------------- ONGLETS D'AFFICHAGE ---------------- */

function HomeTab({ totalDue, clients, calculateBalance, onSelectClient, onOpenPaywall, isPremium }) {
  return (
    <div className="space-y-6">
      {/* CARTE FINANCIÈRE PRINCIPALE (STYLE FINTECH) */}
      <div className="bg-gradient-to-br from-indigo-900/40 via-slate-900 to-slate-900 border border-indigo-500/20 rounded-3xl p-6 relative overflow-hidden shadow-xl">
        <div className="text-xs font-semibold text-indigo-400 uppercase tracking-wider mb-1">Total à recouvrer</div>
        <div className="text-3xl font-extrabold text-white tracking-tight">{fcfa(totalDue)}</div>
        <div className="text-xs text-slate-400 mt-2 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse"></span>
          {clients.length} client(s) au total sur votre ardoise
        </div>

        {!isPremium && (
          <button
            onClick={onOpenPaywall}
            className="mt-5 w-full bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-semibold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/10"
          >
            <Crown size={14} /> Débloquer la version Illimitée
          </button>
        )}
      </div>

      {/* LISTE DES RÈGLEMENTS À VENIR */}
      <div>
        <h3 className="text-sm font-semibold text-slate-300 mb-3">Dernières Ardoises Actives</h3>
        <div className="space-y-2">
          {clients.length === 0 ? (
            <div className="text-center py-8 text-slate-500 text-xs bg-slate-900/40 border border-slate-800/50 rounded-2xl">
              Aucune créance enregistrée pour le moment.
            </div>
          ) : (
            clients.map((c) => {
              const bal = calculateBalance(c);
              return (
                <div
                  key={c.id}
                  onClick={() => onSelectClient(c)}
                  className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-4 flex items-center justify-between cursor-pointer hover:border-slate-700 transition-all active:scale-[0.99]"
                >
                  <div>
                    <div className="text-sm font-semibold text-white">{c.name}</div>
                    <div className="text-xs text-slate-500">{c.transactions.length} opération(s)</div>
                  </div>
                  <div className={`text-sm font-bold ${bal > 0 ? "text-amber-400" : "text-emerald-400"}`}>
                    {bal > 0 ? fcfa(bal) : "Soldé ✓"}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

function ClientsTab({ clients, calculateBalance, onSelectClient }) {
  const [query, setQuery] = useState("");
  const filtered = clients.filter((c) => c.name.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3.5 top-3.5 text-slate-500" size={16} />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Rechercher un client..."
          className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white outline-none focus:border-indigo-500"
        />
      </div>

      <div className="space-y-2">
        {filtered.map((c) => (
          <div
            key={c.id}
            onClick={() => onSelectClient(c)}
            className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center justify-between cursor-pointer"
          >
            <div className="text-sm font-medium text-white">{c.name}</div>
            <div className="text-sm font-semibold text-indigo-400">{fcfa(calculateBalance(c))}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StatsTab({ clients, calculateBalance }) {
  const totalClients = clients.length;
  const activeDebts = clients.filter((c) => calculateBalance(c) > 0).length;

  return (
    <div className="space-y-4">
      <h2 className="text-base font-bold text-white mb-2">Aperçu Général</h2>
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
          <div className="text-xs text-slate-400">Clients Total</div>
          <div className="text-xl font-bold text-white mt-1">{totalClients}</div>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
          <div className="text-xs text-slate-400">Ardoises En cours</div>
          <div className="text-xl font-bold text-amber-400 mt-1">{activeDebts}</div>
        </div>
      </div>
    </div>
  );
}

function ClientDetailView({ client, balance, onBack, onAddTx }) {
  return (
    <div className="space-y-6">
      <button onClick={onBack} className="flex items-center gap-1 text-xs text-indigo-400 font-medium">
        <ChevronLeft size={16} /> Retour à la liste
      </button>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
        <div className="text-lg font-bold text-white">{client.name}</div>
        <div className="text-xs text-slate-400 mt-1">Solde à régler</div>
        <div className={`text-2xl font-extrabold mt-1 ${balance > 0 ? "text-amber-400" : "text-emerald-400"}`}>
          {fcfa(balance)}
        </div>

        <div className="flex gap-2 mt-4">
          <button
            onClick={() => onAddTx("payment")}
            className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1"
          >
            <ArrowDownLeft size={16} /> Encasser Règlement
          </button>
        </div>
      </div>

      <div>
        <h4 className="text-xs font-semibold text-slate-400 uppercase mb-3">Historique des opérations</h4>
        <div className="space-y-2">
          {client.transactions.slice().reverse().map((t) => (
            <div key={t.id} className="bg-slate-900/50 border border-slate-800/50 p-3 rounded-xl flex items-center justify-between">
              <div>
                <div className="text-xs font-medium text-white">{t.type === "credit" ? "Vente à crédit" : "Paiement client"}</div>
                {t.note && <div className="text-[10px] text-slate-500">{t.note}</div>}
              </div>
              <div className={`text-xs font-bold ${t.type === "credit" ? "text-rose-400" : "text-emerald-400"}`}>
                {t.type === "credit" ? "+" : "-"}{fcfa(t.amount)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------------- MODALES ---------------- */

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
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-end justify-center">
      <div className="w-full max-w-md bg-[#0D1117] border-t border-slate-800 rounded-t-3xl p-6 space-y-4 animate-in slide-in-from-bottom">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white">
            {type === "credit" ? "Nouvelle Vente à Crédit" : "Encaisser un Paiement"}
          </h3>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white"><X size={20} /></button>
        </div>

        <form onSubmit={handleSave} className="space-y-3">
          {!presetClient && (
            <div>
              <label className="text-xs text-slate-400">Nom du Client</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Paul Adjovi"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white mt-1 outline-none focus:border-indigo-500"
              />
            </div>
          )}

          <div>
            <label className="text-xs text-slate-400">Montant (FCFA)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0"
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-base font-bold text-indigo-400 mt-1 outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="text-xs text-slate-400">Note / Article (Optionnel)</label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Ex: 2 sacs de ciment"
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white mt-1 outline-none focus:border-indigo-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 rounded-xl text-sm mt-2 transition-all"
          >
            Enregistrer
          </button>
        </form>
      </div>
    </div>
  );
}

function PaywallModal({ onClose, onPay }) {
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-end justify-center">
      <div className="w-full max-w-md bg-[#0D1117] border-t border-slate-800 rounded-t-3xl p-6 space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-base">
            <Crown size={20} /> L'Ardoise Premium
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white"><X size={20} /></button>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed">
          Débloquez la gestion illimitée de vos clients et activez les relances automatiques par Mobile Money (MTN / Moov) via FedaPay.
        </p>

        <div className="space-y-2">
          <button
            onClick={() => onPay(2000)}
            className="w-full bg-slate-900 border border-slate-800 hover:border-indigo-500 p-4 rounded-2xl flex items-center justify-between text-left transition-all"
          >
            <div>
              <div className="text-sm font-bold text-white">Abonnement Mensuel</div>
              <div className="text-xs text-slate-500">Facturé chaque mois</div>
            </div>
            <div className="text-sm font-extrabold text-amber-400">2 000 F CFA</div>
          </button>

          <button
            onClick={() => onPay(10500)}
            className="w-full bg-slate-900 border border-amber-500/30 p-4 rounded-2xl flex items-center justify-between text-left transition-all relative overflow-hidden"
          >
            <div>
              <div className="text-sm font-bold text-white">Abonnement Annuel</div>
              <div className="text-xs text-emerald-400">Économisez 2 mois !</div>
            </div>
            <div className="text-sm font-extrabold text-amber-400">10 500 F CFA</div>
          </button>
        </div>
      </div>
    </div>
  );
}
