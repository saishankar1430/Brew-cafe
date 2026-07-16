import { initializeApp, getApps, getApp } from "firebase/app";
import { initializeFirestore, getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import firebaseConfig from "../../firebase-applet-config.json";

// Initialize Firebase App
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Firestore with custom databaseId if specified in config
const db = firebaseConfig.firestoreDatabaseId
  ? initializeFirestore(app, {
      databaseId: firebaseConfig.firestoreDatabaseId,
      experimentalForceLongPolling: true,
    })
  : initializeFirestore(app, {
      experimentalForceLongPolling: true,
    });

// Initialize Firebase Auth
const auth = getAuth(app);

export { app, db, auth };
