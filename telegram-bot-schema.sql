-- Telegram Bot Users Table
CREATE TABLE IF NOT EXISTS telegram_bot_users (
  id SERIAL PRIMARY KEY,
  chat_id BIGINT NOT NULL UNIQUE,
  username VARCHAR(100),
  first_name VARCHAR(200),
  last_name VARCHAR(200),
  roadmap_id VARCHAR(100) NOT NULL, -- Can be custom_roadmap_templates.id or roadmaps.id
  roadmap_type VARCHAR(20) NOT NULL DEFAULT 'custom', -- 'custom' or 'standard'
  start_date DATE NOT NULL DEFAULT CURRENT_DATE,
  current_day INTEGER NOT NULL DEFAULT 1,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Telegram Bot Progress Table (for tracking daily completion)
CREATE TABLE IF NOT EXISTS telegram_bot_progress (
  id SERIAL PRIMARY KEY,
  chat_id BIGINT NOT NULL REFERENCES telegram_bot_users(chat_id) ON DELETE CASCADE,
  roadmap_id VARCHAR(100) NOT NULL,
  day INTEGER NOT NULL,
  task_type VARCHAR(20) NOT NULL, -- 'new', 'review1', 'review2', or 'day_complete'
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(chat_id, roadmap_id, day, task_type)
);

-- Indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_telegram_bot_users_chat_id ON telegram_bot_users(chat_id);
CREATE INDEX IF NOT EXISTS idx_telegram_bot_users_roadmap_id ON telegram_bot_users(roadmap_id);
CREATE INDEX IF NOT EXISTS idx_telegram_bot_users_is_active ON telegram_bot_users(is_active);
CREATE INDEX IF NOT EXISTS idx_telegram_bot_progress_chat_id ON telegram_bot_progress(chat_id);
CREATE INDEX IF NOT EXISTS idx_telegram_bot_progress_roadmap_day ON telegram_bot_progress(roadmap_id, day);

-- Create trigger to auto-update updated_at for telegram_bot_users
CREATE TRIGGER update_telegram_bot_users_updated_at BEFORE UPDATE ON telegram_bot_users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create trigger to auto-update updated_at for telegram_bot_progress
CREATE TRIGGER update_telegram_bot_progress_updated_at BEFORE UPDATE ON telegram_bot_progress
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Additional columns for welcome follow-ups
ALTER TABLE telegram_bot_users
  ADD COLUMN IF NOT EXISTS enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ADD COLUMN IF NOT EXISTS welcome_followup_sent BOOLEAN DEFAULT FALSE;
