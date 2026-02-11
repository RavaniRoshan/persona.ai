-- Migration 001: Users + Auth + Audit Logging
-- Created: 2024-02-11
-- Description: Core user management with security audit trails

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  username TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  email_verified BOOLEAN DEFAULT FALSE,
  last_login_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Audit logs for security tracking
CREATE TABLE IF NOT EXISTS audit_logs (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id TEXT,
  old_values JSONB,
  new_values JSONB,
  ip_address INET,
  user_agent TEXT,
  request_id UUID DEFAULT uuid_generate_v4(),
  severity TEXT DEFAULT 'info',
  created_at TIMESTAMP DEFAULT now()
);

-- API Key management (encrypted on client, stored as identifier only)
CREATE TABLE IF NOT EXISTS api_keys (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  provider TEXT NOT NULL,
  encrypted_key TEXT NOT NULL,
  key_identifier TEXT NOT NULL, -- Last 4 chars for UI display
  is_active BOOLEAN DEFAULT TRUE,
  last_used_at TIMESTAMP,
  expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now(),
  UNIQUE(user_id, provider)
);

-- User settings with enhanced security
CREATE TABLE IF NOT EXISTS user_settings (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  llm_provider TEXT DEFAULT 'openai',
  llm_model TEXT DEFAULT 'gpt-4-turbo',
  platforms JSONB DEFAULT '[]',
  notification_preferences JSONB DEFAULT '{"email": true, "slack": false}',
  rate_limit_tier TEXT DEFAULT 'standard',
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Indexes for performance
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);
CREATE INDEX idx_audit_logs_request_id ON audit_logs(request_id);
CREATE INDEX idx_api_keys_user_id ON api_keys(user_id);

-- Row Level Security (RLS) Policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

-- Users can only read/update their own data
CREATE POLICY "Users can view own data" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own data" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Audit logs are append-only by users, readable by admins
CREATE POLICY "Users can view own audit logs" ON audit_logs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can create audit logs" ON audit_logs
  FOR INSERT WITH CHECK (true);

-- API keys managed by users
CREATE POLICY "Users can manage own API keys" ON api_keys
  FOR ALL USING (auth.uid() = user_id);

-- Settings managed by users
CREATE POLICY "Users can manage own settings" ON user_settings
  FOR ALL USING (auth.uid() = user_id);

-- Functions for audit logging
CREATE OR REPLACE FUNCTION log_audit_event(
  p_user_id UUID,
  p_action TEXT,
  p_resource_type TEXT,
  p_resource_id TEXT DEFAULT NULL,
  p_old_values JSONB DEFAULT NULL,
  p_new_values JSONB DEFAULT NULL,
  p_severity TEXT DEFAULT 'info'
)
RETURNS void AS $$
BEGIN
  INSERT INTO audit_logs (user_id, action, resource_type, resource_id, old_values, new_values, severity)
  VALUES (p_user_id, p_action, p_resource_type, p_resource_id, p_old_values, p_new_values, p_severity);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_settings_updated_at BEFORE UPDATE ON user_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_api_keys_updated_at BEFORE UPDATE ON api_keys
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
