# Mariage de Lobna & Yassine

Site statique d'invitation, pensé pour le téléphone. Pas de framework, pas de
build, pas de serveur à maintenir.

---

## 0. Deux mariages, deux pages

Il y a **deux cérémonies**, et donc deux pages — qui partagent le même code,
le même style et la même identité, mais pas le même public.

| | Page publique | Page des proches |
|---|---|---|
| **Ce qu'elle annonce** | la célébration en Tunisie, **26 mars 2027** | la cérémonie civile à L'Haÿ-les-Roses, **octobre 2026** |
| **Adresse** | `https://www.sayloby.com/mariage-lobna-yassine/` | `https://www.sayloby.com/mariage-lobna-yassine/civil-2026-lhay/` |
| **Qui la reçoit** | tous les invités | seulement le cercle très proche |
| **Formulaire de réponse** | aucun — juste un mot | **oui**, c'est là que tout se joue |
| **Fichier à remplir** | `docs/mariage-lobna-yassine/js/config.js` | `docs/mariage-lobna-yassine/civil-2026-lhay/config.js` |

**La page des proches n'est liée depuis nulle part.** Aucun lien n'y mène,
son adresse ne se devine pas, et les moteurs de recherche en sont écartés
(`noindex` + `robots.txt`). Elle s'envoie à la main, une personne à la fois.
C'est ce qui permet d'annoncer un mariage restreint sans que personne ne s'y
sente oublié : les invités de mars ne voient jamais l'existence d'octobre.

> ⚠️ La seule façon de perdre cette discrétion est de coller le lien quelque
> part de public (un groupe WhatsApp large, un réseau social). Envoyez-le en
> message direct.

**La confirmation de présence ne concerne que la mairie.** C'est écrit noir sur
blanc sous le formulaire : la célébration tunisienne fera l'objet d'une
invitation à part.

---

## 1. Remplir le contenu

Tout le texte de chaque page vit dans **un seul fichier**, celui du tableau
ci-dessus. Ouvrez-le, remplacez les valeurs marquées `[À COMPLÉTER]`,
enregistrez. Aucune connaissance en HTML n'est nécessaire, et il n'y a rien
d'autre à modifier.

À renseigner en priorité :

| Clé | Ce que c'est |
|-----|--------------|
| `dateISO` | la date de la cérémonie — pilote le compte à rebours |
| `dateNote` | mention sous la date tant qu'il reste une inconnue ; `""` la fait disparaître |
| `lieu.nom`, `lieu.adresse` | affichés à l'écran |
| `lieu.mapsQuery` | l'adresse telle que vous la taperiez dans Google Maps (fait apparaître la carte) |
| `programme` | le déroulement |
| `rsvp.endpoint` | l'URL du script Google (voir §3) — **page des proches uniquement** |
| `rsvp.emailSecours` | l'adresse de repli si le formulaire tombe en panne |
| `rsvp.actif` | `false` supprime le formulaire et affiche `rsvp.message` à la place |

### La date est fixée, l'heure suit

**Samedi 24 octobre 2026**, confirmé par la mairie. **L'heure de la cérémonie
sera communiquée le 29 septembre 2026** — d'ici là, le site le dit sous la
date plutôt que d'afficher un horaire inventé.

En attendant, `dateISO` porte un 11:00 qui n'est qu'un espace réservé. Il ne
fausse que les heures et les minutes du compte à rebours, jamais le nombre de
jours — et c'est le nombre de jours que les invités regardent.

**Le 29 septembre**, deux lignes à changer dans `civil-2026-lhay/config.js` :

```js
dateISO: "2026-10-24T14:30:00+02:00",   // remplacer 11:00:00 par la vraie heure
dateNote: "",                            // vide → la mention disparaît
```

