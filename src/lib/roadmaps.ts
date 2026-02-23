import { supabase, Roadmap, RoadmapStep, RoadmapPrerequisite, Category } from './supabase';

export interface RoadmapWithDetails extends Roadmap {
  category: Category;
  steps: RoadmapStep[];
  prerequisites: RoadmapPrerequisite[];
}

/**
 * Fetch all active roadmaps with their category
 */
export async function getAllRoadmaps(): Promise<Roadmap[]> {
  const { data, error } = await supabase
    .from('roadmaps')
    .select(`
      *,
      category:categories(*)
    `)
    .eq('is_active', true)
    .order('rank', { ascending: true });

  if (error) {
    console.error('Error fetching roadmaps:', error);
    throw error;
  }

  return data || [];
}

/**
 * Fetch a single roadmap by ID with all related data
 */
export async function getRoadmapById(id: number): Promise<RoadmapWithDetails | null> {
  // Fetch roadmap with category
  const { data: roadmap, error: roadmapError } = await supabase
    .from('roadmaps')
    .select(`
      *,
      category:categories(*)
    `)
    .eq('id', id)
    .eq('is_active', true)
    .single();

  if (roadmapError) {
    console.error('Error fetching roadmap:', roadmapError);
    return null;
  }

  if (!roadmap) {
    return null;
  }

  // Fetch steps
  const { data: steps, error: stepsError } = await supabase
    .from('roadmap_steps')
    .select('*')
    .eq('roadmap_id', id)
    .order('step_number', { ascending: true });

  if (stepsError) {
    console.error('Error fetching roadmap steps:', stepsError);
  }

  // Fetch prerequisites
  const { data: prerequisites, error: prereqError } = await supabase
    .from('roadmap_prerequisites')
    .select('*')
    .eq('roadmap_id', id);

  if (prereqError) {
    console.error('Error fetching roadmap prerequisites:', prereqError);
  }

  return {
    ...roadmap,
    category: roadmap.category as Category,
    steps: steps || [],
    prerequisites: prerequisites || [],
  };
}

/**
 * Fetch roadmaps filtered by category
 */
export async function getRoadmapsByCategory(categoryId: number): Promise<Roadmap[]> {
  const { data, error } = await supabase
    .from('roadmaps')
    .select(`
      *,
      category:categories(*)
    `)
    .eq('category_id', categoryId)
    .eq('is_active', true)
    .order('rank', { ascending: true });

  if (error) {
    console.error('Error fetching roadmaps by category:', error);
    throw error;
  }

  return data || [];
}

/**
 * Search roadmaps by title or skills
 */
export async function searchRoadmaps(query: string): Promise<Roadmap[]> {
  const { data, error } = await supabase
    .from('roadmaps')
    .select(`
      *,
      category:categories(*)
    `)
    .eq('is_active', true)
    .or(`title.ilike.%${query}%,skills.ilike.%${query}%`)
    .order('rank', { ascending: true });

  if (error) {
    console.error('Error searching roadmaps:', error);
    throw error;
  }

  return data || [];
}

/**
 * Fetch all categories
 */
export async function getAllCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name', { ascending: true });

  if (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }

  return data || [];
}
