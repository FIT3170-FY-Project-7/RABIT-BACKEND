import {initializeApp} from "firebase/app";

/**
 * Initialise Firebase.
 */
function initFirebase() {
    const firebaseConfig = {
        apiKey: process.env.FIREBASE_API_KEY,
        authDomain: process.env.FIREBASE_AUTH_DOMAIN,
        projectId: process.env.FIREBASE_PROJECT_ID,
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.FIREBASE_APP_ID
    };

    // Check if firebase config is set properly
    if (!Object.values(firebaseConfig).every(Boolean)) {
        console.error("Error: invalid Firebase config.");
        console.error("Place your Firebase app config to the .env file.")
        console.error("More info: https://firebase.google.com/docs/web/setup#create-firebase-project-and-app");
        process.exit(1);
    }

    return initializeApp(firebaseConfig);
}

export default initFirebase;
