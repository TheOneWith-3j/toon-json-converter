"use client";

import { useEffect, useState, type ReactNode } from "react";
import JSZip from "jszip";
import { detectInputType, type DetectedType } from "../core/detect";
import { validateInput, type ValidationResult } from "../core/validate";
import { getBatchFileName, getBatchOutputName } from "../core/batch/batch";
import { encodeToon, decodeToon } from "../core/codec/toon";
import { getLineDiff } from "../core/diff/diff";
import { inferSchema, type SchemaNode } from "../core/schema/inferSchema";
import {
  applyTransforms,
  type TransformRule,
} from "../core/transforms/transformEngine";
import {
  getDefaultMetrics,
  loadMetrics,
  recordConversion,
  saveMetrics,
  type Metrics,
} from "../metrics/metrics";
import {
  deleteProject,
  getProjects,
  saveProject,
  type Project,
} from "../storage/indexeddb/projects";
import {
  getCloudProjects,
  isFirebaseSyncAvailable,
  signInToCloud,
  signOutFromCloud,
  subscribeToCloudUser,
  syncProjectToCloud,
} from "../firebase/sync";
import { mergeProjectsByUpdatedAt } from "../firebase/merge";
import CodeMirrorEditor from "./CodeMirrorEditor";

type Direction = "auto" | "json-toon" | "toon-json";
type MobilePane = "input" | "output";
type RuleKind = TransformRule["type"];
type BatchResult = {
  fileName: string;
  outputName?: string;
  status: "converted" | "failed";
  direction?: "json-toon" | "toon-json";
  inputSize: number;
  outputSize?: number;
  error?: string;
};

const presets: Record<string, string> = {
  "User record": '{"id":42,"name":"Ada Lovelace","active":true}',
  "Inventory list": '{"items":[{"sku":"A-1","qty":12},{"sku":"B-2","qty":4}]}',
  "Event payload":
    '{"event":"checkout.completed","timestamp":"2026-09-14T12:00:00Z","total":99.5}',
};

