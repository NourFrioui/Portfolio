# Database Migration Guide

Ce guide explique comment utiliser les outils de migration pour convertir les champs string en champs localisés `{ en: string, fr: string }`.

## 🚀 Migration vers les champs localisés

### Via API (Recommandé)

```bash
# 1. Migrer toutes les collections
curl -X POST http://localhost:3000/migration/localize-fields

# 2. Vérifier le statut
curl -X GET http://localhost:3000/migration/status

# 3. Tester le service de localisation
curl -X POST http://localhost:3000/migration/test-localization \
  -H "Content-Type: application/json" \
  -d '{
    "field": { "en": "Hello", "fr": "Bonjour" },
    "language": "fr"
  }'
```

### Via Scripts NPM

```bash
# 1. Migrer vers les champs localisés
npm run migration:localize

# 2. Annuler la migration (rollback)
npm run migration:rollback

# 3. Vérifier le statut
npm run migration:status

# 4. Tester le service
npm run migration:test
```

## 📊 Collections migrées

### Projects

- `title` → `{ en: string, fr: string }`
- `description` → `{ en: string, fr: string }`
- `longDescription` → `{ en: string, fr: string }`
- `detailedDescription` → `{ en: string, fr: string }`
- `team.role` → `{ en: string, fr: string }`
- `results[].metric` → `{ en: string, fr: string }`
- `clientTestimonial.text` → `{ en: string, fr: string }`
- `clientTestimonial.author` → `{ en: string, fr: string }`
- `clientTestimonial.position` → `{ en: string, fr: string }`

### Technologies

- `name` → `{ en: string, fr: string }`
- `description` → `{ en: string, fr: string }`

### Contacts

- `name` → `{ en: string, fr: string }`
- `message` → `{ en: string, fr: string }`
- `projectType` → `{ en: string, fr: string }`

### Users

- `firstName` → `{ en: string, fr: string }`
- `lastName` → `{ en: string, fr: string }`
- `address` → `{ en: string, fr: string }`
- `city` → `{ en: string, fr: string }`
- `country` → `{ en: string, fr: string }`
- `state` → `{ en: string, fr: string }`
- `company` → `{ en: string, fr: string }`
- `jobTitle` → `{ en: string, fr: string }`
- `bio` → `{ en: string, fr: string }`
- `description` → `{ en: string, fr: string }`
- `details` → `{ en: string, fr: string }`
- `fullName` → `{ en: string, fr: string }`
- `title` → `{ en: string, fr: string }`
- `location` → `{ en: string, fr: string }`
- `skills[]` → `{ en: string, fr: string }[]`
- `experiences[]` → `{ en: string, fr: string }[]`
- `education[]` → `{ en: string, fr: string }[]`
- `certifications[]` → `{ en: string, fr: string }[]`
- `languages[]` → `{ en: string, fr: string }[]`

### Experiences (Nouvelles entités)

- `company` → `{ en: string, fr: string }`
- `position` → `{ en: string, fr: string }`
- `description` → `{ en: string, fr: string }`
- `location` → `{ en: string, fr: string }`
- `achievements[]` → `{ en: string, fr: string }[]`

### Studies (Nouvelles entités)

- `institution` → `{ en: string, fr: string }`
- `degree` → `{ en: string, fr: string }`
- `field` → `{ en: string, fr: string }`
- `description` → `{ en: string, fr: string }`
- `location` → `{ en: string, fr: string }`
- `subjects[]` → `{ en: string, fr: string }[]`
- `achievements[]` → `{ en: string, fr: string }[]`

## 🔧 Utilisation du service de localisation

```typescript
import { LocalizationService } from './common/services/localization.service';

// Récupérer le texte dans une langue spécifique
const text = localizationService.getLocalizedText(
  { en: 'Hello', fr: 'Bonjour' },
  'fr',
); // Retourne: 'Bonjour'

// Récupérer un array de textes localisés
const texts = localizationService.getLocalizedArray(
  [{ en: 'Skill 1', fr: 'Compétence 1' }],
  'en',
); // Retourne: ['Skill 1']

// Vérifier si un champ a du contenu
const hasContent = localizationService.hasLocalizedContent(
  { en: 'Hello', fr: '' },
  'en',
); // Retourne: true

// Obtenir les langues disponibles
const languages = localizationService.getAvailableLanguages({
  en: 'Hello',
  fr: 'Bonjour',
}); // Retourne: ['en', 'fr']
```

## ⚠️ Important

1. **Sauvegarde** : Toujours faire une sauvegarde de la base de données avant de lancer une migration
2. **Test** : Utiliser `npm run migration:test` pour tester le service de localisation
3. **Rollback** : En cas de problème, utiliser `npm run migration:rollback` pour annuler
4. **Index** : Les index de recherche ont été mis à jour pour cibler `field.en`

## 📝 Format de migration

### Avant la migration

```json
{
  "title": "Mon Projet",
  "description": "Description du projet"
}
```

### Après la migration

```json
{
  "title": { "en": "Mon Projet", "fr": "" },
  "description": { "en": "Description du projet", "fr": "" }
}
```

## 🛠️ Dépannage

### Erreur de connexion à la base de données

```bash
# Vérifier que MongoDB est démarré
sudo systemctl status mongod

# Vérifier la variable d'environnement
echo $MONGO_URI
```

### Erreur de migration

```bash
# Vérifier les logs
npm run migration:localize 2>&1 | tee migration.log

# Rollback en cas de problème
npm run migration:rollback
```

### Vérifier le statut

```bash
# Via API
curl -X GET http://localhost:3000/migration/status

# Via script
npm run migration:status
```
