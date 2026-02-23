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
      .from('roadmap_steps')
      .delete()
      .eq('roadmap_id', roadmapId);

    if (error) {
      console.error('Error deleting steps:', error);
      return NextResponse.json(
        { error: 'Failed to delete steps: ' + error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in /api/admin/roadmaps/[id]/steps DELETE:', error);
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
    const { steps } = await request.json();

    if (isNaN(roadmapId)) {
      return NextResponse.json(
        { error: 'Invalid roadmap ID' },
        { status: 400 }
      );
    }

    if (!steps || !Array.isArray(steps) || steps.length === 0) {
      return NextResponse.json(
        { error: 'Steps array is required and must not be empty' },
        { status: 400 }
      );
    }

    // Validate steps structure
    for (const step of steps) {
      if (!step.step_number || !step.content) {
        return NextResponse.json(
          { error: 'Each step must have step_number and content' },
          { status: 400 }
        );
      }
    }

    // Insert steps
    const stepsToInsert = steps.map((step: any) => ({
      roadmap_id: roadmapId,
      step_number: step.step_number,
      content: step.content.trim(),
    }));

    const { data, error } = await supabase
      .from('roadmap_steps')
      .insert(stepsToInsert)
      .select();

    if (error) {
      console.error('Error creating steps:', error);
      return NextResponse.json(
        { error: 'Failed to create steps: ' + error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ steps: data });
  } catch (error) {
    console.error('Error in /api/admin/roadmaps/[id]/steps:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
