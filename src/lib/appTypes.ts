export type UserRole = "user" | "admin";

export type PlanType = "free" | "pro" | "teams" | "admin_unlimited";

export type AppProfile = {
  id: string;
  email: string;
  full_name: string | null;
  role: UserRole;
  plan: PlanType;
  ai_credits: number | null;
};

export type ProjectRecord = {
  id: string;
  user_id: string;
  title: string;
  status: "draft" | "published";
  created_at: string;
};

export function isAdminUnlimited(profile: AppProfile | null) {
  return profile?.role === "admin" || profile?.plan === "admin_unlimited";
}

export function getDisplayCredits(profile: AppProfile | null) {
  if (!profile) return "0";
  if (isAdminUnlimited(profile)) return "Unlimited";
  return String(profile.ai_credits ?? 0);
}
