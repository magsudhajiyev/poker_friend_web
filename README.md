# Poker Friend Landing Page

A responsive landing page for the Poker Friend mobile app with Firebase integration for waitlist management.

## Features

- 🎮 Modern, responsive design inspired by Phantom
- 📱 Mobile-first with hamburger navigation
- 🔥 Firebase Firestore integration for waitlist
- ✨ Smooth scroll animations
- 🎯 Interactive flip button animation
- 📊 Email collection with real-time validation

## Tech Stack

- HTML5, CSS3, JavaScript (ES6)
- Firebase Firestore
- Live Server for development

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Configure Firebase credentials in `script.js`
4. Run development server: `npm run dev`

## Firebase Setup

Replace the Firebase configuration in `script.js` with your project credentials:

```javascript
const firebaseConfig = {
    apiKey: "your-api-key",
    authDomain: "your-project.firebaseapp.com",
    projectId: "your-project-id",
    // ... other config
};
```

## Development

- `npm run dev` - Start development server on port 3000
- `npm run serve` - Start server on port 8080

Built with ❤️ for poker enthusiasts