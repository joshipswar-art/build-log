import { createClient } from '@supabase/supabase-js'

export type BuildLog = {
  id: string
  name: string
  description: string
  project_link: string | null
  created_at: string
}

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)
