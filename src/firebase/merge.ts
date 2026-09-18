import type { Project } from "../storage/indexeddb/projects";

export type ProjectMergeResult = {
  projects: Project[];
  added: number;
  updated: number;
  conflicts: number;
};

export function mergeProjectsByUpdatedAt(localProjects: Project[], cloudProjects: Project[]): ProjectMergeResult {
  const merged = new Map<string, Project>();
  let added = 0;
  let updated = 0;
  let conflicts = 0;

  for (const project of localProjects) {
    merged.set(getProjectMergeKey(project), project);
  }

  for (const cloudProject of cloudProjects) {
    const key = getProjectMergeKey(cloudProject);
    const localProject = merged.get(key);
    if (!localProject) {
      merged.set(key, cloudProject);
      added += 1;
      continue;
    }

    if (localProject.input !== cloudProject.input || localProject.output !== cloudProject.output) {
      conflicts += 1;
      if (new Date(cloudProject.updatedAt).getTime() > new Date(localProject.updatedAt).getTime()) {
        merged.set(key, { ...cloudProject, name: localProject.name || cloudProject.name });
        updated += 1;
      }
    }
  }

  return { projects: [...merged.values()], added, updated, conflicts };
}

function getProjectMergeKey(project: Project) {
  return String(project.id ?? project.name).toLowerCase();
}