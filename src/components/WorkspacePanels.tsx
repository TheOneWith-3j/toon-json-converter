import type { TransformRule } from "../core/transforms/transformEngine";
import type { Metrics } from "../metrics/metrics";
import type { Project } from "../storage/indexeddb/projects";

type RuleKind = TransformRule["type"];

function Panel({
  title,
  description,
  children,
  className = "",
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`workspace-panel min-w-0 rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-6 shadow-[var(--shadow)] backdrop-blur-xl ${className}`}
    >
      <h3 className="m-0 text-[11px] font-extrabold uppercase tracking-[0.12em] text-[var(--muted)]">
        {title}
      </h3>
      {description && (
        <p className="mb-5 mt-3 text-xs leading-relaxed text-[var(--muted)]">
          {description}
        </p>
      )}
      {children}
    </section>
  );
}

export function TransformRulesPanel({
  ruleKind,
  rulePath,
  ruleValue,
  rules,
  setRuleKind,
  setRulePath,
  setRuleValue,
  addTransformRule,
  removeTransformRule,
}: {
  ruleKind: RuleKind;
  rulePath: string;
  ruleValue: string;
  rules: TransformRule[];
  setRuleKind: (value: RuleKind) => void;
  setRulePath: (value: string) => void;
  setRuleValue: (value: string) => void;
  addTransformRule: () => void;
  removeTransformRule: (index: number) => void;
}) {
  return (
    <Panel
      title="Transform rules"
      description="Shape data before conversion. Add rules in plain language and remove them anytime."
      className="lg:col-span-2"
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-[minmax(125px,.8fr)_minmax(145px,1fr)_minmax(145px,1fr)_auto]">
        <select
          value={ruleKind}
          onChange={(event) => {
            setRuleKind(event.target.value as RuleKind);
            setRuleValue("");
          }}
          className="min-h-11 min-w-0 rounded-lg border border-[var(--line)] bg-[var(--surface-solid)] px-4 py-2 text-xs text-[var(--foreground)]"
        >
          <option value="rename">Rename key</option>
          <option value="prefix">Prefix value</option>
          <option value="filter">Filter include</option>
          <option value="map">Map value</option>
        </select>
        <input
          value={rulePath}
          onChange={(event) => setRulePath(event.target.value)}
          placeholder="Path, e.g. users.name"
          className="min-h-11 min-w-0 rounded-lg border border-[var(--line)] bg-[var(--surface-solid)] px-4 py-2 text-xs text-[var(--foreground)] placeholder:text-[var(--muted)]"
        />
        {ruleKind === "map" ? (
          <select
            value={ruleValue}
            onChange={(event) => setRuleValue(event.target.value)}
            className="min-h-11 min-w-0 rounded-lg border border-[var(--line)] bg-[var(--surface-solid)] px-4 py-2 text-xs text-[var(--foreground)]"
          >
            <option value="">Choose mapping</option>
            <option value="uppercase">Uppercase</option>
            <option value="lowercase">Lowercase</option>
            <option value="number">To number</option>
            <option value="string">To string</option>
            <option value="boolean">To boolean</option>
            <option value="null">Set null</option>
          </select>
        ) : (
          <input
            value={ruleValue}
            onChange={(event) => setRuleValue(event.target.value)}
            placeholder={
              ruleKind === "filter"
                ? "Allowed values, comma-separated"
                : "New key or prefix"
            }
            className="min-h-11 min-w-0 rounded-lg border border-[var(--line)] bg-[var(--surface-solid)] px-4 py-2 text-xs text-[var(--foreground)] placeholder:text-[var(--muted)]"
          />
        )}
        <button
          onClick={addTransformRule}
          className="min-h-11 rounded-lg border border-[var(--foreground)] bg-[var(--foreground)] px-4 py-2 text-xs font-bold text-[var(--background)]"
        >
          + Add rule
        </button>
      </div>
      <div className="mt-5 flex min-h-8 flex-wrap gap-2.5 border-t border-[var(--line)] pt-4">
        {rules.length === 0 ? (
          <span className="text-[11px] text-[var(--muted)]">
            No rules added yet
          </span>
        ) : (
          rules.map((rule, index) => (
            <button
              key={`${rule.path}-${index}`}
              onClick={() => removeTransformRule(index)}
              className="inline-flex min-h-7 items-center gap-1.5 rounded-md border border-[var(--line)] bg-[color-mix(in_srgb,var(--surface-solid)_82%,var(--accent)_18%)] px-2 text-[11px] text-[var(--foreground)]"
              title="Remove this rule"
            >
              <span className="text-[9px] font-extrabold uppercase tracking-wider text-[var(--accent-strong)]">
                {rule.type}
              </span>
              {rule.path}
              <b className="text-sm font-normal text-[var(--muted)]">×</b>
            </button>
          ))
        )}
      </div>
    </Panel>
  );
}

export function MetricsPanel({
  metrics,
  exportMetrics,
}: {
  metrics: Metrics;
  exportMetrics: () => void;
}) {
  const cards = [
    ["Conversions", metrics.totalConversions],
    ["Success", metrics.successCount],
    ["Failures", metrics.failureCount],
    ["Avg out", `${Math.round(metrics.avgOutputSize)}b`],
  ] as const;
  return (
    <Panel
      title="Metrics"
      description="A private snapshot of your work in this browser."
    >
      <div className="grid grid-cols-2 gap-3">
        {cards.map(([label, value]) => (
          <div
            key={label}
            className="min-w-0 rounded-xl border border-[var(--line)] bg-[color-mix(in_srgb,var(--surface-solid)_82%,var(--accent)_18%)] p-3"
          >
            <span className="block text-[9px] font-extrabold uppercase tracking-[0.08em] text-[var(--muted)]">
              {label}
            </span>
            <strong className="mt-2 block text-base leading-none text-[var(--foreground)]">
              {value}
            </strong>
          </div>
        ))}
      </div>
      <p className="mt-4 text-[11px] text-[var(--muted)]">
        Stored locally in this browser
      </p>
      <button
        onClick={exportMetrics}
        className="mt-4 min-h-10 rounded-lg border border-[var(--line)] px-4 py-2 text-xs font-semibold text-[var(--foreground)]"
      >
        Export local metrics
      </button>
    </Panel>
  );
}

