// ===========================================
// Auth Helper Utilities
// ===========================================

import { auth } from "@/lib/auth";
import { Role } from "@prisma/client";
import { redirect } from "next/navigation";

/**
 * Get the current authenticated session.
 * Redirects to login if not authenticated.
 */
export async function requireAuth() {
  const session = await auth();
  if (!session?.user) {
    redirect("/admin/login");
  }
  return session;
}

/**
 * Require a specific role or higher.
 * Role hierarchy: SUPER_ADMIN > ADMIN > EDITOR
 */
export async function requireRole(minimumRole: Role) {
  const session = await requireAuth();
  
  const roleHierarchy: Record<Role, number> = {
    EDITOR: 1,
    ADMIN: 2,
    SUPER_ADMIN: 3,
  };

  const userLevel = roleHierarchy[session.user.role];
  const requiredLevel = roleHierarchy[minimumRole];

  if (userLevel < requiredLevel) {
    redirect("/admin?error=insufficient_permissions");
  }

  return session;
}

/**
 * Check if user has at least the given role (no redirect).
 */
export async function hasRole(minimumRole: Role): Promise<boolean> {
  const session = await auth();
  if (!session?.user) return false;

  const roleHierarchy: Record<Role, number> = {
    EDITOR: 1,
    ADMIN: 2,
    SUPER_ADMIN: 3,
  };

  return roleHierarchy[session.user.role] >= roleHierarchy[minimumRole];
}
