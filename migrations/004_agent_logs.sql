-- Migration 004: Agent Logs and Metrics
-- Created: 2024-02-11
-- Description: Comprehensive logging for agent operations

-- Agent logs for debugging and monitoring
CREATE TABLE IF NOT EXISTS agent_logs (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  job_id UUID,
  details JSONB,
  success BOOLEAN DEFAULT TRUE,
  error_message TEXT,
  execution_time_ms INT,
  metadata JSONB DEFAULT '{
    "ip_address": null,
    "user_agent": null,
    "request_id": null
  }',
  created_at TIMESTAMP DEFAULT now()
);

-- User metrics and usage tracking
CREATE TABLE IF NOT EXISTS user_metrics (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  metric_date DATE NOT NULL,
  content_generated INT DEFAULT 0,
  content_posted INT DEFAULT 0,
  tokens_used INT DEFAULT 0,
  estimated_cost DECIMAL(10,4) DEFAULT 0.0,
  api_calls INT DEFAULT 0,
  failed_requests INT DEFAULT 0,
  avg_response_time_ms INT DEFAULT 0,
  engagement_total INT DEFAULT 0,
  UNIQUE(user_id, metric_date)
);

-- LLM usage tracking per provider
CREATE TABLE IF NOT EXISTS llm_usage (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  provider TEXT NOT NULL,
  model TEXT NOT NULL,
  tokens_input INT DEFAULT 0,
  tokens_output INT DEFAULT 0,
  cost_usd DECIMAL(10,6) DEFAULT 0.0,
  request_count INT DEFAULT 1,
  usage_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP DEFAULT now(),
  UNIQUE(user_id, provider, model, usage_date)
);

-- System health monitoring
CREATE TABLE IF NOT EXISTS system_health (
  id BIGSERIAL PRIMARY KEY,
  check_name TEXT NOT NULL,
  check_type TEXT NOT NULL CHECK (check_type IN ('database', 'redis', 'llm_api', 'platform_api', 'queue')),
  status TEXT NOT NULL CHECK (status IN ('healthy', 'degraded', 'down')),
  response_time_ms INT,
  details JSONB,
  checked_at TIMESTAMP DEFAULT now()
);

-- Indexes
CREATE INDEX idx_agent_logs_user_id ON agent_logs(user_id);
CREATE INDEX idx_agent_logs_action ON agent_logs(action);
CREATE INDEX idx_agent_logs_created_at ON agent_logs(created_at);
CREATE INDEX idx_agent_logs_job_id ON agent_logs(job_id);
CREATE INDEX idx_user_metrics_user_id ON user_metrics(user_id);
CREATE INDEX idx_user_metrics_date ON user_metrics(metric_date);
CREATE INDEX idx_llm_usage_user_id ON llm_usage(user_id);
CREATE INDEX idx_llm_usage_date ON llm_usage(usage_date);
CREATE INDEX idx_system_health_type ON system_health(check_type);
CREATE INDEX idx_system_health_status ON system_health(status);

-- RLS Policies
ALTER TABLE agent_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE llm_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_health ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own agent logs" ON agent_logs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can create agent logs" ON agent_logs
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view own metrics" ON user_metrics
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can manage metrics" ON user_metrics
  FOR ALL USING (true);

CREATE POLICY "Users can view own LLM usage" ON llm_usage
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can manage LLM usage" ON llm_usage
  FOR ALL USING (true);

CREATE POLICY "System can manage health checks" ON system_health
  FOR ALL USING (true);

CREATE POLICY "Users can view system health" ON system_health
  FOR SELECT USING (true);

-- Function to aggregate daily metrics
CREATE OR REPLACE FUNCTION aggregate_daily_metrics(p_user_id UUID, p_date DATE)
RETURNS void AS $$
BEGIN
  INSERT INTO user_metrics (
    user_id, 
    metric_date,
    content_generated,
    content_posted,
    tokens_used,
    estimated_cost,
    api_calls,
    failed_requests
  )
  SELECT 
    p_user_id,
    p_date,
    COUNT(*) FILTER (WHERE status IN ('approved', 'posted'))::INT,
    COUNT(*) FILTER (WHERE status = 'posted')::INT,
    COALESCE((SELECT SUM(tokens_input + tokens_output) FROM llm_usage WHERE user_id = p_user_id AND usage_date = p_date), 0)::INT,
    COALESCE((SELECT SUM(cost_usd) FROM llm_usage WHERE user_id = p_user_id AND usage_date = p_date), 0.0),
    COALESCE((SELECT SUM(request_count) FROM llm_usage WHERE user_id = p_user_id AND usage_date = p_date), 0)::INT,
    COUNT(*) FILTER (WHERE status = 'failed')::INT
  FROM content_queue
  WHERE user_id = p_user_id AND DATE(created_at) = p_date
  ON CONFLICT (user_id, metric_date) 
  DO UPDATE SET
    content_generated = EXCLUDED.content_generated,
    content_posted = EXCLUDED.content_posted,
    tokens_used = EXCLUDED.tokens_used,
    estimated_cost = EXCLUDED.estimated_cost,
    api_calls = EXCLUDED.api_calls,
    failed_requests = EXCLUDED.failed_requests;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
