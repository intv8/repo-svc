const splitCaps = (str: string) =>
  str
    .replace(/([a-z])([A-Z]+)/g, (_m, s1, s2) => s1 + " " + s2)
    .replace(/([A-Z])([A-Z]+)([^a-zA-Z0-9]*)$/, (_m, s1, s2, s3) =>
      s1 + s2.toLowerCase() + s3)
    .replace(/([A-Z]+)([A-Z][a-z])/g, (_m, s1, s2) =>
      s1.toLowerCase() + " " + s2);

export function createFilename(name: string): string {
  return splitCaps(name)
    .replace(/\W+/g, " ")
    .split(/ |\B(?=[A-Z])/)
    .map((word) => word.toLowerCase())
    .join("_");
}
