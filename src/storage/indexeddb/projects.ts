// IndexedDB storage for projects
import { openDB } from "idb";

const DB_NAME = "toon-json-converter";
const STORE_NAME = "projects";

export async function getDb() {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, {
          keyPath: "id",
          autoIncrement: true,
        });
      }
    },
  });
}

export async function saveProject(project: any) {
  const db = await getDb();
  await db.put(STORE_NAME, project);
}

export async function getProjects() {
  const db = await getDb();
  return db.getAll(STORE_NAME);
}

export async function deleteProject(id: number) {
  const db = await getDb();
  await db.delete(STORE_NAME, id);
}