export function HealthPanel({
  title,
  value,
  description,
  tone,
}: {
  title: string;
  value: string;
  description: string;
  tone: "valid" | "unknown" | "verified" | "idle" | "mismatch";
}) {
  const indicatorClass = {
    valid: "bg-emerald-400 shadow-[0_0_0_6px_rgba(52,211,153,.14)]",
    unknown:
      "bg-[var(--accent)] shadow-[0_0_0_6px_color-mix(in_srgb,var(--accent)_18%,transparent)]",
    verified: "bg-emerald-400 shadow-[0_0_0_6px_rgba(52,211,153,.14)]",
    idle: "bg-[var(--line)] shadow-[0_0_0_6px_color-mix(in_srgb,var(--line)_30%,transparent)]",
    mismatch: "bg-red-400 shadow-[0_0_0_6px_rgba(248,113,113,.14)]",
  }[tone];

  return (
    <Panel title={title} className="min-[981px]:self-start">
      <div className="flex min-h-[64px] items-center gap-4 py-2">
        <span
          className={`h-3.5 w-3.5 shrink-0 rounded-full ${indicatorClass}`}
        />
        <div className="min-w-0">
          <p className="m-0 text-base font-bold capitalize leading-tight text-[var(--foreground)]">
            {value}
          </p>
          <p className="mb-0 mt-2 text-xs leading-relaxed text-[var(--muted)]">
            {description}
          </p>
        </div>
      </div>
    </Panel>
  );
}

export function LocalProjectsPanel({
  projects,
  filteredProjects,
  projectName,
  projectSearch,
  setProjectName,
  setProjectSearch,
  loadProject,
  removeProject,
}: {
  projects: Project[];
  filteredProjects: Project[];
  projectName: string;
  projectSearch: string;
  setProjectName: (value: string) => void;
  setProjectSearch: (value: string) => void;
  loadProject: (project: Project) => void;
  removeProject: (projectId: IDBValidKey | undefined) => void;
}) {
  return (
    <Panel
      title={`Local projects (${projects.length})`}
      className="lg:col-span-2 xl:col-span-1"
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <input
          value={projectName}
          onChange={(event) => setProjectName(event.target.value)}
          placeholder="Project name"
          className="min-h-11 min-w-0 rounded-lg border border-[var(--line)] bg-[var(--surface-solid)] px-4 py-2 text-sm text-[var(--foreground)] placeholder:text-[var(--muted)]"
        />
        <input
          value={projectSearch}
          onChange={(event) => setProjectSearch(event.target.value)}
          placeholder="Search projects"
          className="min-h-11 min-w-0 rounded-lg border border-[var(--line)] bg-[var(--surface-solid)] px-4 py-2 text-sm text-[var(--foreground)] placeholder:text-[var(--muted)]"
        />
      </div>
      {projects.length === 0 ? (
        <p className="mb-0 mt-4 text-xs text-[var(--muted)]">
          No saved projects
        </p>
      ) : filteredProjects.length === 0 ? (
        <p className="mb-0 mt-4 text-xs text-[var(--muted)]">
          No projects match this search
        </p>
      ) : (
        <div className="mt-4 grid gap-1">
          {filteredProjects.slice(0, 6).map((project) => (
            <div
              key={project.id}
              className="flex min-w-0 items-center justify-between gap-4 border-t border-[var(--line)] py-3"
            >
              <button
                onClick={() => loadProject(project)}
                className="min-w-0 truncate py-1 text-left text-sm text-[var(--foreground)] hover:underline"
              >
                {project.name}
              </button>
              <button
                onClick={() => removeProject(project.id)}
                className="shrink-0 rounded-md px-3 py-2 text-xs text-[var(--muted)] hover:bg-[color-mix(in_srgb,var(--surface-solid)_80%,var(--accent)_20%)] hover:text-[var(--foreground)]"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </Panel>
  );
}

export function CloudProjectsPanel({
  cloudUser,
  cloudProjects,
  loadProject,
}: {
  cloudUser: string | null;
  cloudProjects: Project[];
  loadProject: (project: Project) => void;
}) {
  return (
    <Panel title="Cloud sync" className="lg:col-span-2 xl:col-span-1">
      <p className="mb-0 mt-1 text-sm font-bold text-[var(--foreground)]">
        {cloudUser ?? "Not connected"}
      </p>
      <p className="mb-0 mt-2 text-xs leading-relaxed text-[var(--muted)]">
        {cloudUser
          ? "Sync the active project or pull newer cloud projects into this browser."
          : "Connect Google to sync projects across browsers."}
      </p>
      {cloudUser && cloudProjects.length === 0 ? (
        <p className="mb-0 mt-4 text-xs text-[var(--muted)]">
          No cloud projects yet
        </p>
      ) : (
        <div className="mt-4 grid gap-1">
          {cloudProjects.slice(0, 3).map((project) => (
            <button
              key={`${project.id}-${project.updatedAt}`}
              onClick={() => loadProject(project)}
              className="min-w-0 truncate border-t border-[var(--line)] py-3 text-left text-sm text-[var(--foreground)] hover:underline"
            >
              {project.name}
            </button>
          ))}
        </div>
      )}
    </Panel>
  );
}
