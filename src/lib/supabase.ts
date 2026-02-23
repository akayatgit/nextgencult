import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

// Handle SSL certificate issues in Node.js environment
// This is a workaround for corporate networks or local development environments
if (typeof window === 'undefined') {
  // Set Node.js to not reject unauthorized certificates (development only!)
  // WARNING: This is insecure and should NEVER be used in production
  // For production, configure proper SSL certificates or use a proxy
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database Types
export interface Category {
  id: number;
  name: string;
  created_at?: string;
}

export interface Roadmap {
  id: number;
  rank: number;
  title: string;
  skills: string;
  salary: string;
  category_id: number;
  description?: string;
  duration?: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
  // Joined data
  category?: Category;
  steps?: RoadmapStep[];
  prerequisites?: RoadmapPrerequisite[];
}

export interface RoadmapStep {
  id: number;
  roadmap_id: number;
  step_number: number;
  content: string;
  created_at?: string;
}

export interface RoadmapPrerequisite {
  id: number;
  roadmap_id: number;
  content: string;
  created_at?: string;
}
