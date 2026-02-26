export type PlanName = "free" | "starter" | "pro" | "enterprise";
export type DealStatus = "open" | "won" | "lost";
export type ActivityType = "call" | "email" | "meeting" | "note" | "task";
export type MemberRole = "owner" | "admin" | "member" | "viewer";
export type ContactStatus = "lead" | "prospect" | "customer" | "churned";
export type InvitationStatus = "pending" | "accepted" | "expired";

export interface Organization {
  id: string;
  name: string;
  slug: string;
  plan: PlanName;
  industry: string | null;
  website: string | null;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface Profile {
  id: string;
  organization_id: string;
  full_name: string;
  email?: string;
  avatar_url: string | null;
  role: MemberRole;
  onboarding_complete: boolean;
  notification_prefs: NotificationPrefs;
  created_at: string;
  updated_at: string;
}

export interface NotificationPrefs {
  email_deals: boolean;
  email_activities: boolean;
  email_team: boolean;
  in_app_deals: boolean;
  in_app_activities: boolean;
}

export interface Company {
  id: string;
  organization_id: string;
  name: string;
  domain: string | null;
  industry: string | null;
  size: string | null;
  website: string | null;
  phone: string | null;
  address: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface Contact {
  id: string;
  organization_id: string;
  company_id: string | null;
  first_name: string;
  last_name: string;
  email: string | null;
  phone: string | null;
  title: string | null;
  lead_score: number | null;
  lead_score_breakdown: LeadScoreBreakdown | null;
  tags: string[];
  status: ContactStatus;
  source: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  company?: Company;
}

export interface LeadScoreBreakdown {
  score: number;
  grade: "A" | "B" | "C" | "D" | "F";
  engagement: number;
  fit: number;
  activity: number;
  summary: string;
  recommended_action: string;
  scored_at: string;
}

export interface PipelineStage {
  id: string;
  organization_id: string;
  name: string;
  position: number;
  color: string;
  win_probability: number;
  created_at: string;
}

export interface Deal {
  id: string;
  organization_id: string;
  stage_id: string;
  contact_id: string | null;
  company_id: string | null;
  assigned_to: string | null;
  title: string;
  value: number;
  status: DealStatus;
  position: number;
  close_date: string | null;
  expected_close_date: string | null;
  won_at: string | null;
  lost_at: string | null;
  lost_reason: string | null;
  ai_suggestions: DealSuggestions | null;
  ai_suggestions_updated_at: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  stage?: PipelineStage;
  contact?: Contact;
  company?: Company;
}

export interface DealSuggestions {
  urgency: "low" | "medium" | "high";
  deal_health_score: number;
  next_actions: string[];
  risk_factors: string[];
  generated_at: string;
}

export interface Activity {
  id: string;
  organization_id: string;
  contact_id: string | null;
  deal_id: string | null;
  user_id: string;
  type: ActivityType;
  status: "planned" | "completed" | "cancelled";
  title: string;
  description: string | null;
  due_at: string | null;
  remind_at: string | null;
  reminder_sent: boolean;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
  contact?: Contact;
  deal?: Deal;
}

export interface Notification {
  id: string;
  user_id: string;
  type: string;
  title: string;
  message: string | null;
  read: boolean;
  link: string | null;
  created_at: string;
}

export interface ApiKey {
  id: string;
  organization_id: string;
  name: string;
  key_hash: string;
  key_prefix: string;
  created_by: string;
  last_used_at: string | null;
  created_at: string;
}

export interface Invitation {
  id: string;
  organization_id: string;
  email: string;
  role: MemberRole;
  token: string;
  status: InvitationStatus;
  invited_by: string;
  expires_at: string;
  created_at: string;
}

export interface DashboardKPIs {
  total_contacts: number;
  total_deals: number;
  open_deals_value: number;
  won_deals_value: number;
  win_rate: number;
  activities_this_week: number;
  new_contacts_this_month: number;
  deals_by_stage: { stage_name: string; count: number; value: number }[];
}

export interface PlanLimits {
  users: number;
  contacts: number;
  deals: number;
  ai: boolean;
  reports: boolean;
  api: boolean;
}
