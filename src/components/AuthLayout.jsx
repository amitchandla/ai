import { Link } from 'react-router-dom'
import { Check, Sparkles, Clapperboard, Users, MessageSquareText, ShieldCheck, CreditCard } from 'lucide-react'
import { Logo, Badge } from './ui'

const highlights = [
  { icon: Sparkles, text: 'Daily Growth Suggestions' },
  { icon: Clapperboard, text: 'AI Marketing Videos' },
  { icon: Users, text: 'Lead & Customer Management' },
  { icon: MessageSquareText, text: 'Smart Follow-ups' },
]

export default function AuthLayout({ children }) {
  return (
    <div className="grid min-h-screen md:grid-cols-2">
      {/* Left: brand panel */}
      <div className="hidden flex-col justify-between bg-brand-dark px-12 py-10 text-paper md:flex">
        <Link to="/"><Logo className="text-paper [&_.text-brand]:text-gold" /></Link>

        <div>
          <p className="font-display text-2xl font-medium leading-snug">Your AI Business Growth Assistant</p>
          <ul className="mt-8 space-y-4">
            {highlights.map((h) => (
              <li key={h.text} className="flex items-center gap-3 text-[0.95rem] text-paper/90">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-paper/10">
                  <h.icon size={15} />
                </span>
                {h.text}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-wrap gap-2.5">
          <Badge tone="gold">7 Days Free</Badge>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-paper/10 px-3 py-1 text-xs font-semibold text-paper">
            <CreditCard size={13} /> No Card Required
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-paper/10 px-3 py-1 text-xs font-semibold text-paper">
            <ShieldCheck size={13} /> Secure
          </span>
        </div>
      </div>

      {/* Right: form */}
      <div className="flex flex-col justify-center px-6 py-12 sm:px-12 lg:px-20">
        <Link to="/" className="mb-8 md:hidden"><Logo /></Link>
        <div className="mx-auto w-full max-w-sm">{children}</div>
      </div>
    </div>
  )
}

export { Check }
