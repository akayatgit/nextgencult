import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const roadmapId = parseInt(id);
    const { rank, title, skills, salary, category_id, description, duration } = await request.json();

    if (isNaN(roadmapId)) {
      return NextResponse.json(
        { error: 'Invalid roadmap ID' },
        { status: 400 }
      );
    }

    // Validation
    if (!rank || !title || !skills || !salary || !category_id) {
      return NextResponse.json(
        { error: 'Missing required fields: rank, title, skills, salary, category_id' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('roadmaps')
      .update({
        rank: parseInt(rank),
        title: title.trim(),
        skills: skills.trim(),
        salary: salary.trim(),
        category_id: parseInt(category_id),
        description: description?.trim() || null,
        duration: duration?.trim() || null,
      })
      .eq('id', roadmapId)
      .select()
      .single();

    if (error) {
      console.error('Error updating roadmap:', error);
      return NextResponse.json(
        { error: 'Failed to update roadmap: ' + error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ roadmap: data });
  } catch (error) {
    console.error('Error in /api/admin/roadmaps/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
