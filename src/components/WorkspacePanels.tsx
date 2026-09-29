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
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-[minmax(125px,.8fr)_minmax(145px,1fr)_minmax(145px,1fr)_auto]">
        <select
          aria-label="Transform type"
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
          aria-label="Transform path"
          value={rulePath}
          onChange={(event) => setRulePath(event.target.value)}
          placeholder="Path, e.g. users.name"
          className="min-h-11 min-w-0 rounded-lg border border-[var(--line)] bg-[var(--surface-solid)] px-4 py-2 text-xs text-[var(--foreground)] placeholder:text-[var(--muted)]"
        />
        {ruleKind === "map" ? (
          <select
            aria-label="Mapping function"
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
            aria-label={
              ruleKind === "filter" ? "Allowed values" : "Transform value"
            }
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
  const total = metrics.totalConversions;
  const successRate = total
    ? Math.round((metrics.successCount / total) * 100)
    : 0;
  const directedTotal = metrics.jsonToonCount + metrics.toonJsonCount;
  const jsonToonShare = directedTotal
    ? (metrics.jsonToonCount / directedTotal) * 100
    : 0;
  return (
    <Panel
      title="Usage analytics"
      description="Conversion activity stored locally in this browser."
    >
      <div className="flex items-end justify-between gap-4">
        <div>
          <span className="block text-[10px] font-bold uppercase tracking-[0.08em] text-[var(--muted)]">
            Conversions
          </span>
          <strong className="mt-1 block text-4xl font-bold leading-none text-[var(--foreground)]">
            {total}
          </strong>
        </div>
        <div className="text-right">
          <span className="block text-[10px] font-bold uppercase tracking-[0.08em] text-[var(--muted)]">
            Success rate
          </span>
          <strong className="mt-1 block text-2xl font-bold leading-none text-[var(--accent-strong)]">
            {total ? `${successRate}%` : "—"}
          </strong>
        </div>
      </div>
      <div
        className="mt-4 h-2.5 overflow-hidden rounded-full bg-[var(--line)]"
        role="progressbar"
        aria-label="Successful conversion rate"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={successRate}
      >
        <div
          className="h-full rounded-full bg-[var(--accent-strong)] transition-[width] duration-300"
          style={{ width: `${successRate}%` }}
        />
      </div>
      <div className="mt-2 flex justify-between gap-3 text-[11px] text-[var(--muted)]">
        <span>{metrics.successCount} successful</span>
        <span>{metrics.failureCount} failed</span>
      </div>

      <details className="mt-5 border-t border-[var(--line)] pt-1">
        <summary className="cursor-pointer rounded-md py-3 text-xs font-semibold text-[var(--foreground)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent-strong)]">
          Direction and size details
        </summary>
        <div className="grid gap-5 pb-2 sm:grid-cols-2">
          <section aria-labelledby="direction-split-title" className="min-w-0">
            <h4
              id="direction-split-title"
              className="m-0 text-[10px] font-bold uppercase tracking-[0.08em] text-[var(--muted)]"
            >
              Direction split
            </h4>
            <div className="mt-3 grid gap-1">
              <div className="flex items-center justify-between gap-3 border-b border-[var(--line)] py-2">
                <span className="text-xs text-[var(--muted)]">JSON to TOON</span>
                <strong className="text-sm text-[var(--foreground)]">
                  {metrics.jsonToonCount}
                </strong>
              </div>
              <div className="flex items-center justify-between gap-3 border-b border-[var(--line)] py-2">
                <span className="text-xs text-[var(--muted)]">TOON to JSON</span>
                <strong className="text-sm text-[var(--foreground)]">
                  {metrics.toonJsonCount}
                </strong>
              </div>
            </div>
            <div
              className="mt-3 flex h-2.5 overflow-hidden rounded-full bg-[var(--line)]"
              role="img"
              aria-label={`${metrics.jsonToonCount} JSON to TOON conversions and ${metrics.toonJsonCount} TOON to JSON conversions`}
            >
              <span
                className="bg-[var(--accent-strong)]"
                style={{ width: `${jsonToonShare}%` }}
              />
              <span className="flex-1 bg-[var(--cyan)]" />
            </div>
          </section>
          <section aria-labelledby="average-size-title" className="min-w-0">
            <h4
              id="average-size-title"
              className="m-0 text-[10px] font-bold uppercase tracking-[0.08em] text-[var(--muted)]"
            >
              Average size
            </h4>
            <p className="mb-0 mt-2 text-[10px] leading-snug text-[var(--muted)]">
              Characters per conversion
            </p>
            <div className="mt-3 grid gap-1">
              <div className="flex items-center justify-between gap-3 border-b border-[var(--line)] py-2">
                <span className="text-xs text-[var(--muted)]">Input</span>
                <strong className="text-xs text-[var(--foreground)]">
                  {Math.round(metrics.avgInputSize).toLocaleString()} chars
                </strong>
              </div>
              <div className="flex items-center justify-between gap-3 border-b border-[var(--line)] py-2">
                <span className="text-xs text-[var(--muted)]">Output</span>
                <strong className="text-xs text-[var(--foreground)]">
                  {Math.round(metrics.avgOutputSize).toLocaleString()} chars
                </strong>
              </div>
            </div>
          </section>
        </div>
      </details>
      <button
        onClick={exportMetrics}
        className="mt-5 min-h-11 rounded-lg border border-[var(--line)] px-4 py-2 text-xs font-semibold text-[var(--foreground)] transition hover:border-[var(--accent-strong)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent-strong)]"
      >
        Export analytics data
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
          aria-label="Project name"
          value={projectName}
          onChange={(event) => setProjectName(event.target.value)}
          placeholder="Project name"
          className="min-h-11 min-w-0 rounded-lg border border-[var(--line)] bg-[var(--surface-solid)] px-4 py-2 text-sm text-[var(--foreground)] placeholder:text-[var(--muted)]"
        />
        <input
          aria-label="Search local projects"
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
