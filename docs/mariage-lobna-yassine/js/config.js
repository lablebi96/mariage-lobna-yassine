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
  dateISO: "2027-06-12T15:00:00+02:00",           // [À COMPLÉTER]
  dateAffichee: "",                                // auto si vide

  /* --- 3. NOTRE HISTOIRE (section optionnelle) ------------------------
     Mettre texte: "" pour supprimer complètement la section.
     -------------------------------------------------------------------- */
  histoire: {
    titre: "Notre histoire",
    texte: "[À COMPLÉTER] Quelques lignes sur votre rencontre, ce qui vous " +
           "lie, ou simplement le plaisir de réunir ceux que vous aimez. " +
           "Deux ou trois phrases suffisent : les invités liront cette page " +
           "sur leur téléphone."
  },

  /* --- 4. DATE & LIEU -------------------------------------------------
     mapsQuery : ce que vous taperiez dans Google Maps pour trouver le lieu.
     Le plus fiable est l'adresse complète, ou bien des coordonnées GPS
     ("36.8065, 10.1815"). Laisser "" masque la carte.
     -------------------------------------------------------------------- */
  lieu: {
    nom: "[À COMPLÉTER] Nom du lieu de réception",
    adresse: "[À COMPLÉTER] 12 rue Exemple, 75000 Ville",
    heureArrivee: "[À COMPLÉTER] Accueil des invités à 15h00",
    mapsQuery: "",                                 // [À COMPLÉTER]
    parking: "[À COMPLÉTER] Parking gratuit sur place, 80 places.",
    acces: "[À COMPLÉTER] À 25 min du centre-ville. Gare la plus proche : …"
  },

  /* --- 5. DÉROULEMENT DE LA JOURNÉE ----------------------------------
     Ajoutez ou supprimez des blocs { … } librement : la timeline s'adapte.
     -------------------------------------------------------------------- */
  programme: [
    { heure: "15h00", titre: "Cérémonie",  texte: "[À COMPLÉTER] Merci d'arriver 15 minutes en avance." },
    { heure: "16h30", titre: "Cocktail",   texte: "[À COMPLÉTER] Vin d'honneur et photos de groupe." },
    { heure: "19h30", titre: "Dîner",      texte: "[À COMPLÉTER] Placement à table affiché à l'entrée." },
    { heure: "22h00", titre: "Soirée",     texte: "[À COMPLÉTER] Ouverture du bal, puis dancefloor." }
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
