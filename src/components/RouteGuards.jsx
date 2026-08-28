import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { supabaseConfigured } from '../lib/supabase'

function FullPageLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-paper">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-line border-t-brand" />
    </div>
  )
}

// Requires a logged-in user. Sends anonymous visitors to /login.
export function RequireAuth() {
  const { session, loading } = useAuth()
  if (!supabaseConfigured) return <Outlet />
  if (loading) return <FullPageLoader />
  if (!session) return <Navigate to="/login" replace />
  return <Outlet />
}

// Requires a logged-in user who has NOT finished onboarding yet.
// Used to guard /onboarding so a fully set-up user is bounced to the dashboard.
export function RequireOnboarding() {
  const { session, loading, business } = useAuth()
  if (!supabaseConfigured) return <Outlet />
  if (loading) return <FullPageLoader />
  if (!session) return <Navigate to="/login" replace />
  if (business) return <Navigate to="/dashboard" replace />
  return <Outlet />
}

// Requires a logged-in user who HAS finished onboarding.
// Used to guard /dashboard/* so a fresh signup is sent to onboarding first.
export function RequireBusiness() {
  const { session, loading, business } = useAuth()
  if (!supabaseConfigured) return <Outlet />
  if (loading) return <FullPageLoader />
  if (!session) return <Navigate to="/login" replace />
  if (!business) return <Navigate to="/onboarding" replace />
  return <Outlet />
}

// Sends already-logged-in users away from auth pages (login/signup).
export function RequireGuest() {
  const { session, loading } = useAuth()
  if (!supabaseConfigured) return <Outlet />
  if (loading) return <FullPageLoader />
  if (session) return <Navigate to="/dashboard" replace />
  return <Outlet />
}
