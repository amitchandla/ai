import { Card } from '../../components/ui'

export default function ComingSoon({ title, description }) {
  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-ink">{title}</h1>
      <Card className="mt-6 flex flex-col items-center gap-2 px-6 py-16 text-center">
        <p className="font-display text-lg font-medium text-ink">Being built next</p>
        <p className="max-w-sm text-sm text-ink-soft">{description}</p>
      </Card>
    </div>
  )
}
