import { collection, doc, getDocs, orderBy, query, setDoc } from "firebase/firestore";
import { onAuthStateChanged, signInWithPopup, signOut, type User } from "firebase/auth";
import { setupFirebase } from "./firebase";
import type { Project } from "../storage/indexeddb/projects";

const PROJECTS_COLLECTION = "projects";

export function isFirebaseSyncAvailable() {
  return setupFirebase() !== null;
}

export function subscribeToCloudUser(callback: (user: User | null) => void) {
  const firebase = setupFirebase();
  if (!firebase) return () => undefined;
  return onAuthStateChanged(firebase.auth, callback);
}

export async function signInToCloud() {
  const firebase = setupFirebase();
  if (!firebase) throw new Error("Firebase sync is not configured");
  const credential = await signInWithPopup(firebase.auth, firebase.provider);
  return credential.user;
}

export async function signOutFromCloud() {
  const firebase = setupFirebase();
  if (!firebase) return;
  await signOut(firebase.auth);
}

export async function syncProjectToCloud(project: Project) {
  const firebase = setupFirebase();
  if (!firebase?.auth.currentUser) throw new Error("Sign in before syncing");
  const userId = firebase.auth.currentUser.uid;
  const projectId = project.id?.toString() ?? crypto.randomUUID();
  await setDoc(doc(firebase.db, "users", userId, PROJECTS_COLLECTION, projectId), {
    ...project,
    id: projectId,
    updatedAt: new Date().toISOString(),
  });
}

export async function getCloudProjects(): Promise<Project[]> {
  const firebase = setupFirebase();
  if (!firebase?.auth.currentUser) return [];
  const userId = firebase.auth.currentUser.uid;
  const snapshot = await getDocs(
    query(collection(firebase.db, "users", userId, PROJECTS_COLLECTION), orderBy("updatedAt", "desc")),
  );
  return snapshot.docs.map((item) => item.data() as Project);
}