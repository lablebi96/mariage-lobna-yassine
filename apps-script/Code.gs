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

/**
 * À REMPLIR UNIQUEMENT si le tableau reste vide.
 *
 * Un script créé depuis « Extensions ▸ Apps Script » à l'intérieur du Sheet
 * sait tout seul dans quel classeur écrire. Un script créé depuis
 * script.google.com (« Nouveau projet ») ne le sait pas : il n'est lié à
 * rien, et chaque réponse se perd en silence. C'est la panne la plus
 * fréquente, et elle ne se voit que par un tableau qui ne se remplit pas.
 *
 * Le remède tient en une ligne : collez ici l'identifiant du Sheet, la
 * longue suite de caractères au milieu de son adresse —
 *   docs.google.com/spreadsheets/d/  ICI  /edit
 *
 * Laissé vide, le script se rabat sur le classeur auquel il est lié.
 */
var ID_FEUILLE = "";

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
    // Le navigateur ne lira jamais cette erreur (no-cors) et l'invité a déjà
    // vu « merci » : sans alerte, la réponse serait perdue sans que personne
    // ne le sache. On prévient donc par e-mail, avec les données brutes —
    // une réponse recopiée à la main vaut mieux qu'une réponse disparue.
    console.error("Échec de l'enregistrement RSVP : " + err);
    alerter(err, (e && e.parameter) ? e.parameter : {});
    return reponse({ status: "erreur" });
  }
}

