// --- CONFIGURATION DE FEDAPAY ---
const btnFedaPay = document.getElementById('btnFedaPay');

// 💡 Remplacer cette clé publique par votre propre clé publique FedaPay (Sandbox ou Live)
const FEDAPAY_PUBLIC_KEY = 'pk_sandbox_votre_cle_publique_ici'; 

btnFedaPay.addEventListener('click', () => {
    // 1. Vérifier si l'utilisateur est bien connecté à Internet
    if (!navigator.onLine) {
        alert("⚠️ Vous êtes actuellement hors-ligne. Les paiements Mobile Money / Carte via FedaPay nécessitent une connexion Internet.");
        return;
    }

    // 2. Initialiser la transaction FedaPay
    try {
        let widget = FedaPay.init({
            public_key: FEDAPAY_PUBLIC_KEY,
            transaction: {
                amount: 1000, // Montant en FCFA (ex: 1000 XOF)
                description: "Paiement pour service Ardoise Numérique"
            },
            customer: {
                email: "client@example.com",
                lastname: "Client",
                firstname: "Ardoise"
            },
            onComplete: function(response) {
                if (response.reason === FedaPay.DIALOG_DISMISSED) {
                    alert("Le paiement a été annulé par l'utilisateur.");
                } else if (response.reason === FedaPay.TRANSACTION_APPROVED) {
                    alert("🎉 Paiement réussi ! Transaction ID : " + response.transaction.id);
                    // Ici vous pouvez débloquer des fonctionnalités premium, sauvegarder l'image, etc.
                } else if (response.reason === FedaPay.TRANSACTION_CANCELLED) {
                    alert("Paiement refusé ou échoué.");
                }
            }
        });

        // 3. Ouvrir le guichet de paiement
        widget.open();

    } catch (error) {
        console.error("Erreur d'initialisation FedaPay :", error);
        alert("Impossible de charger la plateforme de paiement. Vérifiez votre clé FedaPay.");
    }
});
