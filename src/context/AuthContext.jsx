import { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react'
import { supabase, supabaseConfigured } from '../lib/supabase'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [profile, setProfile] = useState(null)
  const [business, setBusiness] = useState(null)
  const [loading, setLoading] = useState(true)

  const loadProfileAndBusiness = useCallback(async (userId) => {
    if (!supabaseConfigured || !userId) {
      setProfile(null)
      setBusiness(null)
      return
    }
    const { data: profileData } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle()
    setProfile(profileData ?? null)

    const { data: businessData } = await supabase
      .from('businesses')
      .select('*')
      .eq('owner_id', userId)
      .maybeSingle()
    setBusiness(businessData ?? null)
  }, [])

  useEffect(() => {
    if (!supabaseConfigured) {
      setLoading(false)
      return
    }

    let active = true

    supabase.auth.getSession().then(async ({ data }) => {
      if (!active) return
      setSession(data.session ?? null)
      if (data.session?.user?.id) {
        await loadProfileAndBusiness(data.session.user.id)
      }
      setLoading(false)
    })

    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
      setSession(newSession)
      if (newSession?.user?.id) {
        await loadProfileAndBusiness(newSession.user.id)
      } else {
        setProfile(null)
        setBusiness(null)
      }
    })

    return () => {
      active = false
      listener?.subscription?.unsubscribe()
    }
  }, [loadProfileAndBusiness])

  const signUp = useCallback(async ({ fullName, email, mobile, password }) => {
    if (!supabaseConfigured) throw new Error('Supabase is not configured yet.')
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName, mobile },
      },
    })
    if (error) throw error

    // profiles row + 7-day trial subscription are created server-side by a
    // Postgres trigger on auth.users insert (see supabase/schema.sql:
    // handle_new_user()). We don't create it from the client so the trial
    // dates can't be tampered with from the browser.
    return data
  }, [])

  const signIn = useCallback(async ({ email, password }) => {
    if (!supabaseConfigured) throw new Error('Supabase is not configured yet.')
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    return data
  }, [])

  const signOut = useCallback(async () => {
    if (!supabaseConfigured) return
    await supabase.auth.signOut()
  }, [])

  const sendPasswordReset = useCallback(async (email) => {
    if (!supabaseConfigured) throw new Error('Supabase is not configured yet.')
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })
    if (error) throw error
  }, [])

  const updatePassword = useCallback(async (newPassword) => {
    if (!supabaseConfigured) throw new Error('Supabase is not configured yet.')
    const { error } = await supabase.auth.updateUser({ password: newPassword })
    if (error) throw error
  }, [])

  const refreshBusiness = useCallback(async () => {
    if (session?.user?.id) await loadProfileAndBusiness(session.user.id)
  }, [session, loadProfileAndBusiness])

  const value = useMemo(
    () => ({
      session,
      user: session?.user ?? null,
      profile,
      business,
      loading,
      signUp,
      signIn,
      signOut,
      sendPasswordReset,
      updatePassword,
      refreshBusiness,
    }),
    [session, profile, business, loading, signUp, signIn, signOut, sendPasswordReset, updatePassword, refreshBusiness]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
