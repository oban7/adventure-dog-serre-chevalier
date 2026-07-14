# Adventure Dog – Serre-Chevalier

Site vitrine premium en une page pour une activité de dog sitting, promenade de chiens, garde de chien et randonnées canines à Serre-Chevalier / Briançon.

## Contenu livré

- Site statique compatible GitHub Pages.
- HTML, CSS et JavaScript sans dépendance lourde.
- Logo minimaliste en SVG une couleur.
- Images WebP optimisées.
- Navigation fluide, barre de progression, loader, reveal animations, hero Ken Burns.
- Modales de détail pour les prestations.
- Formulaire de réservation compatible Google Apps Script + Google Sheets.
- Pages légales de base.
- SEO local : dog sitter Serre-Chevalier, dog sitter Briançon, promenade chien Briançon, garde de chien Serre-Chevalier, randonnée chien montagne.

## Structure

```text
AdventureDog-Premium/
├── index.html
├── README.md
├── google-apps-script.gs
├── robots.txt
├── sitemap.xml
├── assets/
│   ├── css/
│   │   ├── style.css
│   │   ├── animations.css
│   │   └── responsive.css
│   ├── js/
│   │   ├── config.js
│   │   └── app.js
│   ├── images/
│   │   ├── logo.svg
│   │   └── *.webp
│   └── icons/
│       └── favicon.svg
└── legal/
    ├── mentions-legales.html
    └── politique-confidentialite.html
```

## Mise en ligne GitHub Pages

1. Créer un dépôt GitHub.
2. Envoyer tous les fichiers du dossier à la racine du dépôt.
3. Aller dans `Settings > Pages`.
4. Choisir `Deploy from a branch`, branche `main`, dossier `/root`.
5. Attendre la publication.

## Connexion Google Sheets

1. Créer un Google Sheet.
2. Aller dans `Extensions > Apps Script`.
3. Coller le contenu de `google-apps-script.gs`.
4. Modifier `OWNER_EMAIL` avec l'adresse réelle.
5. Déployer : `Deploy > New deployment > Web app`.
6. Exécuter en tant que : `Me`.
7. Accès : `Anyone`.
8. Copier l'URL du Web App.
9. Coller l'URL dans `assets/js/config.js` :

```js
window.ADVENTURE_DOG_CONFIG = {
  googleAppsScriptUrl: 'URL_DU_WEB_APP_ICI',
  contactEmail: 'contact@adventure-dog-serrechevalier.fr',
  contactPhone: '+33000000000'
};
```

Sans cette URL, le formulaire utilise automatiquement un email prérempli comme filet de sécurité. Même un site web mérite un plan B, contrairement à beaucoup de réunions.

## Points à personnaliser avant diffusion

- Email réel.
- Téléphone réel.
- Mentions légales : nom, statut, adresse, SIRET.
- URL canonique, sitemap et robots.txt selon le vrai domaine GitHub Pages ou nom de domaine.
- Remplacer les visuels WebP par de vraies photos si disponibles, en conservant les mêmes noms de fichiers pour ne rien casser.
