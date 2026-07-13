import type { Permission, User } from "../types/auth";

const PERMISSION_ORDER: Permission[] = [
  "read",
  "write",
  "delete",
  "manage_users",
  "edit_records",
];

const normalizeValue = (value: string) => value.toLowerCase().replace(/[^a-z]/g, "");

export const sanitizeSystemAccess = (input: unknown): Permission[] => {
  const rawValues = Array.isArray(input)
    ? input
    : typeof input === "string"
      ? [input]
      : [];

  const found = new Set<Permission>();

  rawValues.forEach((entry) => {
    if (typeof entry !== "string") return;

    const normalized = normalizeValue(entry);
    if (!normalized) return;

    if (normalized.includes("read")) found.add("read");
    if (normalized.includes("write")) found.add("write");
    if (normalized.includes("delete")) found.add("delete");
    if (normalized.includes("manageusers") || normalized.includes("usermanagement")) {
      found.add("manage_users");
    }
    if (normalized.includes("editrecords")) {
      found.add("edit_records");
    }
  });

  return PERMISSION_ORDER.filter((permission) => found.has(permission));
};

export const sanitizeUserRecord = (user: User): User => ({
  ...user,
  systemAccess: sanitizeSystemAccess(user.systemAccess),
});
