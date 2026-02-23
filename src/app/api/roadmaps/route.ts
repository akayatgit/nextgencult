import { NextResponse } from 'next/server';
import { getAllRoadmaps, getAllCategories } from '@/lib/roadmaps';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');

    let roadmaps;
    
    if (search) {
      const { searchRoadmaps } = await import('@/lib/roadmaps');
      roadmaps = await searchRoadmaps(search);
    } else if (category && category !== 'All') {
      const { getRoadmapsByCategory } = await import('@/lib/roadmaps');
      const categories = await getAllCategories();
      const categoryObj = categories.find(c => c.name === category);
      if (categoryObj) {
        roadmaps = await getRoadmapsByCategory(categoryObj.id);
      } else {
        roadmaps = await getAllRoadmaps();
      }
    } else {
      roadmaps = await getAllRoadmaps();
    }

    const categories = await getAllCategories();

    return NextResponse.json({
      roadmaps,
      categories,
    });
  } catch (error) {
    console.error('Error in /api/roadmaps:', error);
    return NextResponse.json(
      { error: 'Failed to fetch roadmaps' },
      { status: 500 }
    );
  }
}
