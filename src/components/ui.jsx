import { Sprout } from 'lucide-react'

export function Logo({ className = '' }) {
  return (
    <span className={`inline-flex items-center gap-2 font-display font-semibold text-[1.15rem] text-ink ${className}`}>
      <span className="flex h-7 w-7 items-center justify-center rounded-[7px] bg-brand text-paper">
        <Sprout size={16} strokeWidth={2.4} />
      </span>
      BizGrow <span className="text-brand">AI</span>
    </span>
  )
}

export function Button({ as: As = 'button', variant = 'primary', size = 'md', className = '', children, ...props }) {
  const base =
    'inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed'
  const sizes = {
    md: 'px-5 py-2.5 text-[0.95rem]',
    lg: 'px-7 py-3.5 text-[1rem]',
    sm: 'px-4 py-2 text-sm',
  }
  const variants = {
    primary: 'bg-brand text-paper hover:bg-brand-dark',
    gold: 'bg-gold text-ink hover:bg-gold-dark',
    ghost: 'bg-transparent text-ink border border-line hover:bg-sage',
    outline: 'bg-transparent text-brand border border-brand hover:bg-sage',
    link: 'bg-transparent text-brand hover:text-brand-dark px-0 py-0 rounded-none',
  }
  return (
    <As className={`${base} ${sizes[size]} ${variants[variant]} ${className}`} {...props}>
      {children}
    </As>
  )
}

export function Field({ label, error, hint, children, htmlFor }) {
  return (
    <label className="block" htmlFor={htmlFor}>
      <span className="mb-1.5 block text-sm font-medium text-ink-soft">{label}</span>
      {children}
      {hint && !error && <span className="mt-1 block text-xs text-ink-soft">{hint}</span>}
      {error && <span className="mt-1 block text-xs text-danger">{error}</span>}
    </label>
  )
}

export function TextInput({ error, className = '', ...props }) {
  return (
    <input
      className={`w-full rounded-[10px] border bg-paper px-3.5 py-2.5 text-[0.95rem] text-ink outline-none transition-colors placeholder:text-ink-soft/60 ${
        error ? 'border-danger' : 'border-line focus:border-brand'
      } ${className}`}
      {...props}
    />
  )
}

export function Select({ error, className = '', children, ...props }) {
  return (
    <select
      className={`w-full rounded-[10px] border bg-paper px-3.5 py-2.5 text-[0.95rem] text-ink outline-none transition-colors ${
        error ? 'border-danger' : 'border-line focus:border-brand'
      } ${className}`}
      {...props}
    >
      {children}
    </select>
  )
}

export function Badge({ children, tone = 'sage' }) {
  const tones = {
    sage: 'bg-sage text-brand-dark',
    gold: 'bg-gold/15 text-gold-dark',
  }
  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${tones[tone]}`}>
      {children}
    </span>
  )
}

export function Card({ className = '', children }) {
  return (
    <div className={`rounded-[14px] border border-line bg-paper shadow-[0_1px_2px_rgba(20,35,28,0.04)] ${className}`}>
      {children}
    </div>
  )
}
