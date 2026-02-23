import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const { name, whatsapp, roadmap_id } = await request.json();

    if (!name || !whatsapp || !roadmap_id) {
      return NextResponse.json(
        { error: 'Missing required fields: name, whatsapp, roadmap_id' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const { data: existingUser, error: checkError } = await supabase
      .from('custom_roadmap_users')
      .select('id, session_id')
      .eq('whatsapp', whatsapp)
      .eq('roadmap_id', roadmap_id)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      console.error('Error checking user:', checkError);
    }

    if (existingUser) {
      // User exists, return existing session
      return NextResponse.json({ 
        user_id: existingUser.id,
        session_id: existingUser.session_id 
      });
    }

    // Create new user with session_id
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const { data, error } = await supabase
      .from('custom_roadmap_users')
      .insert([
        {
          name: name.trim(),
          whatsapp: whatsapp.trim(),
          roadmap_id: roadmap_id,
          session_id: sessionId,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('Error creating user:', error);
      return NextResponse.json(
        { error: 'Failed to create user: ' + error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      user_id: data.id,
      session_id: data.session_id 
    });
  } catch (error) {
    console.error('Error in /api/custom-roadmap/users:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
