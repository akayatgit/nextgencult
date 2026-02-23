import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const { rank, title, skills, salary, category_id, description, duration } = await request.json();

    // Validation
    if (!rank || !title || !skills || !salary || !category_id) {
      return NextResponse.json(
        { error: 'Missing required fields: rank, title, skills, salary, category_id' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('roadmaps')
      .insert([
        {
          rank: parseInt(rank),
          title: title.trim(),
          skills: skills.trim(),
          salary: salary.trim(),
          category_id: parseInt(category_id),
          description: description?.trim() || null,
          duration: duration?.trim() || null,
          is_active: true,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('Error creating roadmap:', error);
      return NextResponse.json(
        { error: 'Failed to create roadmap: ' + error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ roadmap: data });
  } catch (error) {
    console.error('Error in /api/admin/roadmaps:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
