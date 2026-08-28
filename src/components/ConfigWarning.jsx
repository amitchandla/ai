import { AlertTriangle } from 'lucide-react'
import { supabaseConfigured } from '../lib/supabase'

export default function ConfigWarning() {
  if (supabaseConfigured) return null
  return (
    <div className="flex items-center justify-center gap-2 bg-gold/15 px-4 py-2 text-center text-sm text-gold-dark">
      <AlertTriangle size={15} />
      <span>
        Supabase isn't connected yet. Add <code className="font-mono">VITE_SUPABASE_URL</code> and{' '}
        <code className="font-mono">VITE_SUPABASE_ANON_KEY</code> to a <code className="font-mono">.env</code> file
        — see <code className="font-mono">.env.example</code> and <code className="font-mono">README.md</code>.
      </span>
    </div>
  )
}
