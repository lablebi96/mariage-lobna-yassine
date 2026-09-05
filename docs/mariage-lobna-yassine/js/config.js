/* ==========================================================================
   config.js — LE SEUL FICHIER À MODIFIER POUR REMPLIR LE SITE
   --------------------------------------------------------------------------
   Tout le contenu de la page se trouve ici. Ne touchez ni au HTML, ni au CSS,
   ni à main.js : remplacez simplement les valeurs entre guillemets ci-dessous.

   Règles :
   - Laisser une valeur VIDE ("") masque proprement l'élément correspondant.
     Rien ne casse, rien n'affiche « undefined ».
   - Les lignes marquées [À COMPLÉTER] sont des valeurs d'exemple : elles
     DOIVENT être remplacées avant d'envoyer le lien aux invités.
   - Après modification : enregistrer le fichier, puis rafraîchir la page.
   ========================================================================== */

window.MARIAGE_CONFIG = {

  /* --- 1. LE COUPLE -------------------------------------------------- */
  couple: {
    prenomA: "Lobna",
    prenomB: "Yassine"
  },

  /* --- 2. LA DATE ----------------------------------------------------
     dateISO pilote le compte à rebours. Format :
        "AAAA-MM-JJTHH:MM:SS+01:00"
     Le "+01:00" est le décalage horaire (France : +01:00 en hiver,
     +02:00 en été). Se tromper d'une heure n'a aucune conséquence visible.
     Laisser "" masque entièrement le compte à rebours.

     dateAffichee est le texte montré à l'écran. Laissez "" pour qu'il soit
     écrit automatiquement à partir de dateISO (ex. « samedi 12 juin 2027 »).
     -------------------------------------------------------------------- */
  dateISO: "2027-03-26T21:00:00+01:00",           // vendredi 26 mars 2027, 21h00
  dateAffichee: "",                                // auto → « vendredi 26 mars 2027 »

  /* --- 3. NOTRE HISTOIRE (section optionnelle) ------------------------
     Mettre texte: "" pour supprimer complètement la section.
     -------------------------------------------------------------------- */
  histoire: {
    titre: "Notre histoire",
    texte: "Tout a commencé à Toulouse. Depuis 2019, nos chemins se sont " +
           "croisés, éloignés, puis retrouvés — plusieurs fois. Assez de fois " +
           "pour comprendre qu'ils n'étaient pas faits pour rester séparés. " +
           "En août 2023, nous nous sommes fiancés. Le 26 mars 2027, nous " +
           "aimerions vous avoir auprès de nous."
  },

  /* --- 4. DATE & LIEU -------------------------------------------------
     mapsQuery : ce que vous taperiez dans Google Maps pour trouver le lieu.
     Le plus fiable est l'adresse complète, ou bien des coordonnées GPS
     ("36.8065, 10.1815"). Laisser "" masque la carte.
     -------------------------------------------------------------------- */
  lieu: {
    nom: "Vienna Event House",
    adresse: "Ben Arous, Tunis, Tunisie",
    heureArrivee: "Accueil des invités à partir de 21h00",
    // Vérifiez que la carte pointe au bon endroit ; sinon, remplacez cette
    // ligne par des coordonnées GPS relevées sur Google Maps (ex. "36.75, 10.22").
    mapsQuery: "Vienna Event House, Ben Arous, Tunisie",
    parking: "Un parking est disponible sur place, au Vienna Event House.",
    acces: "En voiture, l'accès se fait derrière la pharmacie centrale."
  },

  /* --- 5. DÉROULEMENT DE LA JOURNÉE ----------------------------------
     Ajoutez ou supprimez des blocs { … } librement : la timeline s'adapte.
     -------------------------------------------------------------------- */
  programme: [
    // ⚠ HORAIRES À CONFIRMER — seul « 21h00 » nous a été communiqué.
    { heure: "21h00", titre: "Accueil des invités", texte: "[À COMPLÉTER]" },
    { heure: "22h00", titre: "Entrée des mariés",   texte: "[À COMPLÉTER]" },
    { heure: "23h00", titre: "Dîner",               texte: "[À COMPLÉTER]" },
    { heure: "00h30", titre: "Soirée",              texte: "[À COMPLÉTER] Ouverture du bal, puis dancefloor." }
  ],

  /* --- 6. GALERIE PHOTOS ----------------------------------------------
     Déposez vos photos dans le dossier images/ puis listez-les ici.
     "alt" décrit la photo pour les personnes qui ne la voient pas.
     Une photo absente du dossier est simplement ignorée : rien ne casse.
     Laisser la liste vide ([]) masque la section.
     -------------------------------------------------------------------- */
  galerie: [
    { fichier: "photo-1.jpg", alt: "Lobna et Yassine" },
    { fichier: "photo-2.jpg", alt: "Lobna et Yassine" },
    { fichier: "photo-3.jpg", alt: "Lobna et Yassine" },
    { fichier: "photo-4.jpg", alt: "Lobna et Yassine" },
    { fichier: "photo-5.jpg", alt: "Lobna et Yassine" },
    { fichier: "photo-6.jpg", alt: "Lobna et Yassine" }
  ],

  /* Photo affichée en fond de la première page (dans images/).
     Laisser "" pour un fond dégradé uni. */
  photoAccueil: "couple.jpg",

  /* --- 7. RSVP ---------------------------------------------------------
     endpoint : l'URL du script Google (se termine par /exec).
     Voir README.md, section « Formulaire RSVP », pour l'obtenir en 5 min.
     Tant que endpoint est vide, le formulaire bascule automatiquement sur
     un envoi par e-mail — le site reste donc utilisable dès maintenant.
     -------------------------------------------------------------------- */
  rsvp: {
    endpoint: "",                                  // [À COMPLÉTER]
    emailSecours: "",                              // [À COMPLÉTER] ex. "lobna.yassine@example.com"
    dateLimite: "[À COMPLÉTER] Merci de répondre avant le 1er mai."
  },

  /* --- 8. INFOS PRATIQUES ---------------------------------------------
     Chaque bloc dont le "texte" est vide disparaît de la page.
     -------------------------------------------------------------------- */
  infos: {
    dressCode:   { titre: "Dress code",   texte: "[À COMPLÉTER] Tenue de soirée. Évitez le blanc." },
    hebergement: { titre: "Hébergement",  texte: "[À COMPLÉTER] Hôtel ⭑⭑⭑ à 10 min, tarif négocié avec le code MARIAGE." },
    transport:   { titre: "Transport",    texte: "[À COMPLÉTER] Navette au départ du centre-ville à 14h15." },
    contact:     { titre: "Une question ?", texte: "[À COMPLÉTER] Écrivez-nous, nous répondons vite." }
  },

  /* Contacts cliquables affichés en bas de page. Laisser "" pour masquer. */
  contact: {
    telephone: "",                                 // ex. "+33 6 12 34 56 78"
    email: ""                                      // ex. "lobna.yassine@example.com"
  },

  /* --- 9. PALETTE (optionnel) -----------------------------------------
     Modifier ces couleurs change tout le site. Format hexadécimal.
     -------------------------------------------------------------------- */
  palette: {
    creme:  "#faf6f1",   // fond général
    blush:  "#e3c4bd",   // rose poudré, accents doux
    dore:   "#b8935a",   // doré, traits et boutons
    encre:  "#3b3230",   // texte
    sauge:  "#9aa892"    // vert doux, touches secondaires
  }
};
