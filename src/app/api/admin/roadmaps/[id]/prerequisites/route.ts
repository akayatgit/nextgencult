import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const roadmapId = parseInt(id);

    if (isNaN(roadmapId)) {
      return NextResponse.json(
        { error: 'Invalid roadmap ID' },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from('roadmap_prerequisites')
      .delete()
      .eq('roadmap_id', roadmapId);

    if (error) {
      console.error('Error deleting prerequisites:', error);
      return NextResponse.json(
        { error: 'Failed to delete prerequisites: ' + error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in /api/admin/roadmaps/[id]/prerequisites DELETE:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const roadmapId = parseInt(id);
    const { prerequisites } = await request.json();

    if (isNaN(roadmapId)) {
      return NextResponse.json(
        { error: 'Invalid roadmap ID' },
        { status: 400 }
      );
    }

    if (!prerequisites || !Array.isArray(prerequisites) || prerequisites.length === 0) {
      return NextResponse.json(
        { error: 'Prerequisites array is required and must not be empty' },
        { status: 400 }
      );
    }

    // Insert prerequisites
    const prerequisitesToInsert = prerequisites.map((prereq: string) => ({
      roadmap_id: roadmapId,
      content: prereq.trim(),
    }));

    const { data, error } = await supabase
      .from('roadmap_prerequisites')
      .insert(prerequisitesToInsert)
      .select();

    if (error) {
      console.error('Error creating prerequisites:', error);
      return NextResponse.json(
        { error: 'Failed to create prerequisites: ' + error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ prerequisites: data });
  } catch (error) {
    console.error('Error in /api/admin/roadmaps/[id]/prerequisites:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
