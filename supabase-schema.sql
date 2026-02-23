-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create roadmaps table
CREATE TABLE IF NOT EXISTS roadmaps (
  id SERIAL PRIMARY KEY,
  rank INTEGER NOT NULL,
  title VARCHAR(200) NOT NULL,
  skills TEXT NOT NULL,
  salary VARCHAR(50) NOT NULL,
  category_id INTEGER NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
  description TEXT,
  duration VARCHAR(50),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create roadmap_steps table (normalized steps)
CREATE TABLE IF NOT EXISTS roadmap_steps (
  id SERIAL PRIMARY KEY,
  roadmap_id INTEGER NOT NULL REFERENCES roadmaps(id) ON DELETE CASCADE,
  step_number INTEGER NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(roadmap_id, step_number)
);

-- Create roadmap_prerequisites table (normalized prerequisites)
CREATE TABLE IF NOT EXISTS roadmap_prerequisites (
  id SERIAL PRIMARY KEY,
  roadmap_id INTEGER NOT NULL REFERENCES roadmaps(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_roadmaps_category_id ON roadmaps(category_id);
CREATE INDEX IF NOT EXISTS idx_roadmaps_is_active ON roadmaps(is_active);
CREATE INDEX IF NOT EXISTS idx_roadmaps_rank ON roadmaps(rank);
CREATE INDEX IF NOT EXISTS idx_roadmap_steps_roadmap_id ON roadmap_steps(roadmap_id);
CREATE INDEX IF NOT EXISTS idx_roadmap_prerequisites_roadmap_id ON roadmap_prerequisites(roadmap_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to auto-update updated_at
CREATE TRIGGER update_roadmaps_updated_at BEFORE UPDATE ON roadmaps
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert categories
INSERT INTO categories (name) VALUES
  ('Data'),
  ('AI'),
  ('Development'),
  ('Cloud'),
  ('Cybersecurity'),
  ('UI/UX'),
  ('Testing'),
  ('Design'),
  ('Marketing'),
  ('Finance'),
  ('Networking'),
  ('IoT'),
  ('Hardware'),
  ('Automation'),
  ('Management')
ON CONFLICT (name) DO NOTHING;

-- Insert sample roadmaps (you can add more via Supabase dashboard or API)
-- Note: Adjust category_id based on the actual IDs from categories table
INSERT INTO roadmaps (rank, title, skills, salary, category_id, description, duration) VALUES
  (1, 'Data Analyst', 'SQL, Excel, Power BI', '4.5', (SELECT id FROM categories WHERE name = 'Data'), 'A Data Analyst collects, processes, and performs statistical analyses on large datasets to help organizations make data-driven decisions.', '3-6 months'),
  (2, 'AI/ML Engineer', 'Python, TensorFlow basics', '7', (SELECT id FROM categories WHERE name = 'AI'), 'AI/ML Engineers build and deploy machine learning models to solve real-world problems using AI technologies.', '6-12 months'),
  (3, 'Cybersecurity Specialist', 'Firewalls, ethical hacking', '6', (SELECT id FROM categories WHERE name = 'Cybersecurity'), 'Cybersecurity Specialists protect organizations from cyber threats by implementing security measures and monitoring systems.', '6-9 months'),
  (4, 'DevOps Engineer', 'Docker, Jenkins intro', '5.5', (SELECT id FROM categories WHERE name = 'Cloud'), 'DevOps Engineers bridge development and operations, automating deployment pipelines and managing infrastructure.', '4-8 months'),
  (5, 'Full Stack Developer', 'MERN stack', '6.5', (SELECT id FROM categories WHERE name = 'Development'), 'Full Stack Developers work on both frontend and backend, building complete web applications.', '6-10 months')
ON CONFLICT DO NOTHING;

-- Insert roadmap steps for roadmap ID 1 (Data Analyst)
INSERT INTO roadmap_steps (roadmap_id, step_number, content) VALUES
  ((SELECT id FROM roadmaps WHERE title = 'Data Analyst' LIMIT 1), 1, 'Learn SQL fundamentals (SELECT, JOIN, WHERE, GROUP BY)'),
  ((SELECT id FROM roadmaps WHERE title = 'Data Analyst' LIMIT 1), 2, 'Master Excel (Pivot tables, VLOOKUP, formulas)'),
  ((SELECT id FROM roadmaps WHERE title = 'Data Analyst' LIMIT 1), 3, 'Learn Power BI or Tableau for visualization'),
  ((SELECT id FROM roadmaps WHERE title = 'Data Analyst' LIMIT 1), 4, 'Practice with real datasets'),
  ((SELECT id FROM roadmaps WHERE title = 'Data Analyst' LIMIT 1), 5, 'Build a portfolio with 3-5 projects'),
  ((SELECT id FROM roadmaps WHERE title = 'Data Analyst' LIMIT 1), 6, 'Apply for entry-level positions')
ON CONFLICT DO NOTHING;

-- Insert prerequisites for roadmap ID 1
INSERT INTO roadmap_prerequisites (roadmap_id, content) VALUES
  ((SELECT id FROM roadmaps WHERE title = 'Data Analyst' LIMIT 1), 'Basic math skills'),
  ((SELECT id FROM roadmaps WHERE title = 'Data Analyst' LIMIT 1), 'Logical thinking'),
  ((SELECT id FROM roadmaps WHERE title = 'Data Analyst' LIMIT 1), 'Attention to detail')
ON CONFLICT DO NOTHING;