Ne touchez pas au `+02:00` : l'heure d'été court jusqu'au 25 octobre 2026, le
24 tombe donc juste avant le changement. (Se tromper d'une heure n'aurait
d'ailleurs aucune conséquence visible.)

Le déroulement de la journée est écrit en repères relatifs — *« −15 min »*,
*« L'heure dite »* — ce qui reste juste quelle que soit l'heure retenue. Une
fois l'horaire connu, vous pouvez les remplacer par de vrais horaires dans
`programme`, ou les laisser tels quels.

**Une valeur laissée vide masque proprement l'élément concerné.** Le site reste
présentable même à moitié rempli : rien n'affiche « undefined », aucune image
cassée. C'est voulu — vous pouvez le mettre en ligne avant d'avoir tout décidé.

### Les photos

Déposez-les dans `docs/mariage-lobna-yassine/images/`, puis listez-les dans
`config.js`. Le fichier `images/README.md` donne les noms attendus, les
dimensions conseillées et, surtout, le rappel de **compresser les photos à
moins de 300 Ko** : une photo brute de téléphone pèse 4 Mo et rend la page
inutilisable en 4G.

---

## 2. Voir le site avant de le publier

Le plus simple, dans un terminal, à la racine du dépôt :

```bash
cd docs
python3 -m http.server 8000
```

Puis ouvrez **http://localhost:8000/mariage-lobna-yassine/**

C'est exactement le chemin qu'aura le site en production : ce qui marche ici
marchera en ligne. (Ouvrir `index.html` en double-cliquant fonctionne aussi,
mais la carte Google et le formulaire s'y comportent différemment.)

---

## 3. Formulaire RSVP → Google Sheet

**Le tableau qui se remplit tout seul EST votre liste d'invités.** Rien à
saisir à la main, rien à tenir à jour : chaque réponse ajoute une ligne. Vous
le consultez à deux, vous triez, vous exportez.

Les colonnes :

```
Horodatage | Événement | Prénom | Nom | Présence | Accompagnants | Total | Repas / allergies | Message
```

`Accompagnants` est ce que l'invité a saisi (0 s'il vient seul) ; `Total` est
le nombre de chaises, lui compris. Une somme de la colonne `Total` vous donne
le nombre de personnes attendues — et chaque e-mail de notification vous le
rappelle déjà, sous la forme `37 / 80 places`.

1. Créez un **Google Sheet** vide (par exemple « RSVP mariage »).
2. Menu **Extensions ▸ Apps Script**.
3. Effacez le contenu affiché, puis collez tout le fichier
   [`apps-script/Code.gs`](apps-script/Code.gs).
4. En haut du script, renseignez `EMAIL_NOTIFICATION` avec votre adresse
   e-mail (vous recevrez un mail à chaque réponse).
5. **Déployer ▸ Nouveau déploiement ▸ Application web** :
   - *Exécuter en tant que* : **Moi**
   - *Qui a accès* : **Tout le monde** ← indispensable, sinon les invités
     reçoivent une erreur d'autorisation.
6. Google demande une autorisation la première fois : acceptez (l'écran
   « Application non validée » est normal pour un script personnel — cliquez
   sur « Paramètres avancées » puis « Accéder à … »).
7. Copiez l'URL fournie, celle qui **se termine par `/exec`**, et collez-la
   dans **`docs/mariage-lobna-yassine/civil-2026-lhay/config.js`** →
   `rsvp.endpoint`. *(C'est bien le fichier de la page des proches : la page
   publique n'a pas de formulaire.)*

**Vérifiez tout de suite :** envoyez une réponse depuis le site. Une ligne
doit apparaître dans le Sheet et un e-mail arriver.

> ⚠️ **Deux pièges à connaître.**
>
> **La page ne peut pas savoir si l'envoi a réussi.** Google Apps Script ne
> renvoie pas les en-têtes qui permettraient au navigateur de lire sa réponse.
> Le message de confirmation affiché à l'invité est donc *optimiste* : la
> preuve qu'une réponse est bien arrivée, c'est la ligne dans le Sheet et
> l'e-mail. D'où l'importance du test de l'étape ci-dessus — si le script est
> mal déployé, seul ce test vous le dira.
>
> **Modifier `Code.gs` ne suffit pas.** Il faut ensuite refaire
> *Déployer ▸ Gérer les déploiements ▸ Modifier ▸ Version : Nouvelle*, sinon
> l'ancienne version continue de tourner.

Tant que `rsvp.endpoint` est vide, le bouton bascule automatiquement sur un
envoi par e-mail (`rsvp.emailSecours`) : le site est utilisable dès maintenant.

---

## 4. Mettre en ligne

### Recommandé — GitHub Pages

Gratuit, HTTPS automatique, rien à installer.

1. **Settings ▸ Pages**
   - *Source* : **Deploy from a branch**
   - *Branch* : `main`, dossier **`/docs`** — puis **Save**.
2. Attendez une minute et vérifiez d'abord sur l'adresse temporaire :
   **https://lablebi96.github.io/mariage-lobna-yassine/mariage-lobna-yassine/**
   Le site doit s'afficher. *(Testez ici avant de brancher le domaine : si
   quelque chose cloche, vous le voyez sans toucher au DNS.)*
3. **Settings ▸ Pages ▸ Custom domain** : saisissez `www.sayloby.com` puis
   **Save**. GitHub crée alors tout seul le fichier `docs/CNAME`.
4. Chez le registrar du domaine `sayloby.com`, ajoutez :

   | Type | Nom | Valeur |
   |------|-----|--------|
   | `CNAME` | `www` | `lablebi96.github.io` |

   Et, si vous voulez que `sayloby.com` sans « www » fonctionne aussi, quatre
   enregistrements `A` sur `@` : `185.199.108.153`, `185.199.109.153`,
   `185.199.110.153`, `185.199.111.153`.
5. Revenez sur **Settings ▸ Pages** et cochez **Enforce HTTPS** dès que
   l'option devient disponible (le certificat prend de quelques minutes à
   quelques heures).

Le site est alors en ligne sur **https://www.sayloby.com/mariage-lobna-yassine/**

> ⚠️ **Le domaine sera entièrement pris par ce dépôt.** `www.sayloby.com/`
> (la racine) redirigera vers la page du mariage. Si vous voulez y mettre
> autre chose un jour, voyez la note « Déménager le site » plus bas.
>
> Le sous-domaine `chess-publish.sayloby.com` n'est **pas** affecté : c'est un
> nom distinct, servi par un autre serveur.

