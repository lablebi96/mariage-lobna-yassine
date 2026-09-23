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
     ✅ DATE CONFIRMÉE par la mairie : samedi 24 octobre 2026.
     ⏳ L'HEURE, elle, sera communiquée le 29 septembre 2026.

     L'heure ci-dessous reste donc un espace réservé. Elle ne fausse que les
     heures et minutes du compte à rebours, jamais le nombre de jours — c'est
     ce que les invités regardent. Le 29 septembre, deux lignes à changer :
       · dateISO   → remplacer 11:00:00 par la vraie heure
       · dateNote  → "" pour faire disparaître la mention

     Ne touchez pas au "+02:00" de fin de ligne : l'heure d'été court jusqu'au
     25 octobre 2026, le 24 tombe donc juste avant le changement.
     -------------------------------------------------------------------- */
  dateISO: "2026-10-24T11:00:00+02:00",   // samedi 24 octobre 2026 — seule l'heure reste provisoire
  dateAffichee: "",                       // auto → « samedi 24 octobre 2026 »

  dateNote: "La date est confirmée. Seule l'heure de la cérémonie nous " +
            "manque encore : la mairie nous la communique le 29 septembre, " +
            "et nous vous la transmettons aussitôt.",

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
     Tant que la mairie n'a pas donné l'heure (le 29 septembre), la timeline
     est écrite en repères relatifs : elle reste juste quelle que soit
     l'heure retenue. Vous pourrez ensuite remplacer « −15 min » et
     « L'heure dite » par de vrais horaires — ou les laisser, ils se
     défendent très bien.
     -------------------------------------------------------------------- */
  programme: [
    { heure: "−15 min", titre: "Rendez-vous devant la mairie",
      texte: "41 rue Jean Jaurès. La salle des mariages accueille 80 personnes assises." },
    { heure: "L'heure dite", titre: "La cérémonie",
      texte: "Lecture des textes, discours de l'officier d'état civil, échange des consentements. Une trentaine de minutes, dans le calme." },
    { heure: "Juste après", titre: "Sortie et photos",
      texte: "Nous libérons la salle pour le mariage suivant. Photos dehors, devant l'Hôtel de ville." },
    { heure: "Ensuite", titre: "Tous à table",
      texte: "Direction Puteaux : nous prolongeons la journée à Maison Olivine, 42 rue Jean Jaurès. Signalez vos allergies dans le formulaire, nous transmettrons." }
  ],

  /* --- 6. GALERIE ------------------------------------------------------ */
  galerie: [
    { fichier: "photo-1.jpg", alt: "Lobna et Yassine devant la tour Eiffel, à Paris" },
    { fichier: "photo-2.jpg", alt: "Main dans la main dans une ruelle de La Valette, le soir" },
    { fichier: "photo-3.jpg", alt: "Lobna et Yassine devant la gare centrale d'Amsterdam" },
    { fichier: "photo-4.jpg", alt: "Lobna et Yassine à l'entrée de la course Hyrox, à Gand" }
  ],

  photoAccueil: "couple.jpg",

  /* --- 7. RSVP ---------------------------------------------------------
     C'est LA page qui recueille les réponses. Voir README.md §3 pour
     obtenir l'URL du script Google (5 minutes).
     -------------------------------------------------------------------- */
  rsvp: {
    actif: true,
    titre: "Serez-vous des nôtres ?",

    endpoint: "https://script.google.com/macros/s/AKfycbwDrco6-LqiB7I2Ir87Ip70QxDCYWiGT7uuJ3JqArfcKkBGK6enO5xiU051lekuwQZK/exec",                     // [À COMPLÉTER] l'URL Google qui finit par /exec
    emailSecours: "yassouna.rouis@gmail.com",                 // [À COMPLÉTER] adresse de repli si le formulaire tombe en panne

    dateLimite: "Merci de nous répondre avant le 10 octobre 2026 : la salle " +
                "des mariages n'accueille que 80 personnes assises, et le " +
                "restaurant a besoin d'un nombre de couverts.",

    /* Écrit sous le formulaire : évite le malentendu le plus probable. */
    note: "Cette réponse ne concerne que la cérémonie civile du 24 octobre. " +
          "La célébration en Tunisie, en mars 2027, fera l'objet d'une " +
          "invitation à part.",

    /* Recopié dans le tableau des réponses : utile le jour où un second
       formulaire existera. */
    evenement: "Mairie de L'Haÿ-les-Roses — 24 octobre 2026"
  },

  /* --- 8. INFOS PRATIQUES --------------------------------------------- */
  infos: {
    dressCode: {
      titre: "Tenue",
      texte: "Rien d'imposé : ce que l'on met pour un mariage. Évitez " +
             "simplement le blanc."
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
      titre: "Y venir en transports",
      texte: "Le plus simple : RER B jusqu'à Bourg-la-Reine, puis bus 172 " +
             "ou 192 — l'arrêt s'appelle « Mairie de L'Haÿ-les-Roses » et " +
             "se trouve devant. Depuis Paris sans RER : bus 186 à Porte " +
             "d'Italie (métro 7), une vingtaine de minutes, arrêt « Henri " +
             "Thirard – Léon Jouhaux » — la rue des parkings."
    },
    restaurant: {
      titre: "Après la mairie",
      // Coïncidence à noter si vous retouchez ce texte : la mairie ET le
      // restaurant sont tous deux rue Jean Jaurès — mais pas dans la même
      // ville (94240 L'Haÿ-les-Roses / 92800 Puteaux). D'où la précision du
      // numéro et de la ville à chaque mention, pour ne jamais confondre.
      texte: "Le repas se tient à Maison Olivine, 42 rue Jean Jaurès, " +
             "92800 Puteaux. Puteaux est de l'autre côté de Paris par " +
             "rapport à L'Haÿ-les-Roses : prévoyez une bonne marge sur le " +
             "trajet. Si vous êtes en voiture, proposez une place — et si " +
             "vous n'en avez pas, dites-le nous, on s'arrange.",
      lienTexte: "Itinéraire vers le restaurant",
      lienUrl: "https://www.google.com/maps/dir/?api=1&origin=41+rue+Jean+Jaur%C3%A8s%2C+94240+L%27Ha%C3%BF-les-Roses&destination=42+rue+Jean+Jaur%C3%A8s%2C+92800+Puteaux"
    },
    metro: {
      titre: "Attention au métro",
      texte: "La ligne 14 a bien une station « L'Haÿ-les-Roses », mais elle " +
             "porte le nom de la ville sans en desservir le centre : elle " +
             "est à l'autre bout de la commune, côté Chevilly-Larue. Il " +
             "faut encore prendre un bus (131 ou 286). Préférez le RER B."
    },
    contact: {
      titre: "Une question ?",
      texte: "Appelez-nous, ou envoyez un message au numéro ci-dessous : " +
             "nous répondons vite."
    }
  },

  contact: {
    telephone: "+33 7 80 81 32 50",   // Yassine — cliquable depuis un téléphone
    email: ""                         // [À COMPLÉTER] si vous voulez aussi une adresse
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
