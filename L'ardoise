import React, { useState, useEffect, useMemo } from "react";
import {
  Plus, ChevronLeft, X, Check, Phone, Search, PackageOpen,
  Eye, EyeOff, User, LogOut, Crown, Bell, BarChart3, Lock,
} from "lucide-react";

const C = {
  ink: "#16231D",
  inkLight: "#1F2E28",
  paper: "#F6EFE4",
  chalk: "#F3F1E7",
  mustard: "#E4A73B",
  terracotta: "#C4552E",
  teal: "#3E8E7E",
  line: "rgba(243,241,231,0.14)",
  muted: "rgba(243,241,231,0.55)",
};

const TAPE_COLORS = [C.mustard, C.terracotta, C.teal];
const FREE_CLIENT_LIMIT = 15;
const USERS_KEY = "ardoise-users-v1";
const SESSION_KEY = "ardoise-session-v1";

function hashRotate(id) {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) % 360;
  return (h % 7) - 3;
}
function fcfa(n) {
  return Math.round(n).toLocaleString("fr-FR") + " F";
}
function todayISO() {
  return new Date().toISOString().slice(0, 10);
}
function daysAgo(iso) {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 86400000);
  if (diff <= 0) return "aujourd'hui";
  if (diff === 1) return "hier";
  return `il y a ${diff} j`;
}
function balanceOf(client) {
  return client.transactions.reduce((s, t) => s + (t.type === "credit" ? t.amount : -t.amount), 0);
}
function clientsKey(email) {
  return `ardoise-clients-${email}`;
}

