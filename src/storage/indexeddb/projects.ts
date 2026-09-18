// IndexedDB storage for projects
import { openDB } from "idb";

const DB_NAME = "toon-json-converter";
const STORE_NAME = "projects";

export interface Project {
  id?: number | string;
  name: string;
  input: string;
  output: string;
  updatedAt: string;
}

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

export async function saveProject(project: Project) {
  const db = await getDb();
  if (project.id === undefined) {
    return db.add(STORE_NAME, project);
  }
  return db.put(STORE_NAME, project);
}

export async function getProjects(): Promise<Project[]> {
  const db = await getDb();
  return db.getAll(STORE_NAME);
}

export async function deleteProject(id: IDBValidKey) {
  const db = await getDb();
  await db.delete(STORE_NAME, id);
}
