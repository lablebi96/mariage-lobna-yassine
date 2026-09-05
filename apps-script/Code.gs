/**
 * RSVP — Lobna & Yassine
 * =============================================================================
 * Ce script reçoit les réponses du formulaire du site, les ajoute à un Google
 * Sheet et prévient les mariés par e-mail.
 *
 * INSTALLATION (5 minutes, détaillée dans le README du dépôt) :
 *   1. Créer un Google Sheet vide.
 *   2. Menu  Extensions ▸ Apps Script.
 *   3. Effacer le contenu du fichier et coller CE fichier entier.
 *   4. Renseigner EMAIL_NOTIFICATION ci-dessous.
 *   5. Déployer ▸ Nouveau déploiement ▸ type « Application web »
 *        - Exécuter en tant que :  Moi
 *        - Qui a accès :           Tout le monde        ← indispensable
 *   6. Copier l'URL qui se termine par /exec et la coller dans
 *      docs/mariage-lobna-yassine/js/config.js  →  rsvp.endpoint
 *
 * ⚠ Après CHAQUE modification de ce fichier, il faut refaire
 *   « Déployer ▸ Gérer les déploiements ▸ Modifier ▸ Version : Nouvelle ».
 *   Sans cette étape, l'ancienne version continue de tourner.
 */

/* --- À COMPLÉTER ---------------------------------------------------------- */

/** Adresse (ou adresses, séparées par des virgules) prévenue à chaque réponse. */
var EMAIL_NOTIFICATION = "";

/** Nom de l'onglet où sont écrites les réponses. Créé automatiquement. */
var NOM_ONGLET = "RSVP";

/* -------------------------------------------------------------------------- */

var COLONNES = [
  "Horodatage", "Nom", "Présence", "Personnes", "Repas / allergies", "Message"
];

/**
 * Appelé par le site à chaque envoi du formulaire.
 * Le site poste en mode "no-cors" : il ne lira jamais cette réponse. Ce qui
 * fait foi, c'est la ligne ajoutée au Sheet et l'e-mail de notification.
 */
function doPost(e) {
  try {
    var p = (e && e.parameter) ? e.parameter : {};

    // Un envoi sans nom est soit un test, soit un robot : on l'ignore
    // silencieusement plutôt que de polluer le tableau.
    var nom = String(p.nom || "").trim();
    if (!nom) {
      return reponse({ status: "ignore", raison: "nom vide" });
    }

    var ligne = [
      new Date(),
      nom,
      String(p.presence || ""),
      String(p.personnes || ""),
      String(p.regime || ""),
      String(p.message || "")
    ];

    feuille().appendRow(ligne);
    notifier(ligne);

    return reponse({ status: "ok" });

  } catch (err) {
    // On journalise sans jamais renvoyer d'erreur au navigateur : le site
    // ne peut pas la lire de toute façon (no-cors).
    console.error("Échec de l'enregistrement RSVP : " + err);
    return reponse({ status: "erreur" });
  }
}

/**
 * Ouvrir l'URL /exec dans un navigateur affiche ce message.
 * C'est le moyen le plus rapide de vérifier que le déploiement est en ligne.
 */
function doGet() {
  return reponse({
    status: "ok",
    message: "Le point de collecte RSVP fonctionne. Les réponses arrivent par POST."
  });
}

/** Renvoie l'onglet des réponses, en le créant avec ses en-têtes si besoin. */
function feuille() {
  var classeur = SpreadsheetApp.getActiveSpreadsheet();
  var onglet = classeur.getSheetByName(NOM_ONGLET);

  if (!onglet) {
    onglet = classeur.insertSheet(NOM_ONGLET);
  }

  if (onglet.getLastRow() === 0) {
    onglet.appendRow(COLONNES);
    onglet.getRange(1, 1, 1, COLONNES.length).setFontWeight("bold");
    onglet.setFrozenRows(1);
    onglet.setColumnWidth(1, 150);
    onglet.setColumnWidth(2, 200);
    onglet.setColumnWidth(5, 260);
    onglet.setColumnWidth(6, 320);
  }

  return onglet;
}

/**
 * Prévient les mariés. Volontairement non bloquant : si l'envoi du mail
 * échoue (quota Gmail atteint, adresse invalide), la réponse est DÉJÀ dans
 * le tableau — perdre la notification ne doit jamais faire perdre le RSVP.
 */
function notifier(ligne) {
  if (!EMAIL_NOTIFICATION) { return; }

  try {
    var vient = String(ligne[2]).toLowerCase().indexOf("oui") === 0;
    var sujet = (vient ? "✅ " : "❌ ") + "RSVP — " + ligne[1];

    var corps =
      "Nouvelle réponse reçue sur le site du mariage.\n\n" +
      "Nom ................ " + ligne[1] + "\n" +
      "Présence ........... " + ligne[2] + "\n" +
      "Personnes .......... " + ligne[3] + "\n" +
      "Repas / allergies .. " + (ligne[4] || "—") + "\n" +
      "Message ............ " + (ligne[5] || "—") + "\n\n" +
      "Tableau complet : " + SpreadsheetApp.getActiveSpreadsheet().getUrl();

    MailApp.sendEmail(EMAIL_NOTIFICATION, sujet, corps);
  } catch (err) {
    console.error("Notification e-mail impossible : " + err);
  }
}

/** Petite aide : renvoie du JSON. */
function reponse(objet) {
  return ContentService
    .createTextOutput(JSON.stringify(objet))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Bonus — à lancer une seule fois depuis l'éditeur Apps Script (bouton
 * « Exécuter ») pour vérifier que tout fonctionne SANS passer par le site :
 * une ligne de test doit apparaître dans le Sheet et un e-mail arriver.
 */
function testerEnregistrement() {
  doPost({ parameter: {
    nom: "Test — à supprimer",
    presence: "Oui",
    personnes: "2",
    regime: "Sans gluten",
    message: "Ceci est un test."
  }});
}
