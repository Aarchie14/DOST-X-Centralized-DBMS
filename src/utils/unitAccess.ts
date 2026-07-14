import type { User } from "../types/auth";

/**
 * Returns true if the user is unrestricted and can view/manage every unit's dataset.
 * Currently only the "admin" role has cross-unit access.
 */
export const hasFullUnitAccess = (user: User | null): boolean =>
  user?.role === "admin";

/**
 * Returns the single department a restricted user is locked to, or null if the
 * user has full access (admin) or there is no authenticated user.
 */
export const getUnitLock = (user: User | null): string | null => {
  if (!user || hasFullUnitAccess(user)) return null;
  return user.department;
};

/**
 * Scopes a department-tagged record list down to what the given user is allowed
 * to see. Admins get the list untouched; restricted users only get records that
 * belong to their assigned unit.
 */
export const scopeToUnit = <T extends { department: string }>(
  records: T[],
  user: User | null,
): T[] => {
  const lock = getUnitLock(user);
  return lock ? records.filter((r) => r.department === lock) : records;
};

/**
 * Resolves the department a "selected department" filter/state should start at:
 * the user's own unit if restricted, otherwise the provided default (usually
 * "All department").
 */
export const resolveInitialDepartment = (
  user: User | null,
  fallback: string,
): string => getUnitLock(user) ?? fallback;
