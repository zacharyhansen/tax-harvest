export function mergeViewNameWithRole({
  view,
  role,
}: {
  view: string;
  role: string;
}): string {
  return `${view}__${role}`;
}
