import type { Role } from "@prisma/client";

export type Action = "create" | "update" | "delete" | "publish" | "manageUsers";

const ROLE_RANK: Record<Role, number> = {
  READ_ONLY: 0,
  BRANCH_MANAGER: 1,
  CONTENT_CREATOR: 2,
  EDITOR: 3,
  ADMIN: 4,
  SUPER_ADMIN: 5,
};

const MIN_RANK_FOR_ACTION: Record<Action, number> = {
  create: ROLE_RANK.CONTENT_CREATOR,
  update: ROLE_RANK.CONTENT_CREATOR,
  publish: ROLE_RANK.EDITOR,
  delete: ROLE_RANK.EDITOR,
  manageUsers: ROLE_RANK.ADMIN,
};

export function can(role: Role, action: Action): boolean {
  return ROLE_RANK[role] >= MIN_RANK_FOR_ACTION[action];
}
