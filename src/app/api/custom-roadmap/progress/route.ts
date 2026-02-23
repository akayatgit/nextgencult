import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const { user_id, roadmap_id, day, task_type, completed } = await request.json();

    if (!user_id || !roadmap_id || !day || !task_type) {
      return NextResponse.json(
        { error: 'Missing required fields: user_id, roadmap_id, day, task_type' },
        { status: 400 }
      );
    }

    // Check if progress already exists
    const { data: existingProgress } = await supabase
      .from('custom_roadmap_progress')
      .select('id')
      .eq('user_id', user_id)
      .eq('roadmap_id', roadmap_id)
      .eq('day', day)
      .eq('task_type', task_type)
      .single();

    if (existingProgress) {
      // Update existing progress
      const { data, error } = await supabase
        .from('custom_roadmap_progress')
        .update({ completed: completed === true })
        .eq('id', existingProgress.id)
        .select()
        .single();

      if (error) {
        console.error('Error updating progress:', error);
        return NextResponse.json(
          { error: 'Failed to update progress: ' + error.message },
          { status: 500 }
        );
      }

      return NextResponse.json({ progress: data });
    } else {
      // Create new progress
      const { data, error } = await supabase
        .from('custom_roadmap_progress')
        .insert([
          {
            user_id: user_id,
            roadmap_id: roadmap_id,
            day: day,
            task_type: task_type,
            completed: completed === true,
          },
        ])
        .select()
        .single();

      if (error) {
        console.error('Error creating progress:', error);
        return NextResponse.json(
          { error: 'Failed to create progress: ' + error.message },
          { status: 500 }
        );
      }

      return NextResponse.json({ progress: data });
    }
  } catch (error) {
    console.error('Error in /api/custom-roadmap/progress:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const user_id = searchParams.get('user_id');
    const roadmap_id = searchParams.get('roadmap_id');

    if (!user_id || !roadmap_id) {
      return NextResponse.json(
        { error: 'Missing required parameters: user_id, roadmap_id' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('custom_roadmap_progress')
      .select('*')
      .eq('user_id', user_id)
      .eq('roadmap_id', roadmap_id);

    if (error) {
      console.error('Error fetching progress:', error);
      return NextResponse.json(
        { error: 'Failed to fetch progress: ' + error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ progress: data || [] });
  } catch (error) {
    console.error('Error in /api/custom-roadmap/progress GET:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
