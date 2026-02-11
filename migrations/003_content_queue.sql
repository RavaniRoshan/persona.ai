-- Migration 003: Content Queue with BullMQ Integration
-- Created: 2024-02-11
-- Description: Job queue integration for content generation and posting

-- Content queue table (mirrors BullMQ job data)
CREATE TABLE IF NOT EXISTS content_queue (
  id BIGSERIAL PRIMARY KEY,
  job_id UUID DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  persona_id BIGINT NOT NULL REFERENCES personas(id) ON DELETE CASCADE,
  content_type TEXT NOT NULL CHECK (content_type IN ('post', 'comment', 'reply')),
  platforms JSONB NOT NULL,
  draft TEXT NOT NULL,
  draft_metadata JSONB DEFAULT '{
    "word_count": 0,
    "character_count": 0,
    "sentiment": "neutral",
    "keywords": [],
    "readability_score": 0
  }',
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'review', 'approved', 'scheduled', 'posted', 'failed', 'rejected')),
  priority INT DEFAULT 5,
  scheduled_for TIMESTAMP,
  posted_at TIMESTAMP,
  platform_post_ids JSONB DEFAULT '{}',
  engagement JSONB DEFAULT '{
    "likes": 0,
    "replies": 0,
    "shares": 0,
    "impressions": 0
  }',
  retry_count INT DEFAULT 0,
  error_message TEXT,
  error_details JSONB,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Job execution logs (BullMQ tracking)
CREATE TABLE IF NOT EXISTS job_logs (
  id BIGSERIAL PRIMARY KEY,
  job_id UUID NOT NULL,
  job_name TEXT NOT NULL,
  user_id UUID REFERENCES users(id),
  status TEXT NOT NULL CHECK (status IN ('waiting', 'active', 'completed', 'failed', 'delayed', 'paused')),
  progress DECIMAL(5,2) DEFAULT 0,
  data JSONB,
  result JSONB,
  error_message TEXT,
  started_at TIMESTAMP,
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT now()
);

-- Content templates for faster generation
CREATE TABLE IF NOT EXISTS content_templates (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  content_type TEXT NOT NULL,
  template TEXT NOT NULL,
  variables JSONB DEFAULT '[]',
  is_active BOOLEAN DEFAULT TRUE,
  usage_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Indexes for performance
CREATE INDEX idx_content_queue_user_id ON content_queue(user_id);
CREATE INDEX idx_content_queue_user_status ON content_queue(user_id, status);
CREATE INDEX idx_content_queue_scheduled ON content_queue(scheduled_for) WHERE status = 'scheduled';
CREATE INDEX idx_content_queue_job_id ON content_queue(job_id);
CREATE INDEX idx_job_logs_job_id ON job_logs(job_id);
CREATE INDEX idx_job_logs_user_id ON job_logs(user_id);
CREATE INDEX idx_job_logs_status ON job_logs(status);

-- RLS Policies
ALTER TABLE content_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own content queue" ON content_queue
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own job logs" ON job_logs
  FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "System can manage job logs" ON job_logs
  FOR ALL USING (true);

CREATE POLICY "Users can manage own templates" ON content_templates
  FOR ALL USING (auth.uid() = user_id);

-- Function to update content status with audit
CREATE OR REPLACE FUNCTION update_content_status(
  p_content_id BIGINT,
  p_user_id UUID,
  p_new_status TEXT,
  p_error_message TEXT DEFAULT NULL
)
RETURNS void AS $$
DECLARE
  v_old_status TEXT;
BEGIN
  SELECT status INTO v_old_status FROM content_queue WHERE id = p_content_id;
  
  UPDATE content_queue 
  SET status = p_new_status, 
      updated_at = now(),
      error_message = COALESCE(p_error_message, error_message),
      retry_count = CASE WHEN p_new_status = 'failed' THEN retry_count + 1 ELSE retry_count END
  WHERE id = p_content_id AND user_id = p_user_id;
  
  PERFORM log_audit_event(
    p_user_id,
    'CONTENT_STATUS_CHANGE',
    'content_queue',
    p_content_id::TEXT,
    jsonb_build_object('status', v_old_status),
    jsonb_build_object('status', p_new_status, 'error', p_error_message),
    CASE WHEN p_new_status = 'failed' THEN 'warning' ELSE 'info' END
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to calculate engagement rate
CREATE OR REPLACE FUNCTION calculate_engagement_rate(p_content_id BIGINT)
RETURNS DECIMAL(5,4) AS $$
DECLARE
  v_engagement JSONB;
  v_rate DECIMAL(5,4);
BEGIN
  SELECT engagement INTO v_engagement FROM content_queue WHERE id = p_content_id;
  
  IF v_engagement->>'impressions' IS NOT NULL AND (v_engagement->>'impressions')::INT > 0 THEN
    v_rate := (
      COALESCE((v_engagement->>'likes')::INT, 0) +
      COALESCE((v_engagement->>'replies')::INT, 0) +
      COALESCE((v_engagement->>'shares')::INT, 0)
    )::DECIMAL / (v_engagement->>'impressions')::INT;
  ELSE
    v_rate := 0;
  END IF;
  
  RETURN v_rate;
END;
$$ LANGUAGE plpgsql;

-- Triggers
CREATE TRIGGER update_content_queue_timestamp BEFORE UPDATE ON content_queue
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_content_templates_timestamp BEFORE UPDATE ON content_templates
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
