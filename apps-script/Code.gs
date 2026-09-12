/**
 * RSVP — Lobna & Yassine
 * =============================================================================
 * Ce script reçoit les réponses du formulaire du site, les ajoute à un Google
 * Sheet et prévient les mariés par e-mail. Le tableau qui se remplit tout seul
 * EST la liste des invités : rien à saisir à la main.
 *
 * Le formulaire ne concerne que la cérémonie civile de L'Haÿ-les-Roses ; la
 * colonne « Événement » est là pour le jour où un second formulaire existera.
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
 *      docs/mariage-lobna-yassine/civil-2026-lhay/config.js  →  rsvp.endpoint
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

/** Places assises dans la salle des mariages, d'après la charte de la ville.
    Sert uniquement à afficher « 37 / 80 » dans l'e-mail. 0 = pas de limite. */
var CAPACITE_SALLE = 80;

/* -------------------------------------------------------------------------- */

var COLONNES = [
  "Horodatage", "Événement", "Prénom", "Nom", "Présence",
  "Accompagnants", "Total", "Repas / allergies", "Message"
];

/* Position (base 1) des colonnes lues par le compteur. Si vous réorganisez
   COLONNES, ces deux constantes sont les seules à suivre. */
var COL_PRESENCE = 5;
var COL_TOTAL    = 7;

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
    var prenom = String(p.prenom || "").trim();
    var nom = String(p.nom || "").trim();
    if (!prenom && !nom) {
      return reponse({ status: "ignore", raison: "nom vide" });
    }

    var presence = String(p.presence || "");
    var vient = presence.toLowerCase().indexOf("oui") === 0;

    // Les compteurs sont recalculés ici plutôt que repris tels quels : une
    // requête forgée à la main ne doit pas pouvoir écrire « 400 invités ».
    var accompagnants = Math.max(0, Math.min(50, entier(p.accompagnants)));
    var total = vient ? accompagnants + 1 : 0;

    var ligne = [
      new Date(),
      String(p.evenement || ""),
      prenom,
      nom,
      presence,
      vient ? accompagnants : 0,
      total,
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

/** Convertit une valeur de formulaire en entier, 0 si elle n'a aucun sens. */
function entier(valeur) {
  var n = parseInt(valeur, 10);
  return isNaN(n) ? 0 : n;
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
    onglet.setColumnWidth(1, 150);   // Horodatage
    onglet.setColumnWidth(2, 230);   // Événement
    onglet.setColumnWidth(3, 140);   // Prénom
    onglet.setColumnWidth(4, 140);   // Nom
    onglet.setColumnWidth(8, 260);   // Repas / allergies
    onglet.setColumnWidth(9, 320);   // Message
  }

  return onglet;
}

/**
 * Nombre de personnes attendues : somme de la colonne « Total » sur les
 * réponses positives. Recalculé à chaque envoi — le tableau reste la source
 * de vérité, et une ligne supprimée à la main est donc prise en compte.
 */
function personnesAttendues() {
  var onglet = feuille();
  var dernier = onglet.getLastRow();
  if (dernier < 2) { return 0; }

  var lignes = onglet.getRange(2, 1, dernier - 1, COLONNES.length).getValues();
  var somme = 0;

  for (var i = 0; i < lignes.length; i++) {
    var presence = String(lignes[i][COL_PRESENCE - 1]).toLowerCase();
    if (presence.indexOf("oui") === 0) {
      somme += entier(lignes[i][COL_TOTAL - 1]);
    }
  }
  return somme;
}

/**
 * Prévient les mariés. Volontairement non bloquant : si l'envoi du mail
 * échoue (quota Gmail atteint, adresse invalide), la réponse est DÉJÀ dans
 * le tableau — perdre la notification ne doit jamais faire perdre le RSVP.
 */
function notifier(ligne) {
  if (!EMAIL_NOTIFICATION) { return; }

  try {
    var vient = String(ligne[4]).toLowerCase().indexOf("oui") === 0;
    var qui = (ligne[2] + " " + ligne[3]).trim();
    var sujet = (vient ? "✅ " : "❌ ") + "RSVP — " + qui;

    var attendus = personnesAttendues();
    var compteur = CAPACITE_SALLE > 0
      ? attendus + " / " + CAPACITE_SALLE + " places"
      : String(attendus);

    var corps =
      "Nouvelle réponse reçue sur le site du mariage.\n\n" +
      "Événement ......... " + (ligne[1] || "—") + "\n" +
      "Prénom ............ " + ligne[2] + "\n" +
      "Nom ............... " + ligne[3] + "\n" +
      "Présence .......... " + ligne[4] + "\n" +
      "Accompagnants ..... " + ligne[5] + "\n" +
      "Total cette ligne . " + ligne[6] + "\n" +
      "Repas / allergies . " + (ligne[7] || "—") + "\n" +
      "Message ........... " + (ligne[8] || "—") + "\n\n" +
      "Personnes attendues à ce jour : " + compteur + "\n\n" +
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
 * Pensez à supprimer la ligne de test ensuite.
 */
function testerEnregistrement() {
  doPost({ parameter: {
    evenement: "Mairie de L'Haÿ-les-Roses — octobre 2026",
    prenom: "Test",
    nom: "À supprimer",
    presence: "Oui",
    accompagnants: "2",
    regime: "Sans gluten",
    message: "Ceci est un test."
  }});
}
