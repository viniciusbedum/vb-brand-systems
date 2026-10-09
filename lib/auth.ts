import { createClient } from './supabase-server'

export type Profile = {
  id: string
  role: 'admin' | 'staff'
  name: string | null
  avatar_url: string | null
  created_at: string
  updated_at: string
}

export async function getUser() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return user
}

export async function getProfile(userId: string): Promise<Profile | null> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()
  return data
}

export async function isAdmin(userId: string): Promise<boolean> {
  const profile = await getProfile(userId)
  return profile?.role === 'admin'
}
