import { Link } from 'react-router-dom'
import { Button } from '../components/ui'

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-paper px-6 text-center">
      <p className="font-mono text-sm text-ink-soft">404</p>
      <h1 className="font-display text-2xl font-semibold text-ink">Page not found</h1>
      <p className="text-ink-soft">The page you're looking for doesn't exist.</p>
      <Button as={Link} to="/" className="mt-2">Back to home</Button>
    </div>
  )
}
