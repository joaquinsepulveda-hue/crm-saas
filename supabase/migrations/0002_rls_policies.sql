-- Enable RLS
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE pipeline_stages ENABLE ROW LEVEL SECURITY;
ALTER TABLE deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;

-- Helper functions
CREATE OR REPLACE FUNCTION get_my_org_id()
RETURNS UUID AS $$
  SELECT organization_id FROM profiles WHERE id = auth.uid() LIMIT 1;
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION is_org_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('owner', 'admin'));
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- Organizations
CREATE POLICY "Members can view their org" ON organizations FOR SELECT USING (id = get_my_org_id());
CREATE POLICY "Admins can update their org" ON organizations FOR UPDATE USING (id = get_my_org_id() AND is_org_admin());

-- Profiles
CREATE POLICY "Users can view profiles in their org" ON profiles FOR SELECT USING (organization_id = get_my_org_id());
CREATE POLICY "Users can update their own profile" ON profiles FOR UPDATE USING (id = auth.uid());
CREATE POLICY "Admins can update org profiles" ON profiles FOR UPDATE USING (organization_id = get_my_org_id() AND is_org_admin());

-- Invitations
CREATE POLICY "Admins can manage invitations" ON invitations FOR ALL USING (organization_id = get_my_org_id() AND is_org_admin());
CREATE POLICY "Anyone can view invitation" ON invitations FOR SELECT USING (TRUE);

-- Companies
CREATE POLICY "Members can view companies" ON companies FOR SELECT USING (organization_id = get_my_org_id());
CREATE POLICY "Members can insert companies" ON companies FOR INSERT WITH CHECK (organization_id = get_my_org_id());
CREATE POLICY "Members can update companies" ON companies FOR UPDATE USING (organization_id = get_my_org_id());
CREATE POLICY "Admins can delete companies" ON companies FOR DELETE USING (organization_id = get_my_org_id() AND is_org_admin());

-- Contacts
CREATE POLICY "Members can view contacts" ON contacts FOR SELECT USING (organization_id = get_my_org_id());
CREATE POLICY "Members can insert contacts" ON contacts FOR INSERT WITH CHECK (organization_id = get_my_org_id());
CREATE POLICY "Members can update contacts" ON contacts FOR UPDATE USING (organization_id = get_my_org_id());
CREATE POLICY "Admins can delete contacts" ON contacts FOR DELETE USING (organization_id = get_my_org_id() AND is_org_admin());

-- Pipeline stages
CREATE POLICY "Members can view stages" ON pipeline_stages FOR SELECT USING (organization_id = get_my_org_id());
CREATE POLICY "Admins can manage stages" ON pipeline_stages FOR ALL USING (organization_id = get_my_org_id() AND is_org_admin());

-- Deals
CREATE POLICY "Members can view deals" ON deals FOR SELECT USING (organization_id = get_my_org_id());
CREATE POLICY "Members can insert deals" ON deals FOR INSERT WITH CHECK (organization_id = get_my_org_id());
CREATE POLICY "Members can update deals" ON deals FOR UPDATE USING (organization_id = get_my_org_id());
CREATE POLICY "Admins can delete deals" ON deals FOR DELETE USING (organization_id = get_my_org_id() AND is_org_admin());

-- Activities
CREATE POLICY "Members can view activities" ON activities FOR SELECT USING (organization_id = get_my_org_id());
CREATE POLICY "Members can insert activities" ON activities FOR INSERT WITH CHECK (organization_id = get_my_org_id());
CREATE POLICY "Members can update activities" ON activities FOR UPDATE USING (organization_id = get_my_org_id());
CREATE POLICY "Members can delete own activities" ON activities FOR DELETE USING (user_id = auth.uid());

-- Notifications
CREATE POLICY "Users can view own notifications" ON notifications FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can update own notifications" ON notifications FOR UPDATE USING (user_id = auth.uid());

-- API Keys
CREATE POLICY "Members can view org API keys" ON api_keys FOR SELECT USING (organization_id = get_my_org_id());
CREATE POLICY "Admins can manage API keys" ON api_keys FOR ALL USING (organization_id = get_my_org_id() AND is_org_admin());
