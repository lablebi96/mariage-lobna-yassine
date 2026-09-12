/* ==========================================================================
   main.js — remplit la page à partir de js/config.js
   --------------------------------------------------------------------------
   Aucune dépendance, aucun build. Principe de fonctionnement :
   chaque bloc lit une valeur de config, l'affiche si elle existe, et masque
   proprement la section si elle est vide. Un site à moitié rempli doit rester
   présentable — c'est un lien qu'on envoie à des invités.
   ========================================================================== */
(function () {
  "use strict";

  var C = window.MARIAGE_CONFIG || {};

  /* --- Petits utilitaires ------------------------------------------- */

  function $(id) { return document.getElementById(id); }

  /** Vrai si la valeur est une chaîne réellement remplie. */
  function rempli(v) { return typeof v === "string" && v.trim() !== ""; }

  /** Écrit un texte dans un élément ; renvoie false si rien n'a été écrit. */
  function ecrire(id, valeur) {
    var el = $(id);
    if (!el) { return false; }
    if (!rempli(valeur)) { return false; }
    el.textContent = valeur;
    return true;
  }

  function afficher(el) { if (el) { el.hidden = false; } }
  function masquer(el) { if (el) { el.hidden = true; } }

  /* Où vivent les photos, vu depuis la page en cours. La page principale est
     à côté du dossier images/ ; une page rangée dans un sous-dossier doit
     remonter d'un cran (« ../images/ »). Une seule ligne de config suffit. */
  var DOSSIER_IMAGES = rempli(C.cheminImages) ? C.cheminImages : "images/";

  /* ======================================================================
     0. PALETTE — config.palette écrase les variables CSS
     ====================================================================== */

  (function palette() {
    var p = C.palette || {};
    var racine = document.documentElement;
    Object.keys(p).forEach(function (cle) {
      if (rempli(p[cle])) { racine.style.setProperty("--" + cle, p[cle]); }
    });
  })();

  /* ======================================================================
     1. PRÉNOMS
     ====================================================================== */

  var couple = C.couple || {};
  ecrire("prenom-a", couple.prenomA);
  ecrire("prenom-b", couple.prenomB);
  ecrire("pied-a", couple.prenomA);
  ecrire("pied-b", couple.prenomB);

  /* ======================================================================
     2. DATE
     Une date invalide ou absente ne doit JAMAIS produire « NaN » à l'écran :
     dans ce cas le compte à rebours disparaît, et c'est tout.
     ====================================================================== */

  var dateMariage = null;
  if (rempli(C.dateISO)) {
    var d = new Date(C.dateISO);
    if (!isNaN(d.getTime())) { dateMariage = d; }
    else { console.warn("config.dateISO est illisible :", C.dateISO); }
  }

  function dateEnToutesLettres(date) {
    try {
      return new Intl.DateTimeFormat("fr-FR", {
        weekday: "long", day: "numeric", month: "long", year: "numeric"
      }).format(date);
    } catch (e) {
      return date.toLocaleDateString("fr-FR");
    }
  }

  function heureDuJour(date) {
    try {
      return new Intl.DateTimeFormat("fr-FR", { hour: "2-digit", minute: "2-digit" }).format(date);
    } catch (e) { return ""; }
  }

  var texteDate = rempli(C.dateAffichee)
    ? C.dateAffichee
    : (dateMariage ? dateEnToutesLettres(dateMariage) : "");

  ecrire("hero-date", texteDate);
  ecrire("lieu-date", texteDate);
  ecrire("pied-date", texteDate);

  /* Une date encore suspendue à une confirmation se dit franchement, sous la
     date elle-même : mieux vaut un invité prévenu qu'un invité déplacé pour
     rien. Laisser dateNote vide fait disparaître la mention. */
  if (ecrire("hero-date-note", C.dateNote)) { afficher($("hero-date-note")); }
  if (ecrire("lieu-date-note", C.dateNote)) { afficher($("lieu-date-note")); }

  ecrire("hero-sur-titre", C.surTitre);

  /* Le bouton du hero : sa cible change d'une page à l'autre (le formulaire
     ici, la simple suite de la page là). Texte vide = pas de bouton. */
  (function boutonHero() {
    var b = $("hero-bouton");
    var conf = C.heroBouton || {};
    if (!b) { return; }
    if (!rempli(conf.texte)) { masquer(b); return; }
    b.textContent = conf.texte;
    b.href = rempli(conf.ancre) ? conf.ancre : "#rsvp";
  })();

  /* ======================================================================
     3. COMPTE À REBOURS
     ====================================================================== */

  (function compteARebours() {
    var bloc = $("compte-a-rebours");
    var message = $("cr-message");
    if (!bloc || !dateMariage) { return; }

    var champs = {
      jours: $("cr-jours"), heures: $("cr-heures"),
      minutes: $("cr-minutes"), secondes: $("cr-secondes")
    };

    function deuxChiffres(n) { return n < 10 ? "0" + n : String(n); }

    function tick() {
      var reste = dateMariage.getTime() - Date.now();

      if (reste > 0) {
        var s = Math.floor(reste / 1000);
        champs.jours.textContent    = Math.floor(s / 86400);
        champs.heures.textContent   = deuxChiffres(Math.floor(s / 3600) % 24);
        champs.minutes.textContent  = deuxChiffres(Math.floor(s / 60) % 60);
        champs.secondes.textContent = deuxChiffres(s % 60);
        afficher(bloc);
        masquer(message);
        return true;
      }

      /* Date passée : on n'affiche jamais de nombres négatifs. */
      masquer(bloc);
      message.textContent = (reste > -86400000)
        ? "C'est aujourd'hui !"
        : "Merci d'avoir partagé ce jour avec nous.";
      afficher(message);
      return false;
    }

    if (tick()) {
      var minuterie = setInterval(function () {
        if (!tick()) { clearInterval(minuterie); }
      }, 1000);
    }
  })();

  /* ======================================================================
     4. PHOTO D'ACCUEIL
     Si le fichier n'existe pas, l'image reste masquée et le dégradé de
     secours défini en CSS s'affiche à sa place.
     ====================================================================== */

  (function photoAccueil() {
    var img = $("hero-photo");
    if (!img || !rempli(C.photoAccueil)) { return; }
    img.addEventListener("load", function () { img.hidden = false; });
    img.addEventListener("error", function () {
      console.info("Photo d'accueil absente : " + DOSSIER_IMAGES + C.photoAccueil + " (dégradé utilisé)");
    });
    img.src = DOSSIER_IMAGES + C.photoAccueil;
  })();

  /* ======================================================================
     5. NOTRE HISTOIRE
     ====================================================================== */

  (function histoire() {
    var section = $("histoire");
    var h = C.histoire || {};
    if (!section || !rempli(h.texte)) { return; }
    ecrire("histoire-titre", h.titre);
    ecrire("histoire-texte", h.texte);
    afficher(section);
  })();

  /* ======================================================================
     6. DATE & LIEU
     ====================================================================== */

  (function lieu() {
    var L = C.lieu || {};

    ecrire("lieu-nom", L.nom);
    ecrire("lieu-adresse", L.adresse);

    var heure = rempli(L.heureArrivee)
      ? L.heureArrivee
      : (dateMariage ? "Rendez-vous à " + heureDuJour(dateMariage) : "");
    ecrire("lieu-heure", heure);

    /* La requête Maps : ce qu'on taperait dans la barre de recherche.
       À défaut de mapsQuery, l'adresse fait très bien l'affaire. */
    var requete = rempli(L.mapsQuery) ? L.mapsQuery : L.adresse;
    var estPlaceholder = rempli(requete) && requete.indexOf("[À COMPLÉTER]") !== -1;

    if (rempli(requete) && !estPlaceholder) {
      var q = encodeURIComponent(requete);

      var iframe = $("carte-iframe");
      if (iframe) {
        iframe.src = "https://www.google.com/maps?q=" + q + "&output=embed";
        afficher($("carte"));
      }

      var bouton = $("lieu-bouton-maps");
      if (bouton) {
        bouton.href = "https://www.google.com/maps/search/?api=1&query=" + q;
        afficher(bouton);
      }
    }

    if (ecrire("lieu-parking", L.parking)) { afficher($("bloc-parking")); }
    if (ecrire("lieu-acces", L.acces))     { afficher($("bloc-acces")); }
  })();

  /* ======================================================================
     7. DÉROULEMENT DE LA JOURNÉE
     ====================================================================== */

  (function programme() {
    var liste = $("timeline");
    var section = $("programme");
    var etapes = Array.isArray(C.programme) ? C.programme : [];
    if (!liste || etapes.length === 0) { return; }

    etapes.forEach(function (etape) {
      var li = document.createElement("li");
      li.className = "jalon";

      var heure = document.createElement("span");
      heure.className = "jalon__heure";
      heure.textContent = etape.heure || "";

      var corps = document.createElement("div");
      corps.className = "jalon__corps";

      var titre = document.createElement("h3");
      titre.textContent = etape.titre || "";
      corps.appendChild(titre);

      if (rempli(etape.texte)) {
        var p = document.createElement("p");
        p.textContent = etape.texte;
        corps.appendChild(p);
      }

      li.appendChild(heure);
      li.appendChild(corps);
      liste.appendChild(li);
    });

    afficher(section);
  })();

  /* ======================================================================
     8. GALERIE + VISIONNEUSE
     ====================================================================== */

  (function galerie() {
    var grille = $("galerie-grille");
    var section = $("galerie");
    var photos = Array.isArray(C.galerie) ? C.galerie : [];
    if (!grille || photos.length === 0) { return; }

    photos.forEach(function (photo) {
      if (!rempli(photo && photo.fichier)) { return; }

      var bouton = document.createElement("button");
      bouton.type = "button";
      bouton.className = "galerie__vignette";

      var img = document.createElement("img");
      img.alt = photo.alt || "";
      img.loading = "lazy";
      img.decoding = "async";

      /* Une photo manquante retire sa vignette : pas d'icône cassée.
         L'écouteur est posé AVANT src, sans quoi une erreur immédiate
         (fichier déjà connu absent) passerait inaperçue. */
      img.addEventListener("error", function () {
        bouton.remove();
        if (grille.children.length === 0) { masquer(section); }
      });

      img.src = DOSSIER_IMAGES + photo.fichier;

      bouton.appendChild(img);
      bouton.addEventListener("click", function () { ouvrir(bouton); });
      grille.appendChild(bouton);
    });

    afficher(section);

    /* Les vignettes sont en chargement paresseux : hors écran, elles ne se
       chargent pas, donc leur absence ne se voit pas — et la section resterait
       affichée en rectangles vides jusqu'à ce qu'on descende jusqu'à elle.
       On sonde donc la première photo à part, hors lazy. Si le dossier images/
       est encore vide, la section disparaît tout de suite. */
    (function sonderPremierePhoto() {
      var premiere = photos.filter(function (ph) { return rempli(ph && ph.fichier); })[0];
      if (!premiere) { return; }
      var sonde = new Image();
      sonde.addEventListener("error", function () {
        console.info("Aucune photo dans " + DOSSIER_IMAGES + " : galerie masquée.");
        masquer(section);
      });
      sonde.src = DOSSIER_IMAGES + premiere.fichier;
    })();

    /* --- Visionneuse plein écran --- */
    var boite = $("lightbox");
    var image = $("lightbox-image");
    var indexCourant = 0;
    var declencheur = null;   /* pour rendre le focus en fermant */

    function vignettes() {
      return Array.prototype.slice.call(grille.querySelectorAll(".galerie__vignette"));
    }

    function montrer(i) {
      var liste = vignettes();
      if (liste.length === 0) { return; }
      indexCourant = (i + liste.length) % liste.length;   /* boucle */
      var source = liste[indexCourant].querySelector("img");
      image.src = source.src;
      image.alt = source.alt;
    }

    function ouvrir(bouton) {
      declencheur = bouton;
      montrer(vignettes().indexOf(bouton));
      boite.hidden = false;
      document.body.style.overflow = "hidden";
      $("lightbox-fermer").focus();
    }

    function fermer() {
      boite.hidden = true;
      image.src = "";
      document.body.style.overflow = "";
      if (declencheur) { declencheur.focus(); }
    }

    $("lightbox-fermer").addEventListener("click", fermer);
    $("lightbox-prec").addEventListener("click", function () { montrer(indexCourant - 1); });
    $("lightbox-suiv").addEventListener("click", function () { montrer(indexCourant + 1); });

    /* Un clic sur le fond (et pas sur l'image ou un bouton) ferme. */
    boite.addEventListener("click", function (e) { if (e.target === boite) { fermer(); } });

    document.addEventListener("keydown", function (e) {
      if (boite.hidden) { return; }
      if (e.key === "Escape")     { fermer(); }
      if (e.key === "ArrowLeft")  { montrer(indexCourant - 1); }
      if (e.key === "ArrowRight") { montrer(indexCourant + 1); }
    });
  })();

  /* ======================================================================
     9. INFOS PRATIQUES + CONTACTS
     ====================================================================== */

  (function infos() {
    var grille = $("grille-infos");
    var blocs = C.infos || {};
    if (!grille) { return; }

    Object.keys(blocs).forEach(function (cle) {
      var bloc = blocs[cle] || {};
      if (!rempli(bloc.texte)) { return; }

      var article = document.createElement("article");
      article.className = "carte-info";

      var h3 = document.createElement("h3");
      h3.textContent = bloc.titre || "";

      var p = document.createElement("p");
      p.textContent = bloc.texte;

      article.appendChild(h3);
      article.appendChild(p);
      grille.appendChild(article);
    });

    /* Contacts cliquables : sur téléphone, un numéro se compose d'un doigt. */
    var contact = C.contact || {};
    var zone = $("contacts");
    if (!zone) { return; }

    if (rempli(contact.telephone)) {
      var tel = document.createElement("a");
      tel.href = "tel:" + contact.telephone.replace(/[^+0-9]/g, "");
      tel.textContent = contact.telephone;
      zone.appendChild(tel);
    }
    if (rempli(contact.email)) {
      var mail = document.createElement("a");
      mail.href = "mailto:" + contact.email;
      mail.textContent = contact.email;
      zone.appendChild(mail);
    }
  })();

  /* ======================================================================
     10. RSVP
     Deux modes, pilotés par config.rsvp.actif :
       · true  → le formulaire s'affiche et part vers le script Google ;
       · false → le formulaire disparaît, remplacé par rsvp.message.
     C'est le second cas sur la page publique : seule la célébration civile
     appelle une réponse, et un formulaire inutile n'y ferait qu'égarer.
     ====================================================================== */

  (function rsvp() {
    var section = $("rsvp");
    if (!section) { return; }

    var R = C.rsvp || {};
    var form = $("form-rsvp");

    ecrire("rsvp-titre", R.titre);

    /* --- Mode « aucune réponse attendue » ---------------------------- */
    if (R.actif === false) {
      if (form) { form.remove(); }
      if (ecrire("rsvp-message", R.message)) { afficher($("rsvp-message")); }
      else { masquer(section); }
      return;
    }

    if (!form) { return; }

    ecrire("rsvp-limite", R.dateLimite);
    if (ecrire("rsvp-note", R.note)) { afficher($("rsvp-note")); }

    var etat = $("form-etat");
    var bouton = $("rsvp-envoyer");
    var champAccompagnants = $("champ-accompagnants");
    var champRegime = $("champ-regime");

    /* --- Accompagnants et repas n'ont de sens que si l'invité vient --- */
    function majPresence() {
      var vient = $("presence-oui").checked;
      champAccompagnants.hidden = !vient;
      champRegime.hidden = !vient;
    }
    $("presence-oui").addEventListener("change", majPresence);
    $("presence-non").addEventListener("change", majPresence);

    function afficherEtat(texte, type) {
      etat.textContent = texte;
      etat.className = "form-etat form-etat--" + type;
      etat.hidden = false;
    }

    /** Lien de secours : quand le formulaire ne peut pas partir. */
    function lienMailto(d) {
      if (!rempli(R.emailSecours)) { return null; }
      var corps = [
        "Prénom : " + d.prenom,
        "Nom : " + d.nom,
        "Présence : " + d.presence,
        "Personnes m'accompagnant : " + d.accompagnants,
        "Total (moi compris) : " + d.total,
        "Repas / allergies : " + d.regime,
        "Message : " + d.message
      ].join("\n");
      return "mailto:" + R.emailSecours
        + "?subject=" + encodeURIComponent("RSVP — " + d.prenom + " " + d.nom)
        + "&body=" + encodeURIComponent(corps);
    }

    function proposerMailto(donnees, texte) {
      var lien = lienMailto(donnees);
      afficherEtat(texte, "erreur");
      if (lien) {
        var a = document.createElement("a");
        a.href = lien;
        a.textContent = " Envoyer par e-mail à la place.";
        etat.appendChild(a);
      }
    }

    /** Signale un champ obligatoire laissé vide, et s'arrête là. */
    function manque(champ, texte) {
      champ.parentElement.classList.add("champ--erreur");
      afficherEtat(texte, "erreur");
      champ.focus();
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      var prenom = $("prenom");
      var nom = $("nom");
      var presenceChoisie = form.querySelector('input[name="presence"]:checked');

      prenom.parentElement.classList.remove("champ--erreur");
      nom.parentElement.classList.remove("champ--erreur");

      if (!rempli(prenom.value)) { return manque(prenom, "Merci d'indiquer votre prénom."); }
      if (!rempli(nom.value))    { return manque(nom, "Merci d'indiquer votre nom."); }
      if (!presenceChoisie) {
        afficherEtat("Merci d'indiquer si vous serez présent·e.", "erreur");
        $("presence-oui").focus();
        return;
      }

      var vient = presenceChoisie.value === "Oui";

      /* Le formulaire demande les accompagnants ; le tableau reçoit aussi le
         total, seul chiffre utile pour compter les chaises. */
      var accompagnants = 0;
      if (vient) {
        accompagnants = parseInt($("accompagnants").value, 10);
        if (isNaN(accompagnants) || accompagnants < 0) { accompagnants = 0; }
      }

      var donnees = {
        evenement:     R.evenement || "",
        prenom:        prenom.value.trim(),
        nom:           nom.value.trim(),
        presence:      presenceChoisie.value,
        accompagnants: String(accompagnants),
        total:         vient ? String(accompagnants + 1) : "0",
        regime:        vient ? $("regime").value.trim() : "",
        message:       $("message").value.trim()
      };

      /* Piège à robots : rempli = automate. On fait mine d'accepter. */
      if (rempli($("site").value)) {
        afficherEtat("Merci, votre réponse a bien été enregistrée.", "ok");
        return;
      }

      /* --- Pas d'endpoint configuré : on bascule sur l'e-mail --- */
      if (!rempli(R.endpoint)) {
        proposerMailto(donnees, rempli(R.emailSecours)
          ? "Le formulaire n'est pas encore relié."
          : "Le formulaire n'est pas encore relié : merci de prévenir les mariés directement.");
        return;
      }

      var corps = new FormData();
      Object.keys(donnees).forEach(function (cle) { corps.append(cle, donnees[cle]); });

      bouton.disabled = true;
      bouton.textContent = "Envoi en cours…";

      /* IMPORTANT — mode "no-cors" :
         une Web App Google Apps Script ne renvoie pas d'en-têtes CORS
         exploitables. La requête PART bien, mais le navigateur ne peut pas
         lire la réponse : impossible de distinguer un succès d'une erreur
         serveur. La confirmation ci-dessous est donc optimiste, et la
         vérité se trouve dans le Google Sheet et dans l'e-mail que le
         script envoie à chaque réponse.
         FormData (et non du JSON) est utilisé exprès : cela garde une
         requête « simple », donc sans requête préalable OPTIONS que Apps
         Script ne saurait pas traiter. */
      fetch(R.endpoint, { method: "POST", mode: "no-cors", body: corps })
        .then(function () {
          form.innerHTML = "";
          afficherEtat(
            vient
              ? "Merci " + donnees.prenom + " ! Votre présence est enregistrée"
                + (accompagnants > 0
                    ? " pour " + donnees.total + " personnes."
                    : ".")
                + " Nous avons hâte."
              : "Merci pour votre réponse. Vous nous manquerez.",
            "ok"
          );
          form.appendChild(etat);
        })
        .catch(function (err) {
          /* Seul cas réellement détectable : l'échec réseau.
             Les champs sont conservés — un message tapé ne doit pas être perdu. */
          console.error("Envoi RSVP impossible :", err);
          bouton.disabled = false;
          bouton.textContent = "Confirmer ma présence";
          proposerMailto(donnees,
            "L'envoi a échoué : vérifiez votre connexion et réessayez.");
        });
    });

    majPresence();
  })();

  /* ======================================================================
     11. APPARITION AU SCROLL
     ====================================================================== */

  (function apparitions() {
    var cibles = document.querySelectorAll(".anim");

    /* Navigateur ancien, ou mouvement réduit demandé : tout est visible. */
    var mouvementReduit = window.matchMedia
      && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!("IntersectionObserver" in window) || mouvementReduit) {
      cibles.forEach(function (el) { el.classList.add("anim--visible"); });
      return;
    }

    var observateur = new IntersectionObserver(function (entrees) {
      entrees.forEach(function (entree) {
        if (entree.isIntersecting) {
          entree.target.classList.add("anim--visible");
          observateur.unobserve(entree.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });

    cibles.forEach(function (el) { observateur.observe(el); });
  })();

})();
