export function escapeLabelValue(value: string): string {
  return value.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

export function buildRecentQuery(input: {
  host?: string;
  service?: string;
}): string {
  const labels: string[] = [];
  if (input.host) {
    labels.push(`host="${escapeLabelValue(input.host)}"`);
  }
  if (input.service) {
    labels.push(`service="${escapeLabelValue(input.service)}"`);
  }
  return `{${labels.join(",")}}`;
}
