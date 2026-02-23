# Supabase Setup Instructions

## 1. Environment Variables

Create a `.env.local` file in the root directory with:

```
NEXT_PUBLIC_SUPABASE_URL=https://hclyzyjbvupznzuxlwck.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=sb_publishable_pBahVeeA09jttE5qYH0o7w_Knrl_Kd4N
```

## 2. Database Setup

1. Go to your Supabase dashboard: https://supabase.com/dashboard
2. Select your project
3. Go to SQL Editor
4. Copy and paste the contents of `supabase-schema.sql`
5. Run the SQL script

This will create:
- `categories` table
- `roadmaps` table
- `roadmap_steps` table (normalized steps)
- `roadmap_prerequisites` table (normalized prerequisites)
- Indexes for performance
- Sample data for top 5 roadmaps

## 3. Adding More Roadmaps

You can add roadmaps via:
- Supabase Dashboard (Table Editor)
- API routes (to be implemented)
- Direct SQL inserts

### Example SQL Insert:

```sql
-- Insert a new roadmap
INSERT INTO roadmaps (rank, title, skills, salary, category_id, description, duration)
VALUES (6, 'Cloud Support Engineer', 'AWS basics, EC2', '5-7', 
  (SELECT id FROM categories WHERE name = 'Cloud'),
  'Cloud Support Engineers help organizations manage their cloud infrastructure.',
  '4-6 months');

-- Get the roadmap ID (let's say it's 6)
-- Insert steps
INSERT INTO roadmap_steps (roadmap_id, step_number, content) VALUES
  (6, 1, 'Learn AWS fundamentals'),
  (6, 2, 'Study EC2, S3, and other core services'),
  (6, 3, 'Get AWS Cloud Practitioner certification'),
  (6, 4, 'Practice with hands-on projects'),
  (6, 5, 'Apply for cloud support positions');

-- Insert prerequisites
INSERT INTO roadmap_prerequisites (roadmap_id, content) VALUES
  (6, 'Basic networking knowledge'),
  (6, 'Understanding of Linux'),
  (6, 'Problem-solving skills');
```

## 4. Database Schema

### Tables:

1. **categories** - Stores roadmap categories
   - id (PK)
   - name (unique)
   - created_at

2. **roadmaps** - Main roadmap data
   - id (PK)
   - rank
   - title
   - skills
   - salary
   - category_id (FK → categories)
   - description
   - duration
   - is_active (for soft deletes)
   - created_at, updated_at

3. **roadmap_steps** - Normalized steps (one per row)
   - id (PK)
   - roadmap_id (FK → roadmaps)
   - step_number
   - content
   - created_at

4. **roadmap_prerequisites** - Normalized prerequisites (one per row)
   - id (PK)
   - roadmap_id (FK → roadmaps)
   - content
   - created_at

## 5. Features

- ✅ Dynamic roadmap fetching from Supabase
- ✅ Filter by category
- ✅ Search functionality
- ✅ Salary range filtering
- ✅ Normalized database structure
- ✅ API routes for data access
- ✅ Homepage shows top 5 roadmaps
- ✅ Individual roadmap detail pages

## 6. Next Steps

To add all 50 roadmaps from your original list:
1. Use the Supabase dashboard to bulk insert
2. Or create a migration script
3. Or use the API to programmatically add roadmaps