export default function ConverterPane() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [outputType, setOutputType] = useState<"json" | "toon">("json");
  const [detected, setDetected] = useState<DetectedType>("unknown");
  const [direction, setDirection] = useState<Direction>("auto");
  const [validation, setValidation] = useState<ValidationResult | null>(null);
  const [schema, setSchema] = useState<SchemaNode | null>(null);
  const [roundTrip, setRoundTrip] = useState<boolean | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectName, setProjectName] = useState("Untitled conversion");
  const [projectSearch, setProjectSearch] = useState("");
  const [status, setStatus] = useState("");
  const [rules, setRules] = useState<TransformRule[]>([]);
  const [metrics, setMetrics] = useState<Metrics>(() => getDefaultMetrics());
  const [online, setOnline] = useState(true);
  const [mobilePane, setMobilePane] = useState<MobilePane>("input");
  const [cloudUser, setCloudUser] = useState<string | null>(null);
  const [cloudProjects, setCloudProjects] = useState<Project[]>([]);
  const [ruleKind, setRuleKind] = useState<RuleKind>("rename");
  const [rulePath, setRulePath] = useState("");
  const [ruleValue, setRuleValue] = useState("");
  const [batchResults, setBatchResults] = useState<BatchResult[]>([]);
  const syncAvailable = isFirebaseSyncAvailable();

  useEffect(() => {
    getProjects()
      .then(setProjects)
      .catch(() => undefined);
    queueMicrotask(() => setMetrics(loadMetrics()));
    const updateOnline = () => setOnline(navigator.onLine);
    window.addEventListener("online", updateOnline);
    window.addEventListener("offline", updateOnline);
    const unsubscribeCloud = subscribeToCloudUser((user) => {
      setCloudUser(user?.email ?? null);
      if (user) {
        getCloudProjects()
          .then(setCloudProjects)
          .catch(() => undefined);
      } else {
        setCloudProjects([]);
      }
    });
    return () => {
      window.removeEventListener("online", updateOnline);
      window.removeEventListener("offline", updateOnline);
      unsubscribeCloud();
    };
  }, []);

  function inspect(value: string) {
    const type = detectInputType(value);
    setDetected(type);
    setValidation(value ? validateInput(value) : null);
  }

  function convert(value = input, selectedDirection = direction) {
    const type = detectInputType(value);
    const actualDirection =
      selectedDirection === "auto"
        ? type === "json"
          ? "json-toon"
          : "toon-json"
        : selectedDirection;
    let outputSize = 0;
    try {
      if (actualDirection === "json-toon") {
        const json = applyTransforms(JSON.parse(value), rules);
        const toon = encodeToon(json);
        outputSize = toon.length;
        setOutput(toon);
        setOutputType("toon");
        setSchema(inferSchema(json));
        setRoundTrip(JSON.stringify(decodeToon(toon)) === JSON.stringify(json));
      } else {
        const json = applyTransforms(decodeToon(value), rules);
        const jsonText = JSON.stringify(json, null, 2);
        outputSize = jsonText.length;
        setOutput(jsonText);
        setOutputType("json");
        setSchema(inferSchema(json));
        setRoundTrip(
          JSON.stringify(decodeToon(encodeToon(json))) === JSON.stringify(json),
        );
      }
      const nextMetrics = recordConversion(
        metrics,
        value.length,
        outputSize,
        actualDirection,
        true,
      );
      setMetrics(nextMetrics);
      saveMetrics(nextMetrics);
      setStatus("Converted successfully");
    } catch (error) {
      setOutput("");
      setOutputType("json");
      setSchema(null);
      setRoundTrip(null);
      const nextMetrics = recordConversion(
        metrics,
        value.length,
        0,
        actualDirection,
        false,
      );
      setMetrics(nextMetrics);
      saveMetrics(nextMetrics);
      setStatus(error instanceof Error ? error.message : "Conversion failed");
    }
  }

  function handleInputChange(value: string) {
    setInput(value);
    inspect(value);
    if (direction === "auto") convert(value, "auto");
  }

  function clearWorkspace() {
    setInput("");
    setOutput("");
    setOutputType("json");
    setDetected("unknown");
    setValidation(null);
    setSchema(null);
    setRoundTrip(null);
    setStatus("Workspace cleared");
  }

  function swapEditors() {
    if (!output) return;
    setInput(output);
    setOutput(input);
    setDetected(outputType);
    setOutputType(detected === "json" ? "json" : "toon");
    setValidation(validateInput(output));
    setStatus("Editors swapped");
  }

  function formatInput() {
    try {
      const type = detectInputType(input);
      const formatted =
        type === "json"
          ? JSON.stringify(JSON.parse(input), null, 2)
          : encodeToon(decodeToon(input));
      setInput(formatted);
      inspect(formatted);
      setStatus(type === "json" ? "JSON formatted" : "TOON canonicalized");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Format failed");
    }
  }

  async function copyOutput() {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setStatus("Output copied");
  }

  function repairInput() {
    const repaired = input
      .replace(/,\s*([}\]])/g, "$1")
      .replace(/([{,]\s*)'([^']+)'\s*:/g, '$1"$2":')
      .replace(/:\s*'([^']*)'/g, ': "$1"');
    try {
      const formatted = JSON.stringify(JSON.parse(repaired), null, 2);
      setInput(formatted);
      inspect(formatted);
      convert(formatted, "json-toon");
      setStatus("Input repaired and converted");
    } catch {
      setStatus("No safe repair was found");
    }
  }

  async function saveCurrentProject() {
    const name = projectName.trim() || "Untitled conversion";
    await saveProject({
      name,
      input,
      output,
      updatedAt: new Date().toISOString(),
    });
    setProjects(await getProjects());
    setStatus("Project saved locally");
  }

  async function removeLocalProject(projectId: IDBValidKey | undefined) {
    if (projectId === undefined) return;
    const confirmed = window.confirm("Delete this local project?");
    if (!confirmed) return;
    await deleteProject(projectId);
    setProjects(await getProjects());
    setStatus("Project deleted");
  }

  function loadProject(project: Project) {
    setInput(project.input);
    setOutput(project.output);
    setProjectName(project.name);
    inspect(project.input);
    setStatus(`${project.name} loaded`);
  }

  function addTransformRule() {
    if (!rulePath) return;
    const values = ruleValue
      .split(",")
      .map((value) => value.trim())
      .filter(Boolean);
    const mapFns: Record<string, (value: unknown) => unknown> = {
      uppercase: (value) => String(value).toUpperCase(),
      lowercase: (value) => String(value).toLowerCase(),
      number: (value) => Number(value),
      string: (value) => String(value),
      boolean: (value) => value === true || value === "true",
      null: () => null,
    };
    const nextRule: TransformRule | null =
      ruleKind === "rename" && ruleValue
        ? { type: "rename", path: rulePath, newKey: ruleValue }
        : ruleKind === "prefix" && ruleValue
          ? { type: "prefix", path: rulePath, prefix: ruleValue }
          : ruleKind === "filter" && values.length > 0
            ? { type: "filter", path: rulePath, include: values }
            : ruleKind === "map" && mapFns[ruleValue]
              ? { type: "map", path: rulePath, mapFn: mapFns[ruleValue] }
              : null;
    if (!nextRule) {
      setStatus("Complete the transform rule before adding it");
      return;
    }
    setRules([...rules, nextRule]);
    setRulePath("");
    setRuleValue("");
    setStatus("Transform rule added");
  }

  async function syncCurrentProject() {
    try {
      const project = {
        name: "Synced conversion",
        input,
        output,
        updatedAt: new Date().toISOString(),
      };
      await syncProjectToCloud(project);
      setCloudProjects(await getCloudProjects());
      setStatus("Project synced to Firebase");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Cloud sync failed");
    }
  }

  async function pullCloudProjects() {
    try {
      const cloud = await getCloudProjects();
      const merged = mergeProjectsByUpdatedAt(projects, cloud);
      await Promise.all(merged.projects.map((project) => saveProject(project)));
      setProjects(await getProjects());
      setCloudProjects(cloud);
      setStatus(
        `Cloud merged: ${merged.added} added, ${merged.updated} updated, ${merged.conflicts} conflict${merged.conflicts === 1 ? "" : "s"}`,
      );
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Cloud pull failed");
    }
  }

  async function toggleCloudAuth() {
    try {
      if (cloudUser) {
        await signOutFromCloud();
        setStatus("Signed out of cloud sync");
      } else {
        const user = await signInToCloud();
        setCloudUser(user.email ?? "Connected");
        setCloudProjects(await getCloudProjects());
        setStatus("Cloud sync connected");
      }
    } catch (error) {
      setStatus(
        error instanceof Error ? error.message : "Cloud sync unavailable",
      );
    }
  }

  function exportProject(
    projectsToExport: Project[] = [
      {
        name: projectName.trim() || "Exported project",
        input,
        output,
        updatedAt: new Date().toISOString(),
      },
    ],
  ) {
    const blob = new Blob(
      [
        JSON.stringify(
          projectsToExport.length === 1
            ? projectsToExport[0]
            : { projects: projectsToExport },
          null,
          2,
        ),
      ],
      { type: "application/json" },
    );
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download =
      projectsToExport.length === 1
        ? "toon-project.json"
        : "toon-projects.json";
    link.click();
    URL.revokeObjectURL(url);
  }

  function importProject(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    file
      .text()
      .then(async (text) => {
        const payload = JSON.parse(text) as Project | { projects?: Project[] };
        const importedProjects = Array.isArray(
          (payload as { projects?: Project[] }).projects,
        )
          ? (payload as { projects: Project[] }).projects
          : [payload as Project];
        const normalizedProjects = importedProjects
          .filter(
            (project) =>
              typeof project.input === "string" &&
              typeof project.output === "string",
          )
          .map((project) => ({
            name: project.name || "Imported conversion",
            input: project.input,
            output: project.output,
            updatedAt: project.updatedAt || new Date().toISOString(),
          }));
        await Promise.all(
          normalizedProjects.map((project) => saveProject(project)),
        );
        setProjects(await getProjects());
        if (normalizedProjects[0]) loadProject(normalizedProjects[0]);
        setStatus(
          `${normalizedProjects.length} project${normalizedProjects.length === 1 ? "" : "s"} imported`,
        );
      })
      .catch(() => setStatus("Invalid project file"));
    event.target.value = "";
  }

  async function convertFiles(files: File[]) {
    if (!files.length) return;
    const zip = new JSZip();
    const results: BatchResult[] = [];
    for (const file of files) {
      const fileName = getBatchFileName(file);
      try {
        const text = await file.text();
        const type = detectInputType(text);
        if (type === "unknown") {
          throw new Error("Input type could not be detected");
        }
        const targetDirection =
          direction === "auto"
            ? type === "json"
              ? "json-toon"
              : "toon-json"
            : direction;
        const value =
          targetDirection === "json-toon"
            ? encodeToon(applyTransforms(JSON.parse(text), rules))
            : JSON.stringify(applyTransforms(decodeToon(text), rules), null, 2);
        const outputName = getBatchOutputName(fileName, targetDirection);
        zip.file(outputName, value);
        results.push({
          fileName,
          outputName,
          status: "converted",
          direction: targetDirection,
          inputSize: text.length,
          outputSize: value.length,
        });
      } catch (error) {
        results.push({
          fileName,
          status: "failed",
          inputSize: file.size,
          error: error instanceof Error ? error.message : "Conversion failed",
        });
      }
    }
    const converted = results.filter(
      (result) => result.status === "converted",
    ).length;
    if (converted) {
      const blob = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "toon-batch.zip";
      link.click();
      URL.revokeObjectURL(url);
    }
    setBatchResults(results);
    setStatus(`${converted} file${converted === 1 ? "" : "s"} converted`);
  }

  async function convertBatch(event: React.ChangeEvent<HTMLInputElement>) {
    await convertFiles([...(event.target.files ?? [])]);
    event.target.value = "";
  }

  function exportMetrics() {
    const blob = new Blob([JSON.stringify(metrics, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "toon-metrics.json";
    link.click();
    URL.revokeObjectURL(url);
  }

  function downloadOutput() {
    const blob = new Blob([output], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download =
      direction === "toon-json" ? "converted.json" : "converted.toon";
    link.click();
    URL.revokeObjectURL(url);
  }

  const diff = output ? getLineDiff(input, output) : [];
  const addedLines = diff
    .filter((part) => part.added)
    .reduce((total, part) => total + countLines(part.value), 0);
  const removedLines = diff
    .filter((part) => part.removed)
    .reduce((total, part) => total + countLines(part.value), 0);
  const sizeDelta =
    input.length === 0
      ? 0
      : Math.round(((output.length - input.length) / input.length) * 100);
  const filteredProjects = projects.filter((project) =>
    project.name.toLowerCase().includes(projectSearch.toLowerCase()),
  );

  return (
    <section
      className="workspace-shell space-y-4"
      onKeyDown={(event) => {
        if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
          event.preventDefault();
          convert();
        }
      }}
    >
      <div className="workspace-toolbar flex flex-wrap items-center gap-3">
        <label className="text-sm font-semibold" htmlFor="direction">
          Direction
        </label>
        <select
          id="direction"
          value={direction}
          onChange={(event) => setDirection(event.target.value as Direction)}
          className="rounded border border-neutral-300 bg-transparent px-2 py-1 text-sm dark:border-neutral-700"
        >
          <option value="auto">Auto detect</option>
          <option value="json-toon">JSON to TOON</option>
          <option value="toon-json">TOON to JSON</option>
        </select>
        <select
          defaultValue=""
          onChange={(event) => {
            const value = presets[event.target.value];
            if (value) {
              setInput(value);
              inspect(value);
              convert(value, "json-toon");
            }
          }}
          className="rounded border border-neutral-300 bg-transparent px-2 py-1 text-sm dark:border-neutral-700"
        >
          <option value="">Load preset</option>
          {Object.keys(presets).map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
        <button
          onClick={() => convert()}
          className="rounded bg-neutral-900 px-3 py-1.5 text-sm font-semibold text-white dark:bg-white dark:text-neutral-900"
        >
          Convert
        </button>
        <button
          onClick={formatInput}
          disabled={!input}
          className="rounded border border-neutral-300 px-3 py-1.5 text-sm disabled:opacity-40 dark:border-neutral-700"
        >
          Format
        </button>
        <button
          onClick={swapEditors}
          disabled={!output}
          className="rounded border border-neutral-300 px-3 py-1.5 text-sm disabled:opacity-40 dark:border-neutral-700"
        >
          Swap
        </button>
        <button
          onClick={copyOutput}
          disabled={!output}
          className="rounded border border-neutral-300 px-3 py-1.5 text-sm disabled:opacity-40 dark:border-neutral-700"
        >
          Copy
        </button>
        <button
          onClick={clearWorkspace}
          disabled={!input && !output}
          className="rounded border border-neutral-300 px-3 py-1.5 text-sm disabled:opacity-40 dark:border-neutral-700"
        >
          Clear
        </button>
        <button
          onClick={saveCurrentProject}
          className="rounded border border-neutral-300 px-3 py-1.5 text-sm dark:border-neutral-700"
        >
          Save project
        </button>
        <button
          onClick={downloadOutput}
          disabled={!output}
          className="rounded border border-neutral-300 px-3 py-1.5 text-sm disabled:opacity-40 dark:border-neutral-700"
        >
          Download
        </button>
        <label className="cursor-pointer rounded border border-neutral-300 px-3 py-1.5 text-sm dark:border-neutral-700">
          Batch ZIP
          <input
            type="file"
            multiple
            accept=".json,.toon,text/plain,application/json"
            onChange={convertBatch}
            className="hidden"
          />
        </label>
        <label className="cursor-pointer rounded border border-neutral-300 px-3 py-1.5 text-sm dark:border-neutral-700">
          Import
          <input
            type="file"
            accept="application/json"
            onChange={importProject}
            className="hidden"
          />
        </label>
        <button
          onClick={() => exportProject()}
          className="rounded border border-neutral-300 px-3 py-1.5 text-sm dark:border-neutral-700"
        >
          Export
        </button>
        <button
          onClick={() => exportProject(projects)}
          disabled={projects.length === 0}
          className="rounded border border-neutral-300 px-3 py-1.5 text-sm disabled:opacity-40 dark:border-neutral-700"
        >
          Export all
        </button>
        {syncAvailable && (
          <>
            <button
              onClick={toggleCloudAuth}
              className="rounded border border-neutral-300 px-3 py-1.5 text-sm dark:border-neutral-700"
            >
              {cloudUser ? "Sign out" : "Connect sync"}
            </button>
            <button
              onClick={syncCurrentProject}
              disabled={!cloudUser || !input}
              className="rounded border border-neutral-300 px-3 py-1.5 text-sm disabled:opacity-40 dark:border-neutral-700"
            >
              Sync
            </button>
            <button
              onClick={pullCloudProjects}
              disabled={!cloudUser}
              className="rounded border border-neutral-300 px-3 py-1.5 text-sm disabled:opacity-40 dark:border-neutral-700"
            >
              Pull cloud
            </button>
          </>
        )}
        <span
          className={`text-xs font-semibold ${online ? "text-emerald-600" : "text-amber-600"}`}
        >
          {online ? "Online" : "Offline"}
        </span>
        {status && <span className="text-xs text-neutral-500">{status}</span>}
      </div>

      <div
        className="drop-zone"
        onDragOver={(event) => event.preventDefault()}
        onDrop={(event) => {
          event.preventDefault();
          void convertFiles([...event.dataTransfer.files]);
        }}
      >
        <span className="drop-zone-icon">↓</span>
        <span>
          <strong>Drop JSON or TOON files here</strong>
          <small>Batch conversion will package the results as a ZIP.</small>
        </span>
      </div>

      {batchResults.length > 0 && (
        <InfoPanel title="Batch report">
          <div className="batch-summary">
            <Metric
              label="Converted"
              value={
                batchResults.filter((result) => result.status === "converted")
                  .length
              }
            />
            <Metric
              label="Failed"
              value={
                batchResults.filter((result) => result.status === "failed")
                  .length
              }
            />
            <Metric label="Files" value={batchResults.length} />
            <Metric
              label="Output"
              value={`${batchResults.reduce((total, result) => total + (result.outputSize ?? 0), 0)}b`}
            />
          </div>
          <div className="batch-list">
            {batchResults.map((result) => (
              <div
                className="batch-row"
                key={`${result.fileName}-${result.outputName ?? result.error}`}
              >
                <span className={result.status}>{result.status}</span>
                <strong>{result.fileName}</strong>
                <small>{result.outputName ?? result.error}</small>
              </div>
            ))}
          </div>
        </InfoPanel>
      )}

      <div className="secondary-tools grid gap-4 md:grid-cols-2">
        <InfoPanel title="Transform rules">
          <div className="flex flex-wrap gap-2">
            <select
              value={ruleKind}
              onChange={(event) => {
                setRuleKind(event.target.value as RuleKind);
                setRuleValue("");
              }}
              className="rounded border border-neutral-300 px-2 py-1 text-sm dark:border-neutral-700"
            >
              <option value="rename">Rename key</option>
              <option value="prefix">Prefix value</option>
              <option value="filter">Filter include</option>
              <option value="map">Map value</option>
            </select>
            <input
              placeholder="Path, e.g. users.name"
              value={rulePath}
              onChange={(event) => setRulePath(event.target.value)}
              className="min-w-40 rounded border border-neutral-300 px-2 py-1 text-sm dark:border-neutral-700"
            />
            {ruleKind === "map" ? (
              <select
                value={ruleValue}
                onChange={(event) => setRuleValue(event.target.value)}
                className="rounded border border-neutral-300 px-2 py-1 text-sm dark:border-neutral-700"
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
                placeholder={
                  ruleKind === "filter"
                    ? "Allowed values, comma-separated"
                    : "New key or prefix"
                }
                value={ruleValue}
                onChange={(event) => setRuleValue(event.target.value)}
                className="min-w-40 rounded border border-neutral-300 px-2 py-1 text-sm dark:border-neutral-700"
              />
            )}
            <button
              onClick={addTransformRule}
              className="rounded border border-neutral-300 px-2 py-1 text-sm dark:border-neutral-700"
            >
              Add rule
            </button>
          </div>
          {rules.map((rule, index) => (
            <button
              key={`${rule.path}-${index}`}
              onClick={() =>
                setRules(rules.filter((_, ruleIndex) => ruleIndex !== index))
              }
              className="mr-2 mt-2 text-xs text-neutral-500 underline"
            >
              {rule.type}: {rule.path} x
            </button>
          ))}
        </InfoPanel>
        <InfoPanel title="Metrics">
          <div className="metric-grid">
            <Metric
              label="Conversions"
              value={metrics?.totalConversions ?? 0}
            />
            <Metric label="Success" value={metrics?.successCount ?? 0} />
            <Metric label="Failures" value={metrics?.failureCount ?? 0} />
            <Metric
              label="Avg out"
              value={`${Math.round(metrics?.avgOutputSize ?? 0)}b`}
            />
          </div>
          <p className="mt-3 text-xs text-neutral-500">
            Stored locally in this browser
          </p>
          <button
            onClick={exportMetrics}
            className="mt-3 rounded border px-2 py-1 text-xs"
          >
            Export metrics
          </button>
        </InfoPanel>
      </div>

      <div className="editor-grid grid gap-4 lg:grid-cols-2">
        <div className="mobile-tabs" role="tablist" aria-label="Editor panes">
          <button
            className={mobilePane === "input" ? "active" : ""}
            onClick={() => setMobilePane("input")}
            role="tab"
            aria-selected={mobilePane === "input"}
          >
            Input
          </button>
          <button
            className={mobilePane === "output" ? "active" : ""}
            onClick={() => setMobilePane("output")}
            role="tab"
            aria-selected={mobilePane === "output"}
          >
            Output
          </button>
        </div>
        <EditorPanel
          title="Input"
          value={input}
          onChange={handleInputChange}
          language={detected === "toon" ? "toon" : "json"}
          line={validation?.error?.line}
          mobileHidden={mobilePane !== "input"}
        />
        <EditorPanel
          title="Output"
          value={output}
          language={outputType}
          readOnly
          mobileHidden={mobilePane !== "output"}
        />
      </div>

      {output && (
        <div className="comparison-bar">
          <Metric label="Input" value={`${input.length}b`} />
          <Metric label="Output" value={`${output.length}b`} />
          <Metric
            label="Size delta"
            value={`${sizeDelta > 0 ? "+" : ""}${sizeDelta}%`}
          />
          <Metric label="Diff" value={`+${addedLines} / -${removedLines}`} />
        </div>
      )}

      {validation && !validation.valid && detected === "unknown" && (
        <div className="repair-banner">
          <div>
            <strong>Input needs attention</strong>
            <span>
              Try removing trailing commas or normalizing quoted values.
            </span>
          </div>
          <button onClick={repairInput}>Repair JSON</button>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-3">
        <InfoPanel title="Detection">
          <p className="font-semibold uppercase">{detected}</p>
          <p className="text-xs text-neutral-500">
            {validation?.valid
              ? "Valid input"
              : (validation?.error?.message ?? "Enter JSON or TOON to begin")}
          </p>
        </InfoPanel>
        <InfoPanel title="Round trip">
          <p
            className={`font-semibold ${roundTrip === false ? "text-red-600" : "text-emerald-600"}`}
          >
            {roundTrip === null
              ? "Not checked"
              : roundTrip
                ? "Verified"
                : "Mismatch"}
          </p>
        </InfoPanel>
        <InfoPanel title="Local projects">
          <div className="project-controls">
            <input
              value={projectName}
              onChange={(event) => setProjectName(event.target.value)}
              placeholder="Project name"
            />
            <input
              value={projectSearch}
              onChange={(event) => setProjectSearch(event.target.value)}
              placeholder="Search projects"
            />
          </div>
          {projects.length === 0 ? (
            <p className="text-xs text-neutral-500">No saved projects</p>
          ) : filteredProjects.length === 0 ? (
            <p className="text-xs text-neutral-500">
              No projects match this search
            </p>
          ) : (
            filteredProjects
              .slice(-6)
              .reverse()
              .map((project) => (
                <div className="project-row" key={project.id}>
                  <button
                    onClick={() => loadProject(project)}
                    className="truncate text-left text-sm hover:underline"
                  >
                    {project.name}
                  </button>
                  <button
                    onClick={() => void removeLocalProject(project.id)}
                    className="text-xs text-neutral-500 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              ))
          )}
        </InfoPanel>
        {syncAvailable && (
          <InfoPanel title="Cloud sync">
            <p className="text-sm">{cloudUser ?? "Not connected"}</p>
            <p className="text-xs text-neutral-500">
              Newer `updatedAt` wins when local and cloud projects conflict.
            </p>
            {cloudProjects.slice(0, 3).map((project) => (
              <button
                key={`${project.id}-${project.updatedAt}`}
                onClick={() => {
                  setInput(project.input);
                  setOutput(project.output);
                  inspect(project.input);
                }}
                className="block w-full truncate text-left text-sm hover:underline"
              >
                {project.name}
              </button>
            ))}
          </InfoPanel>
        )}
      </div>

      {schema && (
        <InfoPanel title="Inferred schema">
          <SchemaTree node={schema} />
        </InfoPanel>
      )}
      {diff.length > 0 && (
        <InfoPanel title="Line diff">
          <div className="diff-summary">
            <span>Added {addedLines}</span>
            <span>Removed {removedLines}</span>
          </div>
          <pre className="max-h-56 overflow-auto text-xs">
            {diff.map((part, index) => (
              <span
                key={index}
                className={
                  part.added
                    ? "bg-emerald-100 text-emerald-800"
                    : part.removed
                      ? "bg-red-100 text-red-800"
                      : ""
                }
              >
                {part.value}
              </span>
            ))}
          </pre>
        </InfoPanel>
      )}
    </section>
  );
}

function countLines(value: string) {
  return value.trim() ? value.trimEnd().split(/\r?\n/).length : 0;
}

function EditorPanel({
  title,
  value,
  onChange,
  language,
  readOnly,
  line,
  mobileHidden,
}: {
  title: string;
  value: string;
  onChange?: (value: string) => void;
  language: "json" | "toon";
  readOnly?: boolean;
  line?: number;
  mobileHidden?: boolean;
}) {
  return (
    <div className={`editor-card ${mobileHidden ? "mobile-hidden" : ""}`}>
      <div className="editor-card-header">
        <h2 className="font-bold">{title}</h2>
        <span className="text-xs uppercase text-neutral-500">{language}</span>
      </div>
      <CodeMirrorEditor
        value={value}
        onChange={onChange}
        readOnly={readOnly}
        language={language}
        highlightLine={line}
      />
    </div>
  );
}

function InfoPanel({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="workspace-panel p-4">
      <h3 className="mb-2 text-sm font-semibold">{title}</h3>
      {children}
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="metric-card">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function SchemaTree({ node, depth = 0 }: { node: SchemaNode; depth?: number }) {
  return (
    <div className="text-xs" style={{ paddingLeft: depth * 12 }}>
      <span className="font-semibold">{node.key}</span>: {node.type}
      {node.optional ? " (optional)" : ""}
      {node.children?.map((child) => (
        <SchemaTree
          key={`${node.key}-${child.key}`}
          node={child}
          depth={depth + 1}
        />
      ))}
    </div>
  );
}
