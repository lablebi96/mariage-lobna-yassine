/* ==========================================================================
   config.js — PAGE DE LA CÉRÉMONIE CIVILE (L'Haÿ-les-Roses)
   --------------------------------------------------------------------------
   Cette page n'est liée depuis nulle part : son adresse ne se devine pas et
   ne s'affiche sur aucune autre page. Elle s'envoie à la main, aux seules
   personnes conviées à la mairie.

   Le fichier de la page publique (célébration en Tunisie) est ailleurs :
   ../js/config.js — les deux ne se mélangent jamais.

   Mêmes règles que l'autre : une valeur vide ("") masque proprement
   l'élément, et les mentions [À COMPLÉTER] doivent disparaître avant
   d'envoyer le lien.
   ========================================================================== */

window.MARIAGE_CONFIG = {

  /* --- 1. LE COUPLE -------------------------------------------------- */
  couple: {
    prenomA: "Lobna",
    prenomB: "Yassine"
  },

  /* --- 2. LA DATE ----------------------------------------------------
     ⚠ DATE ENCORE PROVISOIRE. La mairie confirme après l'audition du début
     octobre : ce sera le samedi 24 ou le samedi 31 octobre 2026.

     Le compte à rebours vise pour l'instant le 24. Le jour où la date est
     officielle, deux lignes à changer ici :
       · dateISO   → la vraie date et la vraie heure
       · dateNote  → "" pour faire disparaître la mention « à confirmer »

     Attention au décalage horaire en fin de ligne : l'heure d'été s'arrête
     le 25 octobre 2026. Le 24 octobre s'écrit donc "+02:00", et le
     31 octobre "+01:00".
     -------------------------------------------------------------------- */
  dateISO: "2026-10-24T11:00:00+02:00",   // [À CONFIRMER] samedi 24 octobre 2026 — l'heure est provisoire
  dateAffichee: "",                       // auto → « samedi 24 octobre 2026 »

  dateNote: "Date en attente de confirmation par la mairie : ce sera le " +
            "samedi 24 ou le samedi 31 octobre. Nous vous prévenons dès " +
            "que c'est officiel.",

  surTitre: "Notre cérémonie civile",

  heroBouton: {
    texte: "Confirmer ma présence",
    ancre: "#rsvp"
  },

  /* Les photos vivent un dossier plus haut : cette page est dans un
     sous-dossier. Ne pas modifier cette ligne. */
  cheminImages: "../images/",

  /* --- 3. UN MOT ------------------------------------------------------ */
  histoire: {
    titre: "En tout petit comité",
    texte: "Avant la fête en Tunisie, il y a la mairie : un moment court, " +
           "simple, et volontairement minuscule. Nous avons choisi de le " +
           "vivre entourés de quelques personnes seulement — celles sans " +
           "qui ce jour n'aurait pas le même goût. Vous en faites partie."
  },

  /* --- 4. DATE & LIEU -------------------------------------------------
     Adresse et consignes reprises de la charte de bonne conduite remise
     par la mairie.
     -------------------------------------------------------------------- */
  lieu: {
    nom: "Hôtel de Ville de L'Haÿ-les-Roses",
    adresse: "41 rue Jean Jaurès, 94240 L'Haÿ-les-Roses",
    heureArrivee: "Merci d'être devant la mairie 15 minutes avant le début " +
                  "de la cérémonie : les cortèges en retard sont reportés " +
                  "après les autres mariages du jour.",
    mapsQuery: "Hôtel de Ville, 41 rue Jean Jaurès, 94240 L'Haÿ-les-Roses",
    parking: "Le centre-ville est en zone bleue : disque obligatoire derrière " +
             "le pare-brise. Le plus simple est le parking souterrain de la " +
             "Halle de marché, 13 rue Henri Thirard — gratuit les 3 premières " +
             "heures, comme celui de la rue Henri Thirard. Également : le " +
             "parking souterrain de la rue du 11 novembre (gratuit, peu de " +
             "places), et les parkings provisoires des rues Watel et des " +
             "Tournelles.",
    acces: "L'emplacement réservé le long de l'Hôtel de ville est destiné au " +
           "seul véhicule des mariés. Le stationnement sauvage expose à " +
           "l'amende et à la fourrière : mieux vaut viser un parking."
  },

  /* --- 5. DÉROULEMENT -------------------------------------------------
     Les horaires précis dépendent de l'heure que fixera la mairie. En
     attendant, la timeline est écrite en repères relatifs : elle reste
     juste quelle que soit l'heure retenue.
     -------------------------------------------------------------------- */
  programme: [
    { heure: "−15 min", titre: "Rendez-vous devant la mairie",
      texte: "41 rue Jean Jaurès. La salle des mariages accueille 80 personnes assises." },
    { heure: "L'heure dite", titre: "La cérémonie",
      texte: "Lecture des textes, discours de l'officier d'état civil, échange des consentements. Une trentaine de minutes, dans le calme." },
    { heure: "Juste après", titre: "Sortie et photos",
      texte: "Nous libérons la salle pour le mariage suivant. Photos dehors, devant l'Hôtel de ville." },
    { heure: "Ensuite", titre: "[À COMPLÉTER]",
      texte: "[À COMPLÉTER] Déjeuner, vin d'honneur… ou rien du tout : à supprimer si la journée s'arrête à la mairie." }
  ],

  /* --- 6. GALERIE ------------------------------------------------------ */
  galerie: [
    { fichier: "photo-1.jpg", alt: "Lobna et Yassine" },
    { fichier: "photo-2.jpg", alt: "Lobna et Yassine" },
    { fichier: "photo-3.jpg", alt: "Lobna et Yassine" }
  ],

  photoAccueil: "couple.jpg",

  /* --- 7. RSVP ---------------------------------------------------------
     C'est LA page qui recueille les réponses. Voir README.md §3 pour
     obtenir l'URL du script Google (5 minutes).
     -------------------------------------------------------------------- */
  rsvp: {
    actif: true,
    titre: "Serez-vous des nôtres ?",

    endpoint: "",                     // [À COMPLÉTER] l'URL Google qui finit par /exec
    emailSecours: "",                 // [À COMPLÉTER] adresse de repli si le formulaire tombe en panne

    dateLimite: "Merci de nous répondre avant le 10 octobre 2026 — la salle " +
                "des mariages n'accueille que 80 personnes assises.",

    /* Écrit sous le formulaire : évite le malentendu le plus probable. */
    note: "Cette réponse ne concerne que la cérémonie civile du mois " +
          "d'octobre. La célébration en Tunisie, en mars 2027, fera l'objet " +
          "d'une invitation à part.",

    /* Recopié dans le tableau des réponses : utile le jour où un second
       formulaire existera. */
    evenement: "Mairie de L'Haÿ-les-Roses — octobre 2026"
  },

  /* --- 8. INFOS PRATIQUES --------------------------------------------- */
  infos: {
    dressCode: {
      titre: "Tenue",
      texte: "[À COMPLÉTER] Élégant sans cérémonie. Évitez le blanc."
    },
    salle: {
      titre: "Dans la salle",
      texte: "Ni boisson ni nourriture, et pas de confettis, pétales ou riz " +
             "dans l'enceinte de la mairie — c'est le règlement de la ville. " +
             "La musique n'est autorisée qu'à l'extérieur."
    },
    sortie: {
      titre: "À la sortie",
      texte: "Le cortège traverse une ville qui vit : pas de klaxons, pas de " +
             "voitures en travers de la route. La mairie y tient, et les " +
             "amendes existent."
    },
    transport: {
      titre: "Y venir",
      texte: "[À COMPLÉTER] Indiquez ici la station et la ligne les plus " +
             "pratiques, ou supprimez ce bloc en laissant le texte vide."
    },
    contact: {
      titre: "Une question ?",
      texte: "Écrivez-nous ou appelez-nous, nous répondons vite."
    }
  },

  contact: {
    telephone: "",                    // [À COMPLÉTER] ex. "+33 6 12 34 56 78"
    email: ""                         // [À COMPLÉTER]
  },

  /* --- 9. PALETTE ------------------------------------------------------
     Identique à la page publique : les deux pages doivent se ressembler.
     -------------------------------------------------------------------- */
  palette: {
    creme:  "#faf6f1",
    blush:  "#e3c4bd",
    dore:   "#b8935a",
    encre:  "#3b3230",
    sauge:  "#9aa892"
  }
};
