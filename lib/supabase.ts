import { createClient } from '@supabase/supabase-js'

export type BuildLog = {
  id: string
  name: string
  description: string
  project_link: string | null
  created_at: string
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    "Missing Supabase env vars: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY must be set."
  )
}

export const supabase = createClient(supabaseUrl, supabaseKey)
