# Mariage de Lobna & Yassine

Site statique d'invitation, une seule page, pensé pour le téléphone.
Adresse visée : **https://www.sayloby.com/mariage-lobna-yassine/**

Pas de framework, pas de build, pas de serveur à maintenir : trois fichiers
(HTML, CSS, JS) et un formulaire qui écrit dans un Google Sheet.

---

## 1. Remplir le contenu

Tout le texte du site vit dans **un seul fichier** :

```
docs/mariage-lobna-yassine/js/config.js
```

Ouvrez-le, remplacez les valeurs marquées `[À COMPLÉTER]`, enregistrez.
Aucune connaissance en HTML n'est nécessaire, et il n'y a rien d'autre à
modifier.

À renseigner en priorité :

| Clé | Ce que c'est |
|-----|--------------|
| `dateISO` | la date du mariage — pilote le compte à rebours |
| `lieu.nom`, `lieu.adresse` | affichés à l'écran |
| `lieu.mapsQuery` | l'adresse telle que vous la taperiez dans Google Maps (fait apparaître la carte) |
| `programme` | les horaires de la journée |
| `rsvp.endpoint` | l'URL du script Google (voir §3) |
| `rsvp.emailSecours` | l'adresse de repli si le formulaire tombe en panne |

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

Les réponses arrivent dans un tableur que vous pouvez consulter à deux, trier
et exporter. Gratuit, sans limite de volume.

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
   dans `config.js` → `rsvp.endpoint`.

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
        ├── index.html         la page
        ├── css/style.css      tout le style
        ├── js/config.js       ← LE fichier à remplir
        ├── js/main.js         la logique (compte à rebours, galerie, RSVP)
        └── images/            vos photos
```

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

## 6. Avant d'envoyer le lien aux invités

- [ ] Toutes les mentions `[À COMPLÉTER]` ont disparu de `config.js`
- [ ] La date du compte à rebours est la bonne
- [ ] La carte affiche le bon endroit
- [ ] Le formulaire a été testé : une ligne est bien arrivée dans le Sheet
- [ ] Les photos pèsent moins de 300 Ko chacune
- [ ] La page a été ouverte **sur un vrai téléphone**, pas seulement en
      simulation — c'est là que 90 % des invités la liront
