# Projet resa-barber

Ce projet est une application de réservation de services de coiffure. Il permet aux utilisateurs de parcourir différents services offerts, les ajouter à un panier, et ensuite réserver un créneau horaire avec un employé spécifique pour le service sélectionné.

## Fonctionnalités

- **Navigation par Catégories** : Les utilisateurs peuvent parcourir les services disponibles organisés par catégories.
- **Gestion du Panier** : Les utilisateurs peuvent ajouter des services à leur panier et consulter les détails avant la réservation.
- **Réservation** : Après avoir sélectionné les services désirés, les utilisateurs peuvent choisir un employé, sélectionner une date et un créneau horaire pour leur rendez-vous.

## Technologies Utilisées

- **Next.js** : Framework de développement pour React.
- **Prisma** : ORM pour la gestion de la base de données.
- **Tailwind CSS** : Framework CSS pour le design.
- **Shadcn UI** : Bibliothèque de composants React.
- **date-fns** : Bibliothèque pour la manipulation des dates.
- **PostgreSQL** : Système de gestion de base de données relationnelle.
- **Vercel** : Plateforme de déploiement pour Next.js et la base de données.

## Routes

- `/` : Page d'accueil avec la liste des services.
- `/réservation` : Page de réservation avec le panier et le formulaire de réservation.

## Installation

1. Cloner le dépôt : `git clone
2. Installer les dépendances : `npm install`
3. Créer un fichier `.env` à la racine du projet et ajouter les variables d'environnement suivantes :
4. Créer une base de données PostgreSQL et ajouter les informations de connexion dans le fichier `.env`.
5. Exécuter les migrations : `npx prisma migrate dev`
6. Exécuter le serveur de développement : `npm run dev`



