// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { initializeAnalytics } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-analytics.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCmLT6ED410VgBsATrnNTOWGuBVuBm9l0I",
  authDomain: "com-heribeck-poketypeguess.firebaseapp.com",
  projectId: "com-heribeck-poketypeguess",
  storageBucket: "com-heribeck-poketypeguess.firebasestorage.app",
  messagingSenderId: "188582878540",
  appId: "1:188582878540:web:6d10e2add15a86b907c3e9",
  measurementId: "G-2TJMBKRL9E"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = initializeAnalytics(app, {
    config: {debug_mode: true},
    app_version: "2.2.7"
});
