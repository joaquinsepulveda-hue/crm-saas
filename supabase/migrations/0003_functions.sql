-- Handle new user registration
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, full_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Handle deal status change timestamps
CREATE OR REPLACE FUNCTION handle_deal_status_change()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'won' AND OLD.status != 'won' THEN
    NEW.won_at = NOW(); NEW.lost_at = NULL;
  ELSIF NEW.status = 'lost' AND OLD.status != 'lost' THEN
    NEW.lost_at = NOW(); NEW.won_at = NULL;
  ELSIF NEW.status = 'open' THEN
    NEW.won_at = NULL; NEW.lost_at = NULL;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_deal_status_change
  BEFORE UPDATE OF status ON deals
  FOR EACH ROW EXECUTE FUNCTION handle_deal_status_change();

-- Seed default pipeline stages
CREATE OR REPLACE FUNCTION seed_default_pipeline(org_id UUID)
RETURNS VOID AS $$
BEGIN
  INSERT INTO pipeline_stages (organization_id, name, position, color, win_probability)
  VALUES
    (org_id, 'Lead', 0, '#6366f1', 10),
    (org_id, 'Qualified', 1, '#8b5cf6', 25),
    (org_id, 'Proposal', 2, '#f59e0b', 50),
    (org_id, 'Negotiation', 3, '#f97316', 75),
    (org_id, 'Closed Won', 4, '#10b981', 100),
    (org_id, 'Closed Lost', 5, '#ef4444', 0);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Dashboard KPIs
CREATE OR REPLACE FUNCTION get_dashboard_kpis(p_org_id UUID)
RETURNS JSONB AS $$
DECLARE
  result JSONB;
  total_contacts INTEGER;
  total_deals INTEGER;
  open_deals_value NUMERIC;
  won_deals_value NUMERIC;
  win_rate NUMERIC;
  activities_this_week INTEGER;
  new_contacts_this_month INTEGER;
  deals_by_stage JSONB;
BEGIN
  SELECT COUNT(*) INTO total_contacts FROM contacts WHERE organization_id = p_org_id;
  SELECT COUNT(*) INTO total_deals FROM deals WHERE organization_id = p_org_id AND status = 'open';
  SELECT COALESCE(SUM(value), 0) INTO open_deals_value FROM deals WHERE organization_id = p_org_id AND status = 'open';
  SELECT COALESCE(SUM(value), 0) INTO won_deals_value FROM deals WHERE organization_id = p_org_id AND status = 'won' AND won_at >= NOW() - INTERVAL '30 days';

  SELECT
    CASE WHEN (SELECT COUNT(*) FROM deals WHERE organization_id = p_org_id AND status IN ('won', 'lost')) > 0
    THEN ROUND(COUNT(*) FILTER (WHERE status = 'won') * 100.0 / COUNT(*) FILTER (WHERE status IN ('won', 'lost')))
    ELSE 0 END
  INTO win_rate
  FROM deals WHERE organization_id = p_org_id;

  SELECT COUNT(*) INTO activities_this_week FROM activities WHERE organization_id = p_org_id AND created_at >= NOW() - INTERVAL '7 days';
  SELECT COUNT(*) INTO new_contacts_this_month FROM contacts WHERE organization_id = p_org_id AND created_at >= NOW() - INTERVAL '30 days';

  SELECT jsonb_agg(jsonb_build_object('stage_name', ps.name, 'count', COUNT(d.id), 'value', COALESCE(SUM(d.value), 0)) ORDER BY ps.position)
  INTO deals_by_stage
  FROM pipeline_stages ps
  LEFT JOIN deals d ON d.stage_id = ps.id AND d.status = 'open'
  WHERE ps.organization_id = p_org_id
  GROUP BY ps.id, ps.name, ps.position;

  result := jsonb_build_object(
    'total_contacts', total_contacts, 'total_deals', total_deals,
    'open_deals_value', open_deals_value, 'won_deals_value', won_deals_value,
    'win_rate', win_rate, 'activities_this_week', activities_this_week,
    'new_contacts_this_month', new_contacts_this_month,
    'deals_by_stage', COALESCE(deals_by_stage, '[]'::jsonb)
  );
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
