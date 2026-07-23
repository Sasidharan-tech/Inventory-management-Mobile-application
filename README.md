# Inventory Management Frontend

Android-first React frontend for the Inventory Management System.

## Tech Stack

- React 19 + Vite
- React Router DOM
- Axios
- Tailwind CSS
- React Hook Form
- React Icons
- SweetAlert2
- React Hot Toast
- Framer Motion

## Setup

1. Install dependencies.

```bash
cd client
npm install
```

1. No backend is required.

- Product data is stored locally on the device in browser storage.
- Images are saved as data URLs inside the local inventory record.

1. Start the development server.

```bash
npm run dev
```

## Build

```bash
npm run build
```

## Android APK

This project is ready for Capacitor-based Android packaging.

```bash
npm run build
npm run cap:sync
npm run cap:open
```

Open the Android project in Android Studio and build the APK from there.

## Notes

- The app uses mobile-first screens and a bottom navigation bar.
- Product CRUD, search, sort, and backup are handled entirely on device.
