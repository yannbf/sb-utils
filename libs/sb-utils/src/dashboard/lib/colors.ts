/**
 * Stable color mapping for Storybook telemetry event types. Known types
 * get hand-picked colors; unknown types fall back to a deterministic hash
 * over a small palette so the same string always renders the same hue.
 */

export type TypeColor = { bg: string; fg: string }

export const TYPE_COLORS: Record<string, TypeColor> = {
  // Lifecycle
  boot: { bg: 'rgba(108,158,248,0.12)', fg: '#6c9ef8' },
  dev: { bg: 'rgba(74,222,128,0.12)', fg: '#4ade80' },
  build: { bg: 'rgba(74,222,128,0.12)', fg: '#4ade80' },
  index: { bg: 'rgba(74,222,128,0.12)', fg: '#4ade80' },
  exit: { bg: 'rgba(251,191,36,0.12)', fg: '#fbbf24' },
  canceled: { bg: 'rgba(251,191,36,0.12)', fg: '#fbbf24' },
  // Init & migration
  init: { bg: 'rgba(192,132,252,0.12)', fg: '#c084fc' },
  'init-step': { bg: 'rgba(192,132,252,0.12)', fg: '#c084fc' },
  upgrade: { bg: 'rgba(192,132,252,0.12)', fg: '#c084fc' },
  'multi-upgrade': { bg: 'rgba(192,132,252,0.12)', fg: '#c084fc' },
  automigrate: { bg: 'rgba(192,132,252,0.12)', fg: '#c084fc' },
  migrate: { bg: 'rgba(192,132,252,0.12)', fg: '#c084fc' },
  'scaffolded-empty': { bg: 'rgba(192,132,252,0.12)', fg: '#c084fc' },
  // Errors
  error: { bg: 'rgba(248,113,113,0.12)', fg: '#f87171' },
  'error-metadata': { bg: 'rgba(248,113,113,0.12)', fg: '#f87171' },
  // Testing
  'test-run': { bg: 'rgba(34,211,238,0.12)', fg: '#22d3ee' },
  'addon-test': { bg: 'rgba(34,211,238,0.12)', fg: '#22d3ee' },
  'testing-module-watch-mode': { bg: 'rgba(34,211,238,0.12)', fg: '#22d3ee' },
  'testing-module-completed-report': { bg: 'rgba(34,211,238,0.12)', fg: '#22d3ee' },
  'testing-module-crash-report': { bg: 'rgba(248,113,113,0.12)', fg: '#f87171' },
  mocking: { bg: 'rgba(244,114,182,0.12)', fg: '#f472b6' },
  // Stories
  'save-story': { bg: 'rgba(251,146,60,0.12)', fg: '#fb923c' },
  'create-new-story-file': { bg: 'rgba(251,146,60,0.12)', fg: '#fb923c' },
  'create-new-story-file-search': { bg: 'rgba(251,146,60,0.12)', fg: '#fb923c' },
  'ghost-stories': { bg: 'rgba(251,146,60,0.12)', fg: '#fb923c' },
  // Browser & editor
  browser: { bg: 'rgba(108,158,248,0.12)', fg: '#6c9ef8' },
  'open-in-editor': { bg: 'rgba(108,158,248,0.12)', fg: '#6c9ef8' },
  'preview-first-load': { bg: 'rgba(108,158,248,0.12)', fg: '#6c9ef8' },
  // Sharing & config
  share: { bg: 'rgba(108,158,248,0.12)', fg: '#6c9ef8' },
  'core-config': { bg: 'rgba(136,150,168,0.12)', fg: '#9ba8b9' },
  'version-update': { bg: 'rgba(136,150,168,0.12)', fg: '#9ba8b9' },
  remove: { bg: 'rgba(248,113,113,0.12)', fg: '#f87171' },
  add: { bg: 'rgba(74,222,128,0.12)', fg: '#4ade80' },
  doctor: { bg: 'rgba(251,191,36,0.12)', fg: '#fbbf24' },
  // Onboarding
  'addon-onboarding': { bg: 'rgba(244,114,182,0.12)', fg: '#f472b6' },
  'onboarding-survey': { bg: 'rgba(244,114,182,0.12)', fg: '#f472b6' },
  'onboarding-checklist-muted': { bg: 'rgba(244,114,182,0.12)', fg: '#f472b6' },
  'onboarding-checklist-status': { bg: 'rgba(244,114,182,0.12)', fg: '#f472b6' },
  // AI
  'ai-setup': { bg: 'rgba(34,211,238,0.12)', fg: '#22d3ee' },
  'ai-setup-evidence': { bg: 'rgba(34,211,238,0.12)', fg: '#22d3ee' },
  'ai-setup-final-scoring': { bg: 'rgba(34,211,238,0.12)', fg: '#22d3ee' },
  'ai-prompt-nudge': { bg: 'rgba(34,211,238,0.12)', fg: '#22d3ee' },
  'ai-init-opt-in': { bg: 'rgba(34,211,238,0.12)', fg: '#22d3ee' },
  'ai-setup-self-healing-scoring': { bg: 'rgba(34,211,238,0.12)', fg: '#22d3ee' },
}

const FALLBACK_HUES = [
  '#6c9ef8',
  '#4ade80',
  '#c084fc',
  '#fbbf24',
  '#22d3ee',
  '#fb923c',
  '#f472b6',
  '#f87171',
]

export function getColor(type: string): TypeColor {
  if (TYPE_COLORS[type]) return TYPE_COLORS[type]
  let hash = 0
  for (let i = 0; i < type.length; i++) hash = ((hash << 5) - hash + type.charCodeAt(i)) | 0
  const fg = FALLBACK_HUES[Math.abs(hash) % FALLBACK_HUES.length]
  const r = parseInt(fg.slice(1, 3), 16)
  const g = parseInt(fg.slice(3, 5), 16)
  const b = parseInt(fg.slice(5, 7), 16)
  return { bg: `rgba(${r},${g},${b},0.12)`, fg }
}
