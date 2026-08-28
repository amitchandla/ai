import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { LanguageProvider } from './context/LanguageContext'
import ConfigWarning from './components/ConfigWarning'
import { RequireAuth, RequireGuest, RequireOnboarding, RequireBusiness } from './components/RouteGuards'

import Landing from './pages/Landing'
import Signup from './pages/Signup'
import Login from './pages/Login'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import Onboarding from './pages/Onboarding'
import NotFound from './pages/NotFound'

import DashboardLayout from './pages/dashboard/DashboardLayout'
import Overview from './pages/dashboard/Overview'
import Settings from './pages/dashboard/Settings'
import ComingSoon from './pages/dashboard/ComingSoon'

const comingSoon = [
  ['growth-advisor', 'Growth Advisor', 'The full AI-driven daily plan, connected to your real leads, customers and calendar.'],
  ['leads', 'Leads', 'A lead pipeline from New to Won, with AI-prioritized hot leads.'],
  ['customers', 'Customers', 'Your customer database with search, filters and interaction history.'],
  ['follow-ups', 'Follow-ups', 'AI-drafted follow-up messages in your language, ready for your approval.'],
  ['marketing', 'Marketing', 'Marketing ideas and campaigns built from your Business Brain.'],
  ['video-studio', 'Video Studio', 'Realistic, commercial-style marketing videos from your own product photos.'],
  ['social-media', 'Social Media', 'Reel, Story and Post suggestions ready to create in one click.'],
  ['ads', 'Ads', 'Meta Ads campaign ideas — nothing launches without your approval.'],
  ['reviews', 'Reviews', 'Review requests for happy customers, private alerts for unhappy ones.'],
  ['reports', 'Reports', 'An honest weekly report of what happened and what to do next.'],
  ['saved', 'Saved Content', 'Everything you\u2019ve generated and kept, in one place.'],
  ['ai-help', 'AI Help', 'Ask anything about using BizGrow AI, answered in your language.'],
]

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <BrowserRouter>
          <ConfigWarning />
          <Routes>
            <Route path="/" element={<Landing />} />

            <Route element={<RequireGuest />}>
              <Route path="/signup" element={<Signup />} />
              <Route path="/login" element={<Login />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
            </Route>

            <Route path="/reset-password" element={<ResetPassword />} />

            <Route element={<RequireAuth />}>
              <Route element={<RequireOnboarding />}>
                <Route path="/onboarding" element={<Onboarding />} />
              </Route>

              <Route element={<RequireBusiness />}>
                <Route path="/dashboard" element={<DashboardLayout />}>
                  <Route index element={<Overview />} />
                  <Route path="settings" element={<Settings />} />
                  {comingSoon.map(([slug, title, description]) => (
                    <Route key={slug} path={slug} element={<ComingSoon title={title} description={description} />} />
                  ))}
                </Route>
              </Route>
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </LanguageProvider>
  )
}
