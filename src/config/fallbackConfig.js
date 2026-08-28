// These are LOCAL FALLBACKS only, used before the Supabase `plans` / `faqs`
// tables are populated, or if that fetch fails. Once the DB is seeded
// (see supabase/schema.sql), the Pricing and FAQ sections should read from
// Supabase so the admin panel can edit them without a code deploy.
// See src/lib/remoteConfig.js for the fetch-with-fallback pattern.

export const fallbackPlans = [
  {
    id: 'starter',
    name: 'Starter',
    price: '₹999',
    period: '/month',
    description: 'For a single business getting started with AI growth.',
    features: [
      'Daily Growth Advisor',
      'Lead & customer CRM',
      '5 AI videos / month',
      '3 languages (EN / HI / Hinglish)',
      'Email support',
    ],
    highlighted: false,
  },
  {
    id: 'growth',
    name: 'Growth',
    price: '₹2,499',
    period: '/month',
    description: 'For businesses actively running social media and ads.',
    features: [
      'Everything in Starter',
      '25 AI videos / month',
      'Meta Ads assistant',
      'Customer reactivation campaigns',
      'Priority support',
    ],
    highlighted: true,
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '₹4,999',
    period: '/month',
    description: 'For growing teams who want the full toolkit.',
    features: [
      'Everything in Growth',
      '100 AI videos / month',
      'Weekly AI business reports',
      'Multiple team members',
      'Dedicated onboarding',
    ],
    highlighted: false,
  },
]

export const fallbackFaqs = [
  {
    q: 'Do I need to know how to use AI?',
    a: "No. Tell BizGrow AI about your business once, and it studies your business and tells you what to do next in plain language.",
  },
  {
    q: 'Will my videos look like cartoons?',
    a: 'No. BizGrow AI generates realistic, professional, commercial-style videos by default, using your own product photos and brand assets where possible.',
  },
  {
    q: 'What happens after the 7-day free trial?',
    a: "You'll be asked to choose a plan to continue. Your trial period and dates are tracked securely on our servers, not in your browser.",
  },
  {
    q: 'Can I use BizGrow AI in Hindi?',
    a: 'Yes. Choose English, Hindi or Hinglish at signup, and switch anytime from Settings — suggestions, captions and AI Help all follow your choice.',
  },
  {
    q: 'Will BizGrow AI run ads or spend money without asking me?',
    a: 'Never. Every ad campaign and every message is shown to you for approval first. Nothing is published or spent automatically.',
  },
]

export const growthPlanExample = [
  { tag: '01', text: '5 leads need a follow-up today', reason: "They haven't heard back from you in 2+ days." },
  { tag: '02', text: 'Post an Instagram Reel', reason: 'Your last Reel got 3x more reach than a static post.' },
  { tag: '03', text: 'Create a Story poll about your weekend offer', reason: 'Stories are a low-effort way to remind regulars.' },
  { tag: '04', text: '18 customers haven\u2019t returned recently', reason: 'A light nudge often brings back 1 in 5.' },
]
