# Portfolio

## Formulaire de contact

Les messages sont enregistrés dans la table Supabase `contact_messages`, puis une notification est envoyée avec l'API Resend. Configurez les variables suivantes dans l'environnement serveur (localement dans `.env`, et dans les variables d'environnement de l'hébergeur) :

```env
RESEND_API_KEY=re_...
CONTACT_FROM_EMAIL=Portfolio <contact@votre-domaine.com>
CONTACT_TO_EMAIL=michaelnadrasana@gmail.com
```

`RESEND_API_KEY` et `CONTACT_FROM_EMAIL` sont requis. L'adresse d'expédition doit être vérifiée dans Resend. `CONTACT_TO_EMAIL` est facultative et vaut `michaelnadrasana@gmail.com` par défaut. Les secrets restent côté serveur. Si Resend est indisponible ou mal configuré, le message reste enregistré dans Supabase et le formulaire l'indique.
