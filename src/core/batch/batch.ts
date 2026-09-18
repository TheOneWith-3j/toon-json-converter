export type BatchDirection = "json-toon" | "toon-json";

export function getBatchFileName(file: File) {
  const fileWithPath = file as File & { webkitRelativePath?: string };
  return fileWithPath.webkitRelativePath || file.name;
}

export function getBatchOutputName(fileName: string, targetDirection: BatchDirection) {
  const extension = targetDirection === "json-toon" ? "toon" : "json";
  return fileName.match(/\.(json|toon|txt)$/i)
    ? fileName.replace(/\.(json|toon|txt)$/i, `.${extension}`)
    : `${fileName}.${extension}`;
}
