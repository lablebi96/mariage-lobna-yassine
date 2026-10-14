/* ==========================================================================
   effets-festifs.js — PAGE CIVILE UNIQUEMENT
   --------------------------------------------------------------------------
   Un habillage festif pour le hero : un scintillement doré permanent, qui
   cède la place par intermittence à un feu d'artifice, en fondu — jamais
   les deux en même temps. Validé sur une maquette avant d'écrire ce fichier
   (quatre pistes comparées, cette combinaison choisie, son rythme ajusté
   de 7 à 4 secondes).

   Ce fichier n'est chargé QUE par civil-2026-lhay : main.js et css/style.css,
   partagés avec la page publique (Tunisie), ne sont pas touchés — la fête
   reste ici.
   ========================================================================== */
(function () {
  "use strict";

  var canvasEtincelles = document.getElementById("hero-festif-etincelles");
  var canvasFeu = document.getElementById("hero-festif-feu");
  if (!canvasEtincelles || !canvasFeu) { return; }

  var reduit = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function rand(a, b) { return a + Math.random() * (b - a); }
  function pick(arr) { return arr[(Math.random() * arr.length) | 0]; }

  /* Palette puisée dans celle du site, jamais des teintes "fête" génériques. */
  var OR = ["#b8935a", "#d9b878", "#8f6a3c"];

  /* Si l'onglet est caché, aucune des deux boucles ne tourne pour rien. */
  var enPause = document.hidden;
  document.addEventListener("visibilitychange", function () { enPause = document.hidden; });

  /* Prépare un canvas à la taille réelle du hero, nette quelle que soit la
     densité d'écran. Rappelée à chaque redimensionnement (rotation du
     téléphone, barre d'adresse qui apparaît ou disparaît, fenêtre
     redimensionnée). */
  function preparerCanvas(canvas) {
    var rect = canvas.parentElement.getBoundingClientRect();
    var dpr = window.devicePixelRatio || 1;
    canvas.width = Math.max(1, Math.round(rect.width * dpr));
    canvas.height = Math.max(1, Math.round(rect.height * dpr));
    var ctx = canvas.getContext("2d");
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    return { ctx: ctx, w: rect.width, h: rect.height };
  }

  /* ======================================================================
     ÉTINCELLES : scintillement continu.
     ====================================================================== */
  function creerEtincelles(canvas) {
    var dims = preparerCanvas(canvas);
    var n = reduit ? 12 : 30;
    var points = [];

    function genererPoints() {
      points = [];
      for (var i = 0; i < n; i++) {
        points.push({
          x: rand(0, dims.w), y: rand(0, dims.h),
          r: rand(1.2, 2.6), phase: rand(0, Math.PI * 2),
          vitesse: rand(.5, 1.1), derive: rand(5, 12),
          couleur: pick(OR)
        });
      }
    }
    genererPoints();

    function etoile(x, y, r, alpha, couleur) {
      dims.ctx.save();
      dims.ctx.globalAlpha = alpha;
      dims.ctx.fillStyle = couleur;
      dims.ctx.beginPath();
      dims.ctx.moveTo(x, y - r * 2.2);
      dims.ctx.quadraticCurveTo(x, y, x + r * 2.2, y);
      dims.ctx.quadraticCurveTo(x, y, x, y + r * 2.2);
      dims.ctx.quadraticCurveTo(x, y, x - r * 2.2, y);
      dims.ctx.quadraticCurveTo(x, y, x, y - r * 2.2);
      dims.ctx.fill();
      dims.ctx.restore();
    }

    var t = 0, brut = 0, rafId = null, actif = false;

    function dessiner() {
      dims.ctx.clearRect(0, 0, dims.w, dims.h);
      for (var i = 0; i < points.length; i++) {
        var p = points[i];
        var alpha = .16 + .5 * (0.5 + 0.5 * Math.sin(t * p.vitesse + p.phase));
        etoile(p.x, p.y, p.r, alpha, p.couleur);
      }
    }

    function tick(horodatage) {
      if (!brut) brut = horodatage;
      var dt = Math.min(.05, (horodatage - brut) / 1000);
      brut = horodatage;
      if (!enPause) {
        t += dt;
        for (var i = 0; i < points.length; i++) {
          var p = points[i];
          p.y -= p.derive * dt;
          if (p.y < -6) { p.y = dims.h + 6; p.x = rand(0, dims.w); }
        }
        dessiner();
      }
      if (actif) rafId = requestAnimationFrame(tick);
    }

    function jouer() {
      if (reduit) { dessiner(); return; }
      if (actif) return;
      actif = true; brut = 0;
      rafId = requestAnimationFrame(tick);
    }
    function pauser() { actif = false; if (rafId) cancelAnimationFrame(rafId); }
    function redimensionner() {
      var etaitActif = actif;
      pauser();
      dims = preparerCanvas(canvas);
      genererPoints();
      dessiner();
      if (etaitActif) jouer();
    }

    dessiner();
    return { jouer: jouer, pauser: pauser, redimensionner: redimensionner };
  }

  /* ======================================================================
     FEU D'ARTIFICE : salves récurrentes.
     ====================================================================== */
  function creerFeu(canvas) {
    var dims = preparerCanvas(canvas);
    var eclats = [], rafId = null, brut = 0, actif = false, prochaine = 0, horloge = 0;

    function nouvelleSalve() {
      var cx = rand(dims.w * .3, dims.w * .7);
      var cy = rand(dims.h * .18, dims.h * .4);
      var n = reduit ? 16 : 32;
      for (var i = 0; i < n; i++) {
        var angle = (Math.PI * 2 * i) / n + rand(-.15, .15);
        var vitesse = rand(45, 100);
        eclats.push({
          x: cx, y: cy, vx: Math.cos(angle) * vitesse, vy: Math.sin(angle) * vitesse,
          couleur: pick(OR.concat(["#e3c4bd", "#faf6f1"])), vie: 1
        });
      }
    }

    function dessiner() {
      dims.ctx.clearRect(0, 0, dims.w, dims.h);
      for (var i = 0; i < eclats.length; i++) {
        var e = eclats[i];
        dims.ctx.save();
        dims.ctx.globalAlpha = Math.max(0, e.vie);
        dims.ctx.fillStyle = e.couleur;
        dims.ctx.beginPath();
        dims.ctx.arc(e.x, e.y, 2, 0, Math.PI * 2);
        dims.ctx.fill();
        dims.ctx.restore();
      }
    }

    function tick(horodatage) {
      if (!brut) brut = horodatage;
      var dt = Math.min(.05, (horodatage - brut) / 1000);
      brut = horodatage; horloge += dt;
      if (!enPause) {
        if (horloge >= prochaine) {
          nouvelleSalve();
          prochaine = horloge + (reduit ? 99999 : rand(1.8, 2.8));
        }
        var reste = [];
        for (var i = 0; i < eclats.length; i++) {
          var e = eclats[i];
          e.vy += 65 * dt;
          e.x += e.vx * dt; e.y += e.vy * dt;
          e.vie -= dt * .85;
          if (e.vie > 0) reste.push(e);
        }
        eclats = reste;
        dessiner();
      }
      if (actif) rafId = requestAnimationFrame(tick);
    }

    function jouer() {
      if (actif) return;
      actif = true; brut = 0;
      if (reduit) { eclats = []; nouvelleSalve(); prochaine = Infinity; dessiner(); actif = false; return; }
      rafId = requestAnimationFrame(tick);
    }
    function pauser() { actif = false; if (rafId) cancelAnimationFrame(rafId); }
    function redimensionner() {
      var etaitActif = actif;
      pauser();
      dims = preparerCanvas(canvas);
      eclats = [];
      dessiner();
      if (etaitActif) jouer();
    }

    return { jouer: jouer, pauser: pauser, redimensionner: redimensionner };
  }

  /* ======================================================================
     ALTERNANCE : les deux moteurs tournent en continu, chacun sur son
     propre calque ; seule l'opacité CSS bascule de l'un à l'autre, en
     fondu (voir la transition posée dans effets-festifs.css), toutes les
     4 secondes. On ne les voit donc jamais superposés, et le feu
     d'artifice reprend où il en était à son retour plutôt que de repartir
     de zéro.
     ====================================================================== */
  var DUREE = 4000;
  var moteurE = creerEtincelles(canvasEtincelles);
  var moteurF = creerFeu(canvasFeu);
  var phase = 0; // 0 = étincelles visibles, 1 = feu visible
  var minuteur = null;
  var actif = false;

  function appliquer() {
    canvasEtincelles.style.opacity = phase === 0 ? "1" : "0";
    canvasFeu.style.opacity = phase === 0 ? "0" : "1";
  }
  function basculer() { phase = phase ? 0 : 1; appliquer(); }

  function jouer() {
    if (actif) return;
    actif = true;
    moteurE.jouer(); moteurF.jouer();
    minuteur = setInterval(basculer, DUREE);
  }
  function pauser() {
    actif = false;
    moteurE.pauser(); moteurF.pauser();
    clearInterval(minuteur);
  }

  appliquer();
  jouer();

  /* Pas de calcul pour rien une fois le hero scrollé hors champ. */
  var hero = canvasEtincelles.closest(".hero");
  if (hero && "IntersectionObserver" in window) {
    new IntersectionObserver(function (entrees) {
      entrees.forEach(function (entree) {
        if (entree.isIntersecting) jouer(); else pauser();
      });
    }, { threshold: .1 }).observe(hero);
  }

  /* Redimensionnement (rotation, barre d'adresse, fenêtre) : redessiné une
     fois le mouvement terminé plutôt qu'à chaque pixel. */
  var attenteRedim = null;
  window.addEventListener("resize", function () {
    clearTimeout(attenteRedim);
    attenteRedim = setTimeout(function () {
      moteurE.redimensionner();
      moteurF.redimensionner();
    }, 200);
  });
})();
