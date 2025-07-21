
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'
import type { Session } from '@supabase/supabase-js'

export const useAuth = () => {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Supabaseクライアントが初期化されていない場合は、ローディングを終了し、セッションはnullとする
    if (!supabase) {
      console.warn("Supabase client is not initialized. Authentication features will be disabled.");
      setLoading(false);
      setSession(null);
      return;
    }

    const getSession = async () => {
      if (!supabase) {
        setLoading(false);
        setSession(null);
        return;
      }
      try {
        const { data: { session } } = await supabase.auth.getSession()
        setSession(session)
      } catch (error) {
        console.error("Error getting session:", error)
        setSession(null); // エラー時はセッションをnullに
      } finally {
        setLoading(false)
      }
    }

    getSession()

    // onAuthStateChange の購読もsupabaseがnullでないことを確認してから行う
    const { data: { subscription } } = supabase!.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => {
      if (subscription) {
        subscription.unsubscribe()
      }
    }
  }, [])

  return { session, loading }
}