/** Prévient les mariés qu'une réponse n'a PAS pu être enregistrée. */
function alerter(err, p) {
  if (!EMAIL_NOTIFICATION) { return; }
  try {
    MailApp.sendEmail(
      EMAIL_NOTIFICATION,
      "⚠️ RSVP PERDU — le tableau n'a pas pu être écrit",
      "Une réponse est arrivée mais n'a pas pu être enregistrée.\n" +
      "L'invité, lui, a vu un message de confirmation : il ne recommencera pas.\n\n" +
      "ERREUR : " + err + "\n\n" +
      "Si le message parle de getActiveSpreadsheet ou de null, le script n'est\n" +
      "pas lié à un Google Sheet : renseignez ID_FEUILLE en haut du script,\n" +
      "puis redéployez (Déployer ▸ Gérer les déploiements ▸ Version : Nouvelle).\n\n" +
      "LA RÉPONSE, À RECOPIER À LA MAIN :\n" +
      "  Prénom ......... " + (p.prenom || "—") + "\n" +
      "  Nom ............ " + (p.nom || "—") + "\n" +
      "  Présence ....... " + (p.presence || "—") + "\n" +
      "  Accompagnants .. " + (p.accompagnants || "—") + "\n" +
      "  Repas .......... " + (p.regime || "—") + "\n" +
      "  Message ........ " + (p.message || "—") + "\n"
    );
  } catch (e2) {
    console.error("Alerte e-mail impossible : " + e2);
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

/**
 * Renvoie le classeur où écrire — celui auquel le script est lié, ou celui
 * que désigne ID_FEUILLE. Échoue avec un message explicite plutôt qu'avec
 * un « null n'a pas de méthode getSheetByName » que personne ne sait lire.
 */
function classeur() {
  var lie = null;
  try { lie = SpreadsheetApp.getActiveSpreadsheet(); } catch (e) { lie = null; }
  if (lie) { return lie; }

  if (ID_FEUILLE) { return SpreadsheetApp.openById(ID_FEUILLE); }

  throw new Error(
    "Ce script n'est lié à aucun Google Sheet (il a sans doute été créé " +
    "depuis script.google.com plutôt que depuis Extensions ▸ Apps Script). " +
    "Renseignez ID_FEUILLE en haut du fichier, puis redéployez en créant " +
    "une NOUVELLE version."
  );
}

/** Renvoie l'onglet des réponses, en le créant avec ses en-têtes si besoin. */
function feuille() {
  var onglet = classeur().getSheetByName(NOM_ONGLET);

  if (!onglet) {
    onglet = classeur().insertSheet(NOM_ONGLET);
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
      "Tableau complet : " + classeur().getUrl();

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
 * ============================================================================
 * LE TABLEAU RESTE VIDE ? LANCEZ CECI EN PREMIER.
 * ============================================================================
 * Choisissez « diagnostic » dans la liste déroulante en haut de l'éditeur,
 * cliquez sur « Exécuter », et lisez le journal qui s'ouvre en bas.
 * Aucune ligne n'est ajoutée au tableau : cette fonction ne fait que vérifier.
 */
function diagnostic() {
  var lignes = ["=== DIAGNOSTIC RSVP ==="];
  var bloquant = false;

  // 1. Le script sait-il dans quel classeur écrire ?
  var lie = null;
  try { lie = SpreadsheetApp.getActiveSpreadsheet(); } catch (e) { lie = null; }

  if (lie) {
    lignes.push("✅ Script lié au classeur : " + lie.getName());
    lignes.push("   " + lie.getUrl());
  } else if (ID_FEUILLE) {
    try {
      var parId = SpreadsheetApp.openById(ID_FEUILLE);
      lignes.push("✅ Script NON lié, mais ID_FEUILLE fonctionne : " + parId.getName());
      lignes.push("   " + parId.getUrl());
    } catch (e) {
      bloquant = true;
      lignes.push("❌ ID_FEUILLE est renseigné mais inutilisable : " + e);
      lignes.push("   → Vérifiez l'identifiant copié depuis l'adresse du Sheet,");
      lignes.push("     entre /d/ et /edit.");
    }
  } else {
    bloquant = true;
    lignes.push("❌ C'EST LA PANNE : ce script n'est lié à AUCUN Google Sheet,");
    lignes.push("   et ID_FEUILLE est vide. Chaque réponse se perd en silence.");
    lignes.push("   → Ouvrez votre Sheet, copiez l'identifiant dans son adresse");
    lignes.push("     (docs.google.com/spreadsheets/d/ CECI /edit),");
    lignes.push("     collez-le dans ID_FEUILLE en haut de ce fichier,");
    lignes.push("     puis REDÉPLOYEZ en créant une NOUVELLE version.");
  }

  // 2. L'onglet et ses colonnes.
  if (!bloquant) {
    try {
      var onglet = feuille();
      lignes.push("✅ Onglet « " + NOM_ONGLET + " » accessible, "
                  + Math.max(0, onglet.getLastRow() - 1) + " réponse(s) enregistrée(s).");
      var entetes = onglet.getRange(1, 1, 1, COLONNES.length).getValues()[0];
      if (String(entetes) !== String(COLONNES)) {
        lignes.push("⚠️  Les en-têtes ne correspondent pas à la version actuelle du script.");
        lignes.push("   Attendu : " + COLONNES.join(" | "));
        lignes.push("   Trouvé  : " + entetes.join(" | "));
        lignes.push("   → Videz l'onglet (ou supprimez-le) : il sera recréé proprement.");
      }
    } catch (e) {
      bloquant = true;
      lignes.push("❌ Onglet inaccessible : " + e);
    }
  }

  // 3. L'adresse de notification.
  if (EMAIL_NOTIFICATION) {
    lignes.push("✅ Notifications envoyées à : " + EMAIL_NOTIFICATION);
  } else {
    lignes.push("⚠️  EMAIL_NOTIFICATION est vide : aucune alerte ne vous parviendra,");
    lignes.push("   pas même en cas de réponse perdue. Renseignez-la.");
  }

  // 4. Le déploiement — la seule chose que ce script ne peut pas vérifier.
  lignes.push("");
  lignes.push("À VÉRIFIER À LA MAIN (impossible depuis ici) :");
  lignes.push("  · Ouvrez l'URL /exec dans une fenêtre de navigation privée.");
  lignes.push("    Vous devez voir du texte commençant par {\"status\":\"ok\".");
  lignes.push("    Une page de connexion Google = « Qui a accès » est mal réglé :");
  lignes.push("    il faut « Tout le monde », pas « Moi uniquement ».");
  lignes.push("  · Après TOUTE modification de ce fichier :");
  lignes.push("    Déployer ▸ Gérer les déploiements ▸ ✏️ ▸ Version : Nouvelle.");
  lignes.push("");
  lignes.push(bloquant
    ? "RÉSULTAT : panne identifiée ci-dessus. Corrigez, puis relancez diagnostic."
    : "RÉSULTAT : côté Sheet, tout est en ordre. Lancez testerEnregistrement.");

  var rapport = lignes.join("\n");
  console.log(rapport);
  return rapport;
}

/**
 * À lancer après diagnostic : vérifie l'écriture pour de vrai, SANS passer
 * par le site. Une ligne de test doit apparaître dans le Sheet et un e-mail
 * arriver. Pensez à supprimer la ligne de test ensuite.
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
