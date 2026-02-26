export const APP_NAME = "CRM SaaS";
export const APP_DESCRIPTION = "The flexible CRM built for modern sales teams";

export const PLAN_LIMITS = {
  free: { users: 1, contacts: 100, deals: 10, ai: false, reports: false, api: false },
  starter: { users: 5, contacts: 1000, deals: Infinity, ai: false, reports: false, api: false },
  pro: { users: 15, contacts: Infinity, deals: Infinity, ai: true, reports: true, api: true },
  enterprise: { users: Infinity, contacts: Infinity, deals: Infinity, ai: true, reports: true, api: true },
} as const;

export const DEAL_STAGES_DEFAULT = [
  { name: "Lead", position: 0, color: "#6366f1", win_probability: 10 },
  { name: "Qualified", position: 1, color: "#8b5cf6", win_probability: 25 },
  { name: "Proposal", position: 2, color: "#f59e0b", win_probability: 50 },
  { name: "Negotiation", position: 3, color: "#f97316", win_probability: 75 },
  { name: "Closed Won", position: 4, color: "#10b981", win_probability: 100 },
  { name: "Closed Lost", position: 5, color: "#ef4444", win_probability: 0 },
] as const;

export const ACTIVITY_TYPES = [
  { value: "call", label: "Call", icon: "Phone" },
  { value: "email", label: "Email", icon: "Mail" },
  { value: "meeting", label: "Meeting", icon: "Calendar" },
  { value: "note", label: "Note", icon: "FileText" },
  { value: "task", label: "Task", icon: "CheckSquare" },
] as const;

export const CONTACT_STATUSES = [
  { value: "lead", label: "Lead" },
  { value: "prospect", label: "Prospect" },
  { value: "customer", label: "Customer" },
  { value: "churned", label: "Churned" },
] as const;

export const CONTACT_SOURCES = [
  { value: "website", label: "Website" },
  { value: "referral", label: "Referral" },
  { value: "social", label: "Social Media" },
  { value: "email", label: "Email Campaign" },
  { value: "event", label: "Event" },
  { value: "cold_outreach", label: "Cold Outreach" },
  { value: "other", label: "Other" },
] as const;

export const COMPANY_SIZES = [
  { value: "1-10", label: "1-10 employees" },
  { value: "11-50", label: "11-50 employees" },
  { value: "51-200", label: "51-200 employees" },
  { value: "201-500", label: "201-500 employees" },
  { value: "500+", label: "500+ employees" },
] as const;

export const INDUSTRIES = [
  "Technology", "SaaS", "Finance", "Healthcare", "Retail",
  "Manufacturing", "Education", "Real Estate", "Consulting", "Media", "Other",
] as const;

export const MEMBER_ROLES = [
  { value: "owner", label: "Owner" },
  { value: "admin", label: "Admin" },
  { value: "member", label: "Member" },
  { value: "viewer", label: "Viewer" },
] as const;

export const ROUTES = {
  auth: { login: "/login", signup: "/signup", forgotPassword: "/forgot-password", resetPassword: "/reset-password" },
  onboarding: { workspace: "/onboarding/workspace", team: "/onboarding/team", import: "/onboarding/import" },
  dashboard: {
    home: "/dashboard", contacts: "/contacts", companies: "/companies",
    deals: "/deals", activities: "/activities", reports: "/reports",
    settings: {
      workspace: "/settings/workspace", team: "/settings/team",
      billing: "/settings/billing", integrations: "/settings/integrations",
      notifications: "/settings/notifications",
    },
  },
} as const;
