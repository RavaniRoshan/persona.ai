-- Migration 002: Persona Storage
-- Created: 2024-02-11
-- Description: Secure persona management with versioning

CREATE TABLE IF NOT EXISTS personas (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  tone_rules JSONB NOT NULL DEFAULT '{
    "style": [],
    "topics": [],
    "avoid": [],
    "phrases": [],
    "examples": []
  }',
  extracted_from_posts INT DEFAULT 0,
  extraction_confidence DECIMAL(5,2) DEFAULT 0.0,
  is_active BOOLEAN DEFAULT TRUE,
  is_archived BOOLEAN DEFAULT FALSE,
  version INT DEFAULT 1,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now(),
  UNIQUE(user_id, name)
);

-- Persona history for versioning
CREATE TABLE IF NOT EXISTS persona_history (
  id BIGSERIAL PRIMARY KEY,
  persona_id BIGINT NOT NULL REFERENCES personas(id) ON DELETE CASCADE,
  version INT NOT NULL,
  tone_rules JSONB NOT NULL,
  changed_by UUID REFERENCES users(id),
  change_reason TEXT,
  created_at TIMESTAMP DEFAULT now()
);

-- Persona usage tracking
CREATE TABLE IF NOT EXISTS persona_usage (
  id BIGSERIAL PRIMARY KEY,
  persona_id BIGINT NOT NULL REFERENCES personas(id) ON DELETE CASCADE,
  content_generated INT DEFAULT 0,
  last_used_at TIMESTAMP,
  engagement_score DECIMAL(5,2) DEFAULT 0.0,
  created_at TIMESTAMP DEFAULT now()
);

-- Indexes for performance
CREATE INDEX idx_personas_user_id ON personas(user_id);
CREATE INDEX idx_personas_user_id_active ON personas(user_id, is_active) WHERE is_active = TRUE;
CREATE INDEX idx_persona_history_persona_id ON persona_history(persona_id);
CREATE INDEX idx_persona_usage_persona_id ON persona_usage(persona_id);

-- RLS Policies
ALTER TABLE personas ENABLE ROW LEVEL SECURITY;
ALTER TABLE persona_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE persona_usage ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own personas" ON personas
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own persona history" ON persona_history
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM personas WHERE personas.id = persona_history.persona_id AND personas.user_id = auth.uid()
    )
  );

CREATE POLICY "System can create persona history" ON persona_history
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM personas WHERE personas.id = persona_history.persona_id
    )
  );

CREATE POLICY "Users can view own persona usage" ON persona_usage
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM personas WHERE personas.id = persona_usage.persona_id AND personas.user_id = auth.uid()
    )
  );

-- Function to archive persona with audit log
CREATE OR REPLACE FUNCTION archive_persona(p_persona_id BIGINT, p_user_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE personas 
  SET is_archived = TRUE, is_active = FALSE, updated_at = now()
  WHERE id = p_persona_id AND user_id = p_user_id;
  
  PERFORM log_audit_event(
    p_user_id,
    'PERSONA_ARCHIVED',
    'persona',
    p_persona_id::TEXT,
    jsonb_build_object('is_active', true, 'is_archived', false),
    jsonb_build_object('is_active', false, 'is_archived', true),
    'info'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to track persona updates
CREATE OR REPLACE FUNCTION track_persona_changes()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.tone_rules IS DISTINCT FROM NEW.tone_rules THEN
    INSERT INTO persona_history (persona_id, version, tone_rules, changed_by)
    VALUES (OLD.id, OLD.version, OLD.tone_rules, NEW.user_id);
    
    NEW.version = OLD.version + 1;
    
    PERFORM log_audit_event(
      NEW.user_id,
      'PERSONA_UPDATED',
      'persona',
      NEW.id::TEXT,
      jsonb_build_object('tone_rules', OLD.tone_rules, 'version', OLD.version),
      jsonb_build_object('tone_rules', NEW.tone_rules, 'version', NEW.version),
      'info'
    );
  END IF;
  
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER track_persona_updates BEFORE UPDATE ON personas
  FOR EACH ROW EXECUTE FUNCTION track_persona_changes();

CREATE TRIGGER update_personas_timestamp BEFORE UPDATE ON personas
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
