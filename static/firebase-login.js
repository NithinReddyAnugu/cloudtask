// Import the functions you need from the Firebase SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  getIdToken
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

import {
  getFirestore,
  doc,
  setDoc
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC9Bk3JXxJ0k4RZ5WJ0yTjksRfPyQxRg14",
  authDomain: "cloudtask-13ff6.firebaseapp.com",
  projectId: "cloudtask-13ff6",
  storageBucket: "cloudtask-13ff6.firebasestorage.app",
  messagingSenderId: "1074713086777",
  appId: "1:1074713086777:web:c74de2175eee8942c576e8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Helper: Set cookie
const setTokenCookie = async (user) => {
  const idToken = await getIdToken(user, true);
  document.cookie = `token=${idToken}; path=/`;
};

// DOM Elements
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const loginBtn = document.getElementById("login");
const registerBtn = document.getElementById("register");
const signOutBtn = document.getElementById("sign-out");

// Login
if (loginBtn) {
  loginBtn.addEventListener("click", async () => {
    const email = emailInput.value;
    const password = passwordInput.value;

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      await setTokenCookie(userCredential.user);
      window.location.href = "/";
    } catch (error) {
      console.error("Login error:", error.message);
      alert("Login failed: " + error.message);
    }
  });
}

// Register (Sign Up)
if (registerBtn) {
  registerBtn.addEventListener("click", async () => {
    const email = emailInput.value;
    const password = passwordInput.value;
    const roleSelect = document.getElementById("role");

    if (!roleSelect) {
      alert("Role selection not found.");
      return;
    }

    const role = roleSelect.value;

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Add user to Firestore 'users' collection with role
      await setDoc(doc(db, "users", user.uid), {
        id: user.uid,
        email: user.email,
        role: role,
        created_at: new Date().toISOString()
      });

      await setTokenCookie(user);
      window.location.href = "/";
    } catch (error) {
      console.error("Signup error:", error.message);
      alert("Signup failed: " + error.message);
    }
  });
}

// Sign Out
if (signOutBtn) {
  signOutBtn.addEventListener("click", async () => {
    try {
      await signOut(auth);
      document.cookie = "token=; Max-Age=0; path=/";
      window.location.href = "/";
    } catch (error) {
      console.error("Sign out error:", error.message);
    }
  });
}

// Auto-show logout button if logged in
onAuthStateChanged(auth, (user) => {
  if (user && signOutBtn) {
    signOutBtn.hidden = false;
  }
});