### Autre option — Cloudflare Pages ou Netlify

Connectez le dépôt, puis :
- *Build command* : **aucune** (laisser vide)
- *Publish directory* : **`docs`**

Ajoutez ensuite `www.sayloby.com` dans le tableau de bord. Mêmes fichiers,
aucune modification.

### Autre option — VPS + nginx

Si vous préférez le serveur qui héberge déjà `chess-publish.sayloby.com` :

```bash
# depuis votre machine
rsync -av docs/ user@vps:/var/www/sayloby/
```

```nginx
server {
    listen 80;
    server_name www.sayloby.com sayloby.com;
    root /var/www/sayloby;
    index index.html;

    location / {
        try_files $uri $uri/ =404;
    }
}
```

Puis `sudo certbot --nginx -d www.sayloby.com -d sayloby.com`.

Ce bloc est **indépendant** du service `sayloby-publish-api` : rien à
redémarrer de ce côté.

---

## 5. Structure des fichiers

```
.
├── README.md                  ce fichier
├── apps-script/
│   └── Code.gs                le script Google qui reçoit les RSVP
└── docs/                      ← racine publiée du site
    ├── index.html             redirige la racine vers la page du mariage
    ├── robots.txt             demande aux moteurs de ne pas indexer
    ├── .nojekyll              GitHub sert les fichiers tels quels
    └── mariage-lobna-yassine/
        ├── index.html         PAGE PUBLIQUE — la Tunisie
        ├── css/style.css      tout le style (partagé par les deux pages)
        ├── js/config.js       ← le fichier de la page publique
        ├── js/main.js         la logique (partagée : compte à rebours, galerie, RSVP)
        ├── images/            vos photos (servent aux deux pages)
        └── civil-2026-lhay/
            ├── index.html     PAGE DES PROCHES — la mairie
            └── config.js      ← le fichier de la page des proches
```

**Une seule logique pour deux pages.** `main.js` et `style.css` ne sont écrits
qu'une fois : la page des proches les charge avec `../`. Tout ce qui distingue
les deux pages tient dans leur `config.js`. Corriger un bug, c'est le corriger
partout.

Les deux `index.html` sont volontairement identiques, aux chemins et aux
métadonnées près. Si vous touchez à la structure de l'un, régénérez l'autre
plutôt que de recopier à la main :

```bash
cd docs/mariage-lobna-yassine
sed -e 's|href="css/|href="../css/|' \
    -e 's|href="images/|href="../images/|' \
    -e 's|src="js/main.js"|src="../js/main.js"|' \
    -e 's|src="js/config.js"|src="config.js"|' \
    -e 's|content="images/|content="../images/|' \
    index.html > civil-2026-lhay/index.html
```

Pensez ensuite à remettre le `<title>` et les métadonnées de partage de la
page civile.

**Pourquoi `docs/` et pas `public/` ?** GitHub Pages n'accepte que deux
racines : celle du dépôt, ou `docs/`. Ce nom permet donc de publier sans
écrire le moindre fichier de configuration. Ne renommez pas ce dossier sans
changer aussi le réglage *Settings ▸ Pages*.

**Pourquoi le site est-il dans un sous-dossier `mariage-lobna-yassine/` ?**
Parce que l'adresse voulue contient ce chemin. En faisant du sous-chemin un
vrai dossier plutôt qu'une règle de réécriture, le site fonctionne à
l'identique sur GitHub Pages, Netlify, Cloudflare et nginx — le choix de
l'hébergeur reste réversible.

### Déménager le site

Tous les chemins internes sont **relatifs**. Pour servir la page ailleurs
(par exemple sur `mariage.sayloby.com`), il suffit de déplacer le dossier
`mariage-lobna-yassine/` : aucune ligne de code à modifier.

---

## 6. Avant d'envoyer les liens

**Les deux pages**

- [ ] Toutes les mentions `[À COMPLÉTER]` ont disparu des deux `config.js`
- [ ] La date du compte à rebours est la bonne
- [ ] La carte affiche le bon endroit
- [ ] Les photos pèsent moins de 300 Ko chacune — ou bien `galerie: []`
      (une galerie dont les fichiers manquent se masque toute seule, mais
      autant ne pas s'en remettre à ça)
- [ ] Les pages ont été ouvertes **sur un vrai téléphone**, pas seulement en
      simulation — c'est là que 90 % des invités les liront

**La page des proches, en plus**

- [ ] `rsvp.endpoint` est renseigné et le formulaire a été testé pour de
      vrai : une ligne est bien arrivée dans le Sheet, et l'e-mail aussi
- [ ] `rsvp.emailSecours` est renseigné — c'est le filet si Google flanche
- [ ] Le lien s'envoie **en message direct**, jamais dans un groupe large
- [ ] Le 29 septembre, quand la mairie donne l'heure : `dateISO` corrigé et
      `dateNote` vidé
