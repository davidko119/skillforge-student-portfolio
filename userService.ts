import { supabase } from './supabaseClient';
import { User } from './types';

export async function getUserByEmail(email: string): Promise<any | null> {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .maybeSingle();

  if (error) {
    // If no rows found, return null; otherwise throw
    if ((error as any).code === 'PGRST116') {
      return null;
    }
    throw error;
  }

  return data ?? null;
}

export async function upsertUser(user: User): Promise<any> {
  const payload = {
    email: user.email,
    passwordHash: user.passwordHash ?? '',
    name: user.name,
  };

  const { data, error } = await supabase
    .from('users')
    .upsert(payload, { onConflict: 'email' })
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

