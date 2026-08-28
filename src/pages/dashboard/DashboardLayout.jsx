import { useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import {
  LayoutDashboard, Sparkles, Users, UserRound, MessageSquareText, Megaphone,
  Clapperboard, Camera, Star, FileBarChart, Bookmark, LifeBuoy, Settings,
  Menu, X, Bell, LogOut,
} from 'lucide-react'
import { Logo } from '../../components/ui'
import LanguageSwitcher from '../../components/LanguageSwitcher'
import { useAuth } from '../../context/AuthContext'
import { useLanguage } from '../../context/LanguageContext'

const navItems = [
  { to: '/dashboard', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/dashboard/growth-advisor', label: 'Growth Advisor', icon: Sparkles },
  { to: '/dashboard/leads', label: 'Leads', icon: Users },
  { to: '/dashboard/customers', label: 'Customers', icon: UserRound },
  { to: '/dashboard/follow-ups', label: 'Follow-ups', icon: MessageSquareText },
  { to: '/dashboard/marketing', label: 'Marketing', icon: Megaphone },
  { to: '/dashboard/video-studio', label: 'Video Studio', icon: Clapperboard },
  { to: '/dashboard/social-media', label: 'Social Media', icon: Camera },
  { to: '/dashboard/ads', label: 'Ads', icon: Megaphone },
  { to: '/dashboard/reviews', label: 'Reviews', icon: Star },
  { to: '/dashboard/reports', label: 'Reports', icon: FileBarChart },
  { to: '/dashboard/saved', label: 'Saved Content', icon: Bookmark },
  { to: '/dashboard/ai-help', label: 'AI Help', icon: LifeBuoy },
  { to: '/dashboard/settings', label: 'Settings', icon: Settings },
]

function SidebarLinks({ onNavigate }) {
  return (
    <nav className="flex flex-col gap-0.5 px-3">
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          onClick={onNavigate}
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-[10px] px-3 py-2.5 text-sm font-medium transition-colors ${
              isActive ? 'bg-sage text-brand-dark' : 'text-ink-soft hover:bg-sage/60 hover:text-ink'
            }`
          }
        >
          <item.icon size={17} />
          {item.label}
        </NavLink>
      ))}
    </nav>
  )
}

export default function DashboardLayout() {
  const { business, signOut } = useAuth()
  const { t } = useLanguage()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="min-h-screen bg-paper-soft md:flex">
      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 border-r border-line bg-paper md:flex md:flex-col">
        <div className="px-5 py-5"><Logo /></div>
        <div className="flex-1 overflow-y-auto pb-6"><SidebarLinks /></div>
        <button
          onClick={signOut}
          className="mx-3 mb-5 flex items-center gap-3 rounded-[10px] px-3 py-2.5 text-sm font-medium text-ink-soft hover:bg-sage/60 hover:text-ink"
        >
          <LogOut size={17} /> Log out
        </button>
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-ink/40" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 h-full w-72 bg-paper">
            <div className="flex items-center justify-between px-5 py-5">
              <Logo />
              <button onClick={() => setMobileOpen(false)} aria-label="Close menu"><X size={20} /></button>
            </div>
            <SidebarLinks onNavigate={() => setMobileOpen(false)} />
            <button
              onClick={signOut}
              className="mx-3 mt-4 flex items-center gap-3 rounded-[10px] px-3 py-2.5 text-sm font-medium text-ink-soft hover:bg-sage/60"
            >
              <LogOut size={17} /> Log out
            </button>
          </aside>
        </div>
      )}

      <div className="flex-1">
        <header className="flex items-center justify-between border-b border-line bg-paper px-5 py-3.5">
          <div className="flex items-center gap-3">
            <button className="md:hidden" onClick={() => setMobileOpen(true)} aria-label="Open menu">
              <Menu size={22} />
            </button>
            <span className="font-display text-[0.95rem] font-medium text-ink">{business?.name ?? 'Your business'}</span>
          </div>
          <div className="flex items-center gap-3">
            <LanguageSwitcher className="hidden sm:inline-flex" />
            <button className="relative rounded-full p-2 hover:bg-sage" aria-label="Notifications">
              <Bell size={18} />
            </button>
          </div>
        </header>

        <main className="p-5 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