export default function App() {
  const [booted, setBooted] = useState(false);
  const [users, setUsers] = useState({});
  const [session, setSession] = useState(null); // {email}
  const [toast, setToast] = useState(null);

  useEffect(() => {
    (async () => {
      let u = {};
      let s = null;
      try {
        const ur = await window.storage.get(USERS_KEY, false);
        if (ur) u = JSON.parse(ur.value);
      } catch {}
      try {
        const sr = await window.storage.get(SESSION_KEY, false);
        if (sr) s = JSON.parse(sr.value);
      } catch {}
      setUsers(u);
      setSession(s);
      setBooted(true);
    })();
  }, []);

  useEffect(() => {
    if (!booted) return;
    window.storage.set(USERS_KEY, JSON.stringify(users), false).catch(() => {});
  }, [users, booted]);

  useEffect(() => {
    if (!booted) return;
    window.storage.set(SESSION_KEY, JSON.stringify(session), false).catch(() => {});
  }, [session, booted]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2600);
    return () => clearTimeout(t);
  }, [toast]);

  if (!booted) {
    return (
      <div style={{ background: C.ink, height: "100vh" }} className="flex items-center justify-center">
        <div style={{ color: C.muted, fontFamily: "Inter, sans-serif" }}>Chargement…</div>
      </div>
    );
  }

  return (
    <div style={{ background: C.ink, minHeight: "100vh", fontFamily: "Inter, sans-serif" }} className="w-full flex justify-center">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600..800&family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@500;600&display=swap');
        * { box-sizing: border-box; }
        input, textarea { outline: none; }
        input::placeholder { color: rgba(22,35,29,0.4); }
      `}</style>
      <div className="w-full max-w-md relative" style={{ minHeight: "100vh" }}>
        {!session ? (
          <AuthScreen
            users={users}
            onAuth={(email, userRecord) => {
              setUsers((prev) => ({ ...prev, [email]: userRecord }));
              setSession({ email });
            }}
            onResetPassword={(email, newPassword) => {
              setUsers((prev) => ({ ...prev, [email]: { ...prev[email], password: newPassword } }));
            }}
          />
        ) : (
          <MainApp
            email={session.email}
            user={users[session.email]}
            setUser={(updater) =>
              setUsers((prev) => ({ ...prev, [session.email]: updater(prev[session.email]) }))
            }
            onLogout={() => setSession(null)}
            toast={toast}
            setToast={setToast}
          />
        )}
        {toast && !session && null}
      </div>
    </div>
  );
}

/* ---------------- AUTH ---------------- */

function AuthScreen({ users, onAuth, onResetPassword }) {
  const [mode, setMode] = useState("login"); // login | signup | reset
  const [name, setName] = useState("");
  const [boutique, setBoutique] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  function validEmail(v) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
  }

  function submit() {
    setError("");
    setInfo("");
    const e = email.trim().toLowerCase();

    if (mode === "reset") {
      if (!validEmail(e)) return setError("Entrez un email valide.");
      if (!users[e]) return setError("Aucun compte avec cet email.");
      if (newPassword.length < 6) return setError("Nouveau mot de passe : 6 caractères minimum.");
      onResetPassword(e, newPassword);
      setInfo("Mot de passe mis à jour. Connectez-vous.");
      setMode("login");
      setPassword("");
      setNewPassword("");
      return;
    }

    if (!validEmail(e)) return setError("Entrez un email valide.");
    if (password.length < 6) return setError("Mot de passe : 6 caractères minimum.");

    if (mode === "signup") {
      if (users[e]) return setError("Un compte existe déjà avec cet email.");
      if (!name.trim()) return setError("Entrez votre nom.");
      onAuth(e, {
        name: name.trim(),
        boutique: boutique.trim(),
        password, // démo locale uniquement — un vrai backend hasherait ce mot de passe
        isPremium: false,
      });
    } else {
      const u = users[e];
      if (!u || u.password !== password) return setError("Email ou mot de passe incorrect.");
      onAuth(e, u);
    }
  }

  const titles = {
    login: "Content de vous revoir",
    signup: "Créer votre compte",
    reset: "Réinitialiser le mot de passe",
  };

  return (
    <div className="min-h-screen flex flex-col justify-center px-7 py-10">
      <div className="mb-8 text-center">
        <div style={{ color: C.mustard, fontSize: 12, letterSpacing: "0.2em" }} className="uppercase font-semibold mb-2">
          L'Ardoise
        </div>
        <div style={{ color: C.chalk, fontFamily: "'Fraunces', serif", fontWeight: 700, fontSize: 28 }}>
          {titles[mode]}
        </div>
        <div style={{ color: C.muted, fontSize: 13 }} className="mt-1">
          Vos ventes à crédit, jamais perdues
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {mode === "signup" && (
          <>
            <Field label="Votre nom" value={name} onChange={setName} placeholder="Ex : Rosine Adjovi" />
            <Field label="Nom de la boutique (optionnel)" value={boutique} onChange={setBoutique} placeholder="Ex : Boutique Rosine" />
          </>
        )}

        <Field label="Email" value={email} onChange={setEmail} placeholder="vous@exemple.com" type="email" />

        {mode !== "reset" && (
          <div>
            <label style={{ color: C.muted, fontSize: 12 }}>Mot de passe</label>
            <div className="flex items-center rounded-lg mt-1" style={{ background: C.inkLight, border: `1px solid ${C.line}` }}>
              <input
                type={showPwd ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="6 caractères minimum"
                className="flex-1 px-3 py-2.5 bg-transparent"
                style={{ color: C.chalk, fontSize: 14 }}
              />
              <button onClick={() => setShowPwd((s) => !s)} className="px-3" style={{ color: C.muted }}>
                {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
        )}

        {mode === "reset" && (
          <div>
            <label style={{ color: C.muted, fontSize: 12 }}>Nouveau mot de passe</label>
            <div className="flex items-center rounded-lg mt-1" style={{ background: C.inkLight, border: `1px solid ${C.line}` }}>
              <input
                type={showPwd ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="6 caractères minimum"
                className="flex-1 px-3 py-2.5 bg-transparent"
                style={{ color: C.chalk, fontSize: 14 }}
              />
              <button onClick={() => setShowPwd((s) => !s)} className="px-3" style={{ color: C.muted }}>
                {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
        )}

        {mode === "login" && (
          <button
            onClick={() => {
              setError("");
              setInfo("");
              setMode("reset");
            }}
            className="text-right"
            style={{ color: C.muted, fontSize: 12 }}
          >
            Mot de passe oublié ?
          </button>
        )}

        {error && <div style={{ color: C.terracotta, fontSize: 13 }}>{error}</div>}
        {info && <div style={{ color: C.teal, fontSize: 13 }}>{info}</div>}

        <button
          onClick={submit}
          className="w-full rounded-xl py-3.5 font-semibold text-sm mt-2 active:scale-95 transition-transform"
          style={{ background: C.terracotta, color: C.chalk }}
        >
          {mode === "login" ? "Se connecter" : mode === "signup" ? "Créer mon compte" : "Réinitialiser"}
        </button>

        {mode === "reset" ? (
          <button
            onClick={() => {
              setError("");
              setInfo("");
              setMode("login");
            }}
            className="text-center mt-1"
            style={{ color: C.muted, fontSize: 13 }}
          >
            Retour à la <span style={{ color: C.mustard, fontWeight: 600 }}>connexion</span>
          </button>
        ) : (
          <button
            onClick={() => {
              setError("");
              setInfo("");
              setMode(mode === "login" ? "signup" : "login");
            }}
            className="text-center mt-1"
            style={{ color: C.muted, fontSize: 13 }}
          >
            {mode === "login" ? (
              <>Pas de compte ? <span style={{ color: C.mustard, fontWeight: 600 }}>Inscrivez-vous</span></>
            ) : (
              <>Déjà un compte ? <span style={{ color: C.mustard, fontWeight: 600 }}>Connectez-vous</span></>
            )}
          </button>
        )}
      </div>
    </div>
  );
}

function Field({ label, value, onChange, placeholder, type = "text" }) {
  return (
    <div>
      <label style={{ color: C.muted, fontSize: 12 }}>{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg px-3 py-2.5 mt-1"
        style={{ background: C.inkLight, border: `1px solid ${C.line}`, color: C.chalk, fontSize: 14 }}
      />
    </div>
  );
}

/* ---------------- MAIN APP ---------------- */

function MainApp({ email, user, setUser, onLogout, toast, setToast }) {
  const [clients, setClients] = useState(null);
  const [view, setView] = useState({ name: "home" });
  const [modal, setModal] = useState(null);
  const [query, setQuery] = useState("");
  const [showPaywall, setShowPaywall] = useState(false);
  const [showAccount, setShowAccount] = useState(false);

  const key = clientsKey(email);

  useEffect(() => {
    (async () => {
      try {
        const res = await window.storage.get(key, false);
        setClients(res ? JSON.parse(res.value) : []);
      } catch {
        setClients([]);
      }
    })();
  }, [key]);

  useEffect(() => {
    if (clients === null) return;
    window.storage.set(key, JSON.stringify(clients), false).catch(() => {});
  }, [clients, key]);

  const isPremium = !!user?.isPremium;

  const total = useMemo(() => (clients || []).reduce((s, c) => s + Math.max(0, balanceOf(c)), 0), [clients]);

  const filtered = useMemo(() => {
    const list = (clients || []).map((c) => ({ ...c, balance: balanceOf(c) }))
      .sort((a, b) => b.balance - a.balance || a.name.localeCompare(b.name));
    if (!query.trim()) return list;
    return list.filter((c) => c.name.toLowerCase().includes(query.trim().toLowerCase()));
  }, [clients, query]);

  function saveTransaction({ clientName, clientId, phone, amount, note, mode }) {
    const existingCount = (clients || []).length;
    const isNewClient = !clientId && !(clients || []).some(
      (c) => c.name.trim().toLowerCase() === clientName.trim().toLowerCase()
    );
    if (isNewClient && !isPremium && existingCount >= FREE_CLIENT_LIMIT) {
      setModal(null);
      setShowPaywall(true);
      return;
    }
    setClients((prev) => {
      let list = [...prev];
      let id = clientId;
      if (!id) {
        const existing = list.find((c) => c.name.trim().toLowerCase() === clientName.trim().toLowerCase());
        if (existing) id = existing.id;
      }
      if (!id) {
        id = "c_" + Date.now();
        list.push({ id, name: clientName.trim(), phone: phone || "", transactions: [] });
      }
      list = list.map((c) => {
        if (c.id !== id) return c;
        const updated = {
          ...c,
          phone: phone ? phone : c.phone,
          transactions: [...c.transactions, { id: "t_" + Date.now(), type: mode, amount: Number(amount), note, date: todayISO() }],
        };
        if (mode === "payment" && balanceOf(updated) <= 0) {
          setToast({ text: `Ardoise de ${updated.name} effacée` });
        } else if (mode === "credit") {
          setToast({ text: `Vente enregistrée pour ${updated.name}` });
        } else {
          setToast({ text: `Paiement enregistré pour ${updated.name}` });
        }
        return updated;
      });
      return list;
    });
    setModal(null);
  }

  function activatePremium(plan) {
    setUser((u) => ({ ...u, isPremium: true, plan }));
    setShowPaywall(false);
    setToast({ text: "Premium activé — merci !" });
  }

  if (clients === null) {
    return <div style={{ color: C.muted, padding: 40 }}>Chargement…</div>;
  }

  const selectedClient = view.name === "detail" ? clients.find((c) => c.id === view.clientId) : null;

  return (
    <>
      {view.name === "home" && (
        <Home
          user={user}
          isPremium={isPremium}
          total={total}
          query={query}
          setQuery={setQuery}
          filtered={filtered}
          onOpenClient={(id) => setView({ name: "detail", clientId: id })}
          onNewCredit={() => setModal({ mode: "credit" })}
          onOpenAccount={() => setShowAccount(true)}
          onOpenPremium={() => setShowPaywall(true)}
          onOpenStats={() => (isPremium ? setView({ name: "stats" }) : setShowPaywall(true))}
        />
      )}

      {view.name === "stats" && (
        <Stats clients={clients} onBack={() => setView({ name: "home" })} />
      )}

      {view.name === "detail" && selectedClient && (
        <ClientDetail
          client={{ ...selectedClient, balance: balanceOf(selectedClient) }}
          isPremium={isPremium}
          onBack={() => setView({ name: "home" })}
          onPay={() => setModal({ mode: "payment", client: selectedClient })}
          onCredit={() => setModal({ mode: "credit", client: selectedClient })}
          onRelance={() => setToast({ text: `Rappel envoyé à ${selectedClient.name} (démo)` })}
          onLockedRelance={() => setShowPaywall(true)}
        />
      )}

      {modal && (
        <TxModal modal={modal} clients={clients} onClose={() => setModal(null)} onSave={saveTransaction} />
      )}

      {showAccount && (
        <AccountSheet user={user} email={email} isPremium={isPremium} onLogout={onLogout} onClose={() => setShowAccount(false)} onOpenPremium={() => { setShowAccount(false); setShowPaywall(true); }} />
      )}

      {showPaywall && <Paywall onClose={() => setShowPaywall(false)} onActivate={activatePremium} />}

      {toast && (
        <div className="fixed left-1/2 bottom-6 -translate-x-1/2 px-4 py-3 rounded-xl text-sm font-medium shadow-lg z-50" style={{ background: C.teal, color: C.ink }}>
          🎉 {toast.text}
        </div>
      )}
    </>
  );
}

/* ---------------- HOME ---------------- */

function Home({ user, isPremium, total, query, setQuery, filtered, onOpenClient, onNewCredit, onOpenAccount, onOpenPremium, onOpenStats }) {
  return (
    <div className="pb-28">
      <div className="px-6 pt-8 pb-1 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div style={{ color: C.mustard, fontSize: 12, letterSpacing: "0.18em" }} className="uppercase font-semibold">
            L'Ardoise
          </div>
          {isPremium && <Crown size={13} color={C.mustard} />}
        </div>
        <div className="flex items-center gap-3">
          <button onClick={onOpenStats} style={{ color: C.muted }}>
            <BarChart3 size={19} />
          </button>
          <button onClick={onOpenAccount} style={{ color: C.muted }}>
            <User size={19} />
          </button>
        </div>
      </div>

      <div className="px-6 pt-3 pb-5">
        <div style={{ color: C.muted, fontSize: 13 }} className="mb-1">Total à recouvrer</div>
        <div style={{ color: C.chalk, fontFamily: "'Fraunces', serif", fontWeight: 700, fontSize: 46, lineHeight: 1.05 }}>
          {fcfa(total)}
        </div>
        <div style={{ color: C.muted, fontSize: 13 }} className="mt-1">
          {filtered.length} client{filtered.length !== 1 ? "s" : ""} sur l'ardoise
        </div>
      </div>

      {!isPremium && (
        <div className="px-6 mb-4">
          <button
            onClick={onOpenPremium}
            className="w-full flex items-center justify-between rounded-xl px-4 py-3"
            style={{ background: "linear-gradient(90deg, rgba(228,167,59,0.18), rgba(196,85,46,0.18))", border: `1px solid ${C.line}` }}
          >
            <div className="flex items-center gap-2">
              <Crown size={16} color={C.mustard} />
              <span style={{ color: C.chalk, fontSize: 13, fontWeight: 600 }}>Passer à Premium</span>
            </div>
            <span style={{ color: C.mustard, fontSize: 12 }}>Voir →</span>
          </button>
        </div>
      )}

      <div className="px-6 mb-4">
        <div className="flex items-center gap-2 rounded-xl px-3 py-2.5" style={{ background: C.inkLight, border: `1px solid ${C.line}` }}>
          <Search size={16} color={C.muted} />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Chercher un client…" style={{ background: "transparent", color: C.chalk, fontSize: 14, width: "100%" }} />
        </div>
      </div>

      <div className="px-6 flex flex-col gap-3">
        {filtered.length === 0 && (
          <div className="flex flex-col items-center text-center mt-16" style={{ color: C.muted }}>
            <PackageOpen size={34} className="mb-3" />
            <div style={{ fontSize: 14 }}>{query ? "Aucun client trouvé." : "Aucune vente à crédit pour l'instant."}</div>
            {!query && <div style={{ fontSize: 13 }} className="mt-1">Appuyez sur + pour ajouter la première.</div>}
          </div>
        )}
        {filtered.map((c) => (
          <ClientCard key={c.id} client={c} onClick={() => onOpenClient(c.id)} />
        ))}
      </div>

      <button
        onClick={onNewCredit}
        className="fixed rounded-full flex items-center gap-2 px-5 py-4 shadow-lg active:scale-95 transition-transform"
        style={{ background: C.terracotta, color: C.chalk, right: "max(1.5rem, calc(50% - 12rem))", bottom: "1.5rem", fontWeight: 600, fontSize: 14 }}
      >
        <Plus size={18} /> Vente à crédit
      </button>
    </div>
  );
}

function ClientCard({ client, onClick }) {
  const rot = hashRotate(client.id);
  const tape = TAPE_COLORS[Math.abs(client.id.length + client.name.length) % TAPE_COLORS.length];
  const last = client.transactions[client.transactions.length - 1];
  const settled = client.balance <= 0;
  return (
    <button onClick={onClick} className="relative text-left rounded-xl px-4 py-4 active:scale-[0.98] transition-transform" style={{ background: C.paper, transform: `rotate(${rot * 0.4}deg)`, boxShadow: "0 3px 10px rgba(0,0,0,0.25)" }}>
      <div className="absolute -top-2 left-5 w-10 h-4 rounded-sm" style={{ background: tape, opacity: 0.85, transform: `rotate(${rot}deg)` }} />
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <div style={{ color: C.ink, fontWeight: 600, fontSize: 15 }} className="truncate">{client.name}</div>
          <div style={{ color: "rgba(22,35,29,0.55)", fontSize: 12 }} className="mt-0.5">{last ? daysAgo(last.date) : "—"}</div>
        </div>
        <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontWeight: 600, fontSize: 16, color: settled ? C.teal : C.terracotta, whiteSpace: "nowrap" }}>
          {settled ? "Soldé ✓" : fcfa(client.balance)}
        </div>
      </div>
    </button>
  );
}

/* ---------------- CLIENT DETAIL ---------------- */

function ClientDetail({ client, isPremium, onBack, onPay, onCredit, onRelance, onLockedRelance }) {
  const history = [...client.transactions].reverse();
  const settled = client.balance <= 0;
  return (
    <div className="pb-28">
      <div className="px-6 pt-8 pb-4 flex items-center gap-3">
        <button onClick={onBack} style={{ color: C.chalk }}><ChevronLeft size={22} /></button>
        <div style={{ color: C.chalk, fontWeight: 600, fontSize: 17 }} className="truncate">{client.name}</div>
      </div>

      <div className="px-6 mb-6">
        <div style={{ color: C.muted, fontSize: 13 }}>Doit actuellement</div>
        <div style={{ color: settled ? C.teal : C.mustard, fontFamily: "'Fraunces', serif", fontWeight: 700, fontSize: 40 }}>
          {settled ? "0 F ✓" : fcfa(client.balance)}
        </div>
      </div>

      <div className="px-6 flex gap-3 mb-3">
        <button onClick={onPay} className="flex-1 rounded-xl py-3 font-semibold text-sm active:scale-95 transition-transform" style={{ background: C.teal, color: C.ink }}>
          Il/elle paie
        </button>
        <button onClick={onCredit} className="flex-1 rounded-xl py-3 font-semibold text-sm active:scale-95 transition-transform" style={{ background: C.terracotta, color: C.chalk }}>
          Nouvelle vente
        </button>
      </div>

      {!settled && (
        <div className="px-6 mb-6">
          <button
            onClick={isPremium ? onRelance : onLockedRelance}
            className="w-full flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-medium"
            style={{ background: C.inkLight, border: `1px solid ${C.line}`, color: isPremium ? C.chalk : C.muted }}
          >
            {isPremium ? <Bell size={14} /> : <Lock size={13} />} Envoyer un rappel
          </button>
        </div>
      )}

      <div className="px-6">
        <div style={{ color: C.muted, fontSize: 12 }} className="uppercase tracking-wide mb-2">Historique</div>
        <div className="flex flex-col gap-2">
          {history.length === 0 && <div style={{ color: C.muted, fontSize: 13 }}>Aucune opération encore.</div>}
          {history.map((t) => (
            <div key={t.id} className="flex items-center justify-between rounded-lg px-3 py-2.5" style={{ background: C.inkLight, border: `1px solid ${C.line}` }}>
              <div>
                <div style={{ color: C.chalk, fontSize: 13 }}>{t.type === "credit" ? "Vente à crédit" : "Paiement reçu"}</div>
                <div style={{ color: C.muted, fontSize: 11 }}>{t.note ? t.note + " · " : ""}{daysAgo(t.date)}</div>
              </div>
              <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontWeight: 600, fontSize: 14, color: t.type === "credit" ? C.terracotta : C.teal }}>
                {t.type === "credit" ? "+" : "−"}{fcfa(t.amount)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------------- STATS (premium) ---------------- */

function Stats({ clients, onBack }) {
  const late = clients.filter((c) => {
    const bal = balanceOf(c);
    if (bal <= 0) return false;
    const last = c.transactions[c.transactions.length - 1];
    if (!last) return false;
    const diff = (Date.now() - new Date(last.date).getTime()) / 86400000;
    return diff > 7;
  });
  const recoveredThisMonth = clients.reduce((s, c) => {
    const now = new Date();
    return s + c.transactions
      .filter((t) => t.type === "payment" && new Date(t.date).getMonth() === now.getMonth() && new Date(t.date).getFullYear() === now.getFullYear())
      .reduce((a, t) => a + t.amount, 0);
  }, 0);
  const best = [...clients].sort((a, b) => balanceOf(b) - balanceOf(a))[0];

  return (
    <div className="pb-28">
      <div className="px-6 pt-8 pb-6 flex items-center gap-3">
        <button onClick={onBack} style={{ color: C.chalk }}><ChevronLeft size={22} /></button>
        <div style={{ color: C.chalk, fontWeight: 600, fontSize: 17 }}>Statistiques</div>
        <Crown size={14} color={C.mustard} />
      </div>

      <div className="px-6 flex flex-col gap-3">
        <StatCard label="Recouvré ce mois-ci" value={fcfa(recoveredThisMonth)} color={C.teal} />
        <StatCard label="Clients en retard (+7 j)" value={String(late.length)} color={C.terracotta} />
        <StatCard label="Plus grosse ardoise" value={best ? `${best.name} · ${fcfa(balanceOf(best))}` : "—"} color={C.mustard} />
      </div>

      {late.length > 0 && (
        <div className="px-6 mt-6">
          <div style={{ color: C.muted, fontSize: 12 }} className="uppercase tracking-wide mb-2">À relancer en priorité</div>
          <div className="flex flex-col gap-2">
            {late.map((c) => (
              <div key={c.id} className="flex items-center justify-between rounded-lg px-3 py-2.5" style={{ background: C.inkLight, border: `1px solid ${C.line}` }}>
                <span style={{ color: C.chalk, fontSize: 13 }}>{c.name}</span>
                <span style={{ color: C.terracotta, fontFamily: "'IBM Plex Mono', monospace", fontSize: 13, fontWeight: 600 }}>{fcfa(balanceOf(c))}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, color }) {
  return (
    <div className="rounded-xl px-4 py-3.5" style={{ background: C.inkLight, border: `1px solid ${C.line}` }}>
      <div style={{ color: C.muted, fontSize: 12 }}>{label}</div>
      <div style={{ color, fontFamily: "'Fraunces', serif", fontWeight: 700, fontSize: 22 }} className="mt-0.5">{value}</div>
    </div>
  );
}

/* ---------------- TRANSACTION MODAL ---------------- */

function TxModal({ modal, clients, onClose, onSave }) {
  const isPayment = modal.mode === "payment";
  const preset = modal.client;
  const [name, setName] = useState(preset ? preset.name : "");
  const [phone, setPhone] = useState(preset ? preset.phone || "" : "");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const canSave = name.trim().length > 0 && Number(amount) > 0;

  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center" style={{ background: "rgba(0,0,0,0.55)" }}>
      <div className="w-full max-w-md rounded-t-2xl px-6 pt-5 pb-8" style={{ background: C.paper }}>
        <div className="flex items-center justify-between mb-4">
          <div style={{ color: C.ink, fontWeight: 700, fontSize: 16 }}>
            {isPayment ? `Paiement de ${preset?.name}` : "Nouvelle vente à crédit"}
          </div>
          <button onClick={onClose}><X size={20} color={C.ink} /></button>
        </div>

        {!isPayment && !preset && (
          <div className="mb-3">
            <label style={{ color: "rgba(22,35,29,0.6)", fontSize: 12 }}>Nom du client</label>
            <input list="clients-datalist" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex : Rosine" className="w-full rounded-lg px-3 py-2.5 mt-1" style={{ background: C.chalk, color: C.ink, fontSize: 14 }} />
            <datalist id="clients-datalist">
              {clients.map((c) => <option key={c.id} value={c.name} />)}
            </datalist>
          </div>
        )}

        <div className="mb-3">
          <label style={{ color: "rgba(22,35,29,0.6)", fontSize: 12 }}>Montant (FCFA)</label>
          <input type="number" inputMode="numeric" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0" className="w-full rounded-lg px-3 py-2.5 mt-1" style={{ background: C.chalk, color: C.ink, fontSize: 20, fontFamily: "'IBM Plex Mono', monospace", fontWeight: 600 }} />
        </div>

        <div className="mb-3">
          <label style={{ color: "rgba(22,35,29,0.6)", fontSize: 12 }}>{isPayment ? "Note (optionnel)" : "Article (optionnel)"}</label>
          <input value={note} onChange={(e) => setNote(e.target.value)} placeholder={isPayment ? "Ex : versement partiel" : "Ex : 2 sacs de riz"} className="w-full rounded-lg px-3 py-2.5 mt-1" style={{ background: C.chalk, color: C.ink, fontSize: 14 }} />
        </div>

        {!isPayment && !preset && (
          <div className="mb-4">
            <label style={{ color: "rgba(22,35,29,0.6)", fontSize: 12 }}>Téléphone (optionnel)</label>
            <div className="flex items-center gap-2 rounded-lg px-3 py-2.5 mt-1" style={{ background: C.chalk }}>
              <Phone size={14} color="rgba(22,35,29,0.5)" />
              <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Ex : 97 00 00 00" style={{ background: "transparent", color: C.ink, fontSize: 14, width: "100%" }} />
            </div>
          </div>
        )}

        <button
          disabled={!canSave}
          onClick={() => onSave({ clientName: preset ? preset.name : name, clientId: preset ? preset.id : undefined, phone, amount, note, mode: modal.mode })}
          className="w-full rounded-xl py-3.5 font-semibold text-sm flex items-center justify-center gap-2 active:scale-95 transition-transform disabled:opacity-40"
          style={{ background: C.ink, color: C.chalk }}
        >
          <Check size={16} /> Enregistrer
        </button>
      </div>
    </div>
  );
}

/* ---------------- ACCOUNT SHEET ---------------- */

function AccountSheet({ user, email, isPremium, onLogout, onClose, onOpenPremium }) {
  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center" style={{ background: "rgba(0,0,0,0.55)" }}>
      <div className="w-full max-w-md rounded-t-2xl px-6 pt-5 pb-8" style={{ background: C.paper }}>
        <div className="flex items-center justify-between mb-5">
          <div style={{ color: C.ink, fontWeight: 700, fontSize: 16 }}>Mon compte</div>
          <button onClick={onClose}><X size={20} color={C.ink} /></button>
        </div>
        <div className="mb-1" style={{ color: C.ink, fontWeight: 600, fontSize: 15 }}>{user?.name}</div>
        {user?.boutique && <div style={{ color: "rgba(22,35,29,0.6)", fontSize: 13 }} className="mb-1">{user.boutique}</div>}
        <div style={{ color: "rgba(22,35,29,0.6)", fontSize: 13 }} className="mb-4">{email}</div>

        <div className="flex items-center gap-2 rounded-lg px-3 py-2.5 mb-5" style={{ background: isPremium ? "rgba(228,167,59,0.18)" : C.chalk }}>
          <Crown size={15} color={isPremium ? C.terracotta : "rgba(22,35,29,0.4)"} />
          <span style={{ color: C.ink, fontSize: 13, fontWeight: 600 }}>{isPremium ? "Compte Premium actif" : "Compte gratuit"}</span>
        </div>

        {!isPremium && (
          <button onClick={onOpenPremium} className="w-full rounded-xl py-3 font-semibold text-sm mb-3" style={{ background: C.terracotta, color: C.chalk }}>
            Passer à Premium
          </button>
        )}

        <button onClick={onLogout} className="w-full flex items-center justify-center gap-2 rounded-xl py-3 font-semibold text-sm" style={{ background: C.ink, color: C.chalk }}>
          <LogOut size={15} /> Se déconnecter
        </button>
      </div>
    </div>
  );
}

/* ---------------- PAYWALL ---------------- */

function Paywall({ onClose, onActivate }) {
  const [plan, setPlan] = useState("monthly");
  const [loading, setLoading] = useState(false);

  function subscribe() {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onActivate(plan);
    }, 1100);
  }

  const perks = [
    "Clients illimités (contre 15 en gratuit)",
    "Rappels de relance envoyés aux clients",
    "Statistiques de recouvrement",
    "Sauvegarde de vos données",
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center" style={{ background: "rgba(0,0,0,0.6)" }}>
      <div className="w-full max-w-md rounded-t-2xl px-6 pt-5 pb-8" style={{ background: C.paper }}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Crown size={18} color={C.terracotta} />
            <div style={{ color: C.ink, fontWeight: 700, fontSize: 17 }}>L'Ardoise Premium</div>
          </div>
          <button onClick={onClose}><X size={20} color={C.ink} /></button>
        </div>

        <div className="flex flex-col gap-2 mb-5">
          {perks.map((p) => (
            <div key={p} className="flex items-center gap-2">
              <Check size={14} color={C.teal} />
              <span style={{ color: C.ink, fontSize: 13 }}>{p}</span>
            </div>
          ))}
        </div>

        <div className="flex gap-3 mb-5">
          <PlanCard label="Mensuel" price="2 000 F/mois" active={plan === "monthly"} onClick={() => setPlan("monthly")} />
          <PlanCard label="Annuel" price="10 500 F/an" tag="~2 mois offerts" active={plan === "yearly"} onClick={() => setPlan("yearly")} />
        </div>

        <button onClick={subscribe} disabled={loading} className="w-full rounded-xl py-3.5 font-semibold text-sm active:scale-95 transition-transform disabled:opacity-60" style={{ background: C.terracotta, color: C.chalk }}>
          {loading ? "Activation…" : "S'abonner via Mobile Money"}
        </button>
        <div style={{ color: "rgba(22,35,29,0.5)", fontSize: 11 }} className="text-center mt-3">
          Démo — aucun paiement réel n'est effectué ici.
        </div>
      </div>
    </div>
  );
}

function PlanCard({ label, price, tag, active, onClick }) {
  return (
    <button onClick={onClick} className="flex-1 rounded-xl px-3 py-3 text-left" style={{ background: active ? C.ink : C.chalk, border: `2px solid ${active ? C.terracotta : "transparent"}` }}>
      <div style={{ color: active ? C.chalk : C.ink, fontWeight: 600, fontSize: 13 }}>{label}</div>
      <div style={{ color: active ? C.mustard : C.terracotta, fontWeight: 700, fontSize: 15 }} className="mt-0.5">{price}</div>
      {tag && <div style={{ color: active ? C.muted : "rgba(22,35,29,0.5)", fontSize: 10 }} className="mt-0.5">{tag}</div>}
    </button>
  );
}
