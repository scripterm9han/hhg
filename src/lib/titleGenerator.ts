type TitleRule = {
  pattern: RegExp;
  title: string;
};

// Ordered strongest-first so "Full Stack" / "Product" win over individual
// stack keywords, and AI outranks generic backend matches.
const RULES: TitleRule[] = [
  {
    pattern: /full[\s-]?stack|fullstack|product|saas|startup|founder/i,
    title: 'THE PRODUCT BUILDER',
  },
  {
    pattern: /\b(ai|ml|llm|gpt|genai|gen ai|machine learning|deep learning|mlops|data science|nlp|rag)\b/i,
    title: 'THE AI EXPLORER',
  },
  {
    pattern: /\b(cloud|devops|aws|kubernetes|k8s|docker|terraform|sre|gcp|azure|serverless|infrastructure)\b/i,
    title: 'THE INFRASTRUCTURE BUILDER',
  },
  {
    pattern: /\b(open[- ]?source|oss|github|community|hackathon)\b/i,
    title: 'THE COMMUNITY BUILDER',
  },
  {
    pattern: /\b(react|next\.?js|vue|svelte|frontend|front-end|front end|css|tailwind|web|html)\b/i,
    title: 'THE INTERFACE BUILDER',
  },
  {
    pattern: /\b(node|backend|back-end|back end|api|graphql|express|django|rails|spring|golang|go|rust|postgres|sql|database|db|typescript)\b/i,
    title: 'THE SYSTEM BUILDER',
  },
  {
    pattern: /\b(mobile|ios|android|flutter|swift|kotlin|react native)\b/i,
    title: 'THE MOBILE BUILDER',
  },
  {
    pattern: /\b(design|ux|ui|figma|user experience|ui\/ux|product design)\b/i,
    title: 'THE EXPERIENCE CRAFTER',
  },
  {
    pattern: /\b(devrel|evangelist|writer|blogger|content|research|analyst)\b/i,
    title: 'THE STORYTELLER',
  },
];

export const FALLBACK_TITLE = 'THE BUILDER';

export function builderTitle(builder: {
  name?: string;
  role?: string;
  stack?: string;
  vibe?: string;
}): string {
  const haystack = [
    builder.stack ?? '',
    builder.role ?? '',
    builder.vibe ?? '',
    builder.name ?? '',
  ]
    .join(' ')
    .replace(/\s+/g, ' ');

  for (const rule of RULES) {
    if (rule.pattern.test(haystack)) return rule.title;
  }
  return FALLBACK_TITLE;
}
