-- Create custom_roadmap_users table
CREATE TABLE IF NOT EXISTS custom_roadmap_users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  whatsapp VARCHAR(20) NOT NULL,
  roadmap_id VARCHAR(100) NOT NULL,
  session_id VARCHAR(100) NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(whatsapp, roadmap_id)
);

-- Create custom_roadmap_progress table
CREATE TABLE IF NOT EXISTS custom_roadmap_progress (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES custom_roadmap_users(id) ON DELETE CASCADE,
  roadmap_id VARCHAR(100) NOT NULL,
  day INTEGER NOT NULL,
  task_type VARCHAR(20) NOT NULL, -- 'new', 'review1', 'review2'
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, roadmap_id, day, task_type)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_custom_roadmap_users_whatsapp ON custom_roadmap_users(whatsapp);
CREATE INDEX IF NOT EXISTS idx_custom_roadmap_users_roadmap_id ON custom_roadmap_users(roadmap_id);
CREATE INDEX IF NOT EXISTS idx_custom_roadmap_users_session_id ON custom_roadmap_users(session_id);
CREATE INDEX IF NOT EXISTS idx_custom_roadmap_progress_user_id ON custom_roadmap_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_custom_roadmap_progress_roadmap_id ON custom_roadmap_progress(roadmap_id);
CREATE INDEX IF NOT EXISTS idx_custom_roadmap_progress_user_roadmap ON custom_roadmap_progress(user_id, roadmap_id);

-- Create trigger to auto-update updated_at for custom_roadmap_users
CREATE TRIGGER update_custom_roadmap_users_updated_at BEFORE UPDATE ON custom_roadmap_users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create trigger to auto-update updated_at for custom_roadmap_progress
CREATE TRIGGER update_custom_roadmap_progress_updated_at BEFORE UPDATE ON custom_roadmap_progress
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Templates for custom roadmaps (builder output)
CREATE TABLE IF NOT EXISTS custom_roadmap_templates (
  id VARCHAR(100) PRIMARY KEY, -- shareable roadmap_id
  title VARCHAR(200) NOT NULL,
  ui_mode_default VARCHAR(10) DEFAULT 'dark',
  data JSONB NOT NULL, -- stores days, metadata, etc.
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_custom_roadmap_templates_created_at
  ON custom_roadmap_templates(created_at);