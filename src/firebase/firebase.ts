// Firebase setup (feature-flagged)
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

export function setupFirebase(config: any) {
  if (!config) return null;
  const app = initializeApp(config);
  const auth = getAuth(app);
  const provider = new GoogleAuthProvider();
  const db = getFirestore(app);
  return { app, auth, provider, db };
}
