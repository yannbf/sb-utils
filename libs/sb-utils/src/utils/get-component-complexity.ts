import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { basename, dirname, join } from 'node:path'

// -----------------------------
// Versioning & Config
// -----------------------------
export const MODEL_VERSION = '1.0.0'

export type ModelConfig = {
  // scaling constants
  LOC_DIVISOR: number
  LOC_MAX_SCORE: number

  // coupling / imports
  IMPORT_DIVISOR: number
  IMPORT_MAX_SCORE: number

  // hooks / logic
  HOOK_MULTIPLIER: number
  HOOKS_MAX_SCORE: number
  CUSTOM_HOOK_BONUS: number

  // integration pattern weights (raw)
  PATTERN_WEIGHTS: Record<string, number>
  PATTERN_MAX_SCORE: number

  // classification base scores
  CLASSIFICATION_BASE: {
    DEFAULT: number
    DESIGN_SYSTEM: number
    PAGE: number
    FEATURE: number
    UTILITY: number
  }

  // final thresholds for levels
  LEVELS: {
    SIMPLE: number // <=
    MEDIUM: number // <=
    HIGH: number // <=
    // very-high is > HIGH
  }
}

export const DEFAULT_MODEL_CONFIG: ModelConfig = {
  // Non-empty, non-typescript types amount of lines to consider
  // It is multiplied by 5 so currently large component is considered to have more than 300 lines of code (without counting empty spaces and types).
  LOC_DIVISOR: 60,
  LOC_MAX_SCORE: 20, // maps to breakdown locScore (0-20)

  IMPORT_DIVISOR: 1,
  IMPORT_MAX_SCORE: 15,

  HOOK_MULTIPLIER: 1.5,
  HOOKS_MAX_SCORE: 15,
  CUSTOM_HOOK_BONUS: 2,

  PATTERN_WEIGHTS: {
    AUTH: 5,
    DATA_FETCHING: 5,
    ROUTER: 3,
    ASYNC: 3,
    ERROR_HANDLING: 2,
    STATE_MANAGEMENT: 4,
    CONTEXT: 3,
    CSS_IN_JS: 4,
    HOOKS: 1, // fallback
  },
  PATTERN_MAX_SCORE: 30,

  CLASSIFICATION_BASE: {
    DEFAULT: 8,
    DESIGN_SYSTEM: 5,
    PAGE: 15,
    FEATURE: 12,
    UTILITY: 6,
  },

  LEVELS: {
    SIMPLE: 25,
    MEDIUM: 50,
    HIGH: 75,
  },
}

// -----------------------------
// PATTERNS & Constants (unchanged, but exposed)
// -----------------------------
const DESIGN_SYSTEM_NAMES = [
  'button',
  'input',
  'textarea',
  'select',
  'checkbox',
  'radio',
  'switch',
  'toggle',
  'icon',
  'avatar',
  'badge',
  'tag',
  'label',
  'tooltip',
  'popover',
  'modal',
  'dialog',
  'dropdown',
  'menu',
  'navbar',
  'nav',
  'tab',
  'accordion',
  'card',
  'alert',
  'notification',
  'toast',
  'spinner',
  'loader',
  'progress',
  'slider',
  'table',
  'form',
  'field',
  'text',
  'heading',
  'title',
  'link',
  'anchor',
]

const PAGE_NAMES = [
  'page',
  'screen',
  'view',
  'dashboard',
  'profile',
  'settings',
  'login',
  'register',
  'signup',
  'home',
  'landing',
  'admin',
]

const FEATURE_INDICATORS = ['feature', 'features', 'module', 'domain']

const PATTERNS = {
  HOOKS: [
    /\buse[A-Z]\w*(?:\s*<[^>]*>)?\s*\(/g,
    /\bReact\.use[A-Z]\w*(?:\s*<[^>]*>)?\s*\(/g,
    /\buse\w+\s*=\s*use[A-Z]\w*(?:\s*<[^>]*>)?\s*\(/g,
  ],
  AUTH: [
    /\bauth\b/i,
    /\blogin\b/i,
    /\blogout\b/i,
    /\bsignin\b/i,
    /\bsignout\b/i,
    /\bauthentication\b/i,
    /\bauthorization\b/i,
    /\btoken\b/i,
    /\bsession\b/i,
    /\buser\b\s*\.\s*\w+/i,
    /\bpermission\b/i,
    /\brole\b/i,
    /\buseAuth\b/i,
    /\bAuthProvider\b/i,
  ],
  DATA_FETCHING: [
    /\bfetch\s*\(/,
    /\baxios\s*\./,
    /\bapi\s*\//,
    /\bhttp\s*\//,
    /\bgraphql/i,
    /\bquery\s*\(/,
    /\bmutation\s*\(/,
    /\buseQuery\s*\(/,
    /\buseMutation\s*\(/,
    /\bswr\s*\(/,
    /\breact-query/i,
    /\bapollo/i,
  ],
  ROUTER: [
    /\buseRouter\b/,
    /\buseNavigate\b/,
    /\buseParams\b/,
    /\buseLocation\b/,
    /\bLink\s+from\s+['"]react-router/i,
    /\bNavLink\s+from\s+['"]react-router/i,
    /\bBrowserRouter\b/,
    /\bRoutes\b/,
    /\bRoute\b/,
    /\bnext\/router/i,
    /\bnext\/navigation/i,
  ],
  ASYNC: [
    /\basync\s+/,
    /\bawait\s+/,
    /\bPromise\s*\./,
    /\bthen\s*\(/,
    /\bcatch\s*\(/,
    /\buseAsync\b/i,
  ],
  ERROR_HANDLING: [
    /\btry\s*\{/,
    /\bcatch\s*\(/,
    /\bError\s*\(/,
    /\bthrow\s+/,
    /\buseError\b/i,
    /\berror\s*boundary/i,
  ],
  STATE_MANAGEMENT: [
    /\buseReducer\b/,
    /\buseContext\b/,
    /\buseStore\b/i,
    /\buseSelector\b/i,
    /\buseDispatch\b/i,
    /\bredux/i,
    /\bzustand/i,
    /\bjotai/i,
    /\brecoil/i,
  ],
  CONTEXT: [
    /\bcreateContext\b/,
    /\buseContext\b/,
    /\bContext\.Provider\b/,
    /\bContext\.Consumer\b/,
  ],
  CSS_IN_JS: [
    /\bimport.*styled.*from.*styled-components\b/,
    /\bstyled\.\w+\s*</,
    /\bstyled\.\w+\s*`/,
    /\bcss\s*`/,
    /\bkeyframes\s*\(/,
    /@emotion/,
    /styled-jsx/,
    /linaria/,
    /react-jss/,
    /vanilla-extract/,
  ],
} as const

export type FeatureCategory = keyof typeof PATTERNS
export type ComplexityPattern =
  | 'auth'
  | 'data-fetching'
  | 'router'
  | 'async-operations'
  | 'error-handling'
  | 'state-management'
  | 'context-usage'
  | 'css-in-js'

export type ComponentType =
  | 'design-system'
  | 'page'
  | 'feature'
  | 'utility'
  | 'unknown'

export type ComplexityLevel = 'simple' | 'medium' | 'high' | 'very-high'

// -----------------------------
// 2. Data Structures
// -----------------------------
export interface LowLevelFeatures {
  meta: {
    filePath: string
    fileName: string
    directory: string
  }
  metrics: {
    totalLines: number
    nonEmptyLines: number
    /**
     * Non-empty lines excluding top-level TypeScript type-only declarations
     * like `type X = ...` and `interface X { ... }` (and `export type { ... }`).
     *
     * This is intended to better approximate "runtime" component size when a file
     * contains many types/interfaces.
     */
    nonEmptyRuntimeLines: number
  }
  imports: {
    total: number
    react: string[]
    external: string[]
    internal: string[]
  }
  hooks: {
    count: number
    names: string[]
  }
  // Counts of pattern matches per category
  patternCounts: Record<FeatureCategory, number>
}

export interface HighLevelFeatures {
  isDesignSystemCandidate: boolean
  isPageCandidate: boolean
  isFeatureCandidate: boolean

  hasCustomHooks: boolean
  hasComplexState: boolean
  hasAuthIntegration: boolean
  hasDataFetching: boolean
  hasRouting: boolean

  dimensions: {
    size: number
    coupling: number
    logic: number
    integration: number
  }
}

export interface ComplexityClassification {
  modelVersion: string
  modelConfig: ModelConfig
  score: number // 0-100
  level: ComplexityLevel
  type: ComponentType
  factors: string[]
  breakdown: {
    locScore: number
    hooksScore: number
    dependenciesScore: number
    patternsScore: number
    classificationScore: number
  }
}

export interface ComponentComplexity extends ComplexityClassification {
  features: {
    low: LowLevelFeatures
    high: HighLevelFeatures
  }
  timestamp: string
}

// Snapshot format (persisted)
export interface ComponentSnapshot {
  modelVersion: string
  modelConfig: ModelConfig
  result: ComponentComplexity
}

function braceDelta(line: string): number {
  // Lightweight heuristic: count braces without trying to parse strings/comments.
  // This is "good enough" for typical type/interface blocks.
  let delta = 0
  for (const ch of line) {
    if (ch === '{') delta += 1
    else if (ch === '}') delta -= 1
  }
  return delta
}

function countNonEmptyRuntimeLines(lines: string[]): number {
  // Excludes top-level TypeScript-only declarations that often bloat LOC:
  // - type Foo = ...
  // - interface Foo { ... }
  // - export type { Foo } from '...'
  //
  // Heuristic approach (no TS compiler API at runtime).
  const TYPE_OR_INTERFACE_DECL_RE =
    /^\s*(export\s+)?(declare\s+)?(type|interface)\s+[A-Za-z_$][\w$]*/
  const TYPE_ONLY_EXPORT_RE = /^\s*export\s+type\s*\{/

  let nonEmptyRuntimeLines = 0
  let inTypeBlock = false
  let typeBraceDepth = 0

  for (const line of lines) {
    const trimmed = line.trim()
    if (trimmed.length === 0) continue

    // Exclude type-only export lines (no runtime impact).
    if (!inTypeBlock && TYPE_ONLY_EXPORT_RE.test(trimmed)) {
      continue
    }

    if (!inTypeBlock && TYPE_OR_INTERFACE_DECL_RE.test(trimmed)) {
      inTypeBlock = true
      typeBraceDepth += braceDelta(trimmed)

      // End immediately for one-liners like:
      // - interface X {}
      // - type X = { ... }
      // - type X = Foo | Bar;
      const endsWithSemicolon = /;\s*$/.test(trimmed)
      const endsWithClosingBrace = /}\s*;?\s*$/.test(trimmed)
      const oneLineBraceBlock = trimmed.includes('{') && trimmed.includes('}')
      if (
        typeBraceDepth <= 0 &&
        (endsWithSemicolon || endsWithClosingBrace || oneLineBraceBlock)
      ) {
        inTypeBlock = false
        typeBraceDepth = 0
      }
      continue
    }

    if (inTypeBlock) {
      typeBraceDepth += braceDelta(trimmed)
      const endsWithSemicolon = /;\s*$/.test(trimmed)
      const endsWithClosingBrace = /}\s*;?\s*$/.test(trimmed)
      if (typeBraceDepth <= 0 && (endsWithSemicolon || endsWithClosingBrace)) {
        inTypeBlock = false
        typeBraceDepth = 0
      }
      continue
    }

    nonEmptyRuntimeLines += 1
  }

  return nonEmptyRuntimeLines
}

// -----------------------------
// 3. Extraction (ETL)
// -----------------------------
export async function extractLowLevelFeatures(
  filePath: string,
  content?: string
): Promise<LowLevelFeatures> {
  const fileContent = content ?? (await readFile(filePath, 'utf-8'))
  const lines = fileContent.split('\n')
  const nonEmptyLines = lines.filter((line) => line.trim().length > 0).length
  const nonEmptyRuntimeLines = countNonEmptyRuntimeLines(lines)

  // Import Analysis
  const importLines = lines.filter((line) => line.trim().startsWith('import'))
  const reactImports: string[] = []
  const externalImports: string[] = []
  const internalImports: string[] = []

  for (const line of importLines) {
    const fromMatch = line.match(/from\s+['"]([^'"]+)['"]/)
    const pathMatch = line.match(/import\s+['"]([^'"]+)['"]/)
    const importPath = fromMatch?.[1] ?? pathMatch?.[1]

    if (importPath) {
      if (
        importPath === 'react' ||
        importPath.startsWith('react/') ||
        importPath.startsWith('@types/react')
      ) {
        reactImports.push(importPath)
      } else if (importPath.startsWith('.') || importPath.startsWith('/')) {
        internalImports.push(importPath)
      } else {
        externalImports.push(importPath)
      }
    }
  }

  // Hook Analysis - collect raw matches and canonicalize names
  const hookNames = new Set<string>()
  for (const pattern of PATTERNS.HOOKS) {
    const matches = fileContent.match(pattern)
    if (matches) {
      for (const match of matches) {
        // Extract candidate like "useSomething("
        const nameMatch = match.match(/\b(use[A-Z]\w*)/)
        if (nameMatch) {
          hookNames.add(nameMatch[1])
        }
      }
    }
  }

  // Pattern Counts
  const patternCounts = {} as Record<FeatureCategory, number>
  for (const key of Object.keys(PATTERNS) as FeatureCategory[]) {
    let count = 0
    for (const pattern of PATTERNS[key]) {
      const matches = fileContent.match(pattern)
      if (matches) count += matches.length
    }
    patternCounts[key] = count
  }

  return {
    meta: {
      filePath,
      fileName: basename(filePath),
      directory: dirname(filePath),
    },
    metrics: {
      totalLines: lines.length,
      nonEmptyLines,
      nonEmptyRuntimeLines,
    },
    imports: {
      total:
        reactImports.length + externalImports.length + internalImports.length,
      react: reactImports,
      external: externalImports,
      internal: internalImports,
    },
    hooks: {
      count: hookNames.size,
      names: Array.from(hookNames),
    },
    patternCounts,
  }
}

// -----------------------------
// 4. Feature Engineering
// -----------------------------
export function synthesizeHighLevelFeatures(
  low: LowLevelFeatures
): HighLevelFeatures {
  const { fileName, directory } = low.meta
  const fileNameLower = fileName.toLowerCase()
  const pathLower = (directory + '/' + fileName).toLowerCase()

  // Classification Candidates
  const isDesignSystemCandidate = DESIGN_SYSTEM_NAMES.some(
    (name) =>
      fileNameLower.includes(name) &&
      !fileNameLower.includes('page') &&
      !fileNameLower.includes('screen')
  )

  const isPageCandidate = PAGE_NAMES.some((name) =>
    fileNameLower.includes(name)
  )

  const isFeatureCandidate = FEATURE_INDICATORS.some((indicator) =>
    pathLower.includes(indicator)
  )

  // Complexity Heuristics
  const hasCustomHooks = low.hooks.names.some(
    (name) =>
      !name.startsWith('useState') &&
      !name.startsWith('useEffect') &&
      !name.startsWith('useCallback') &&
      !name.startsWith('useMemo') &&
      !name.startsWith('useRef')
  )

  // Dimension Scoring (normalized-ish)
  const size = Math.round(Math.min(10, low.metrics.nonEmptyRuntimeLines / 20)) // 0-10
  const coupling = Math.round(Math.min(10, low.imports.total / 1)) // 0-10
  const logic = Math.round(
    Math.min(10, low.hooks.count * 1.5 + (hasCustomHooks ? 1 : 0))
  ) // 0-10

  // Integration: presence of key patterns
  let integrationRaw = 0
  if (low.patternCounts.AUTH > 0) integrationRaw += 3
  if (low.patternCounts.DATA_FETCHING > 0) integrationRaw += 3
  if (low.patternCounts.ROUTER > 0) integrationRaw += 2
  if (low.patternCounts.STATE_MANAGEMENT > 0) integrationRaw += 2
  const integration = Math.min(10, integrationRaw)

  return {
    isDesignSystemCandidate,
    isPageCandidate,
    isFeatureCandidate,
    hasCustomHooks,
    hasComplexState: low.patternCounts.STATE_MANAGEMENT > 0,
    hasAuthIntegration: low.patternCounts.AUTH > 0,
    hasDataFetching: low.patternCounts.DATA_FETCHING > 0,
    hasRouting: low.patternCounts.ROUTER > 0,
    dimensions: {
      size,
      coupling,
      logic,
      integration,
    },
  }
}

// -----------------------------
// 5. Classification (The Model)
// -----------------------------
export function classifyComplexityWithConfig(
  low: LowLevelFeatures,
  high: HighLevelFeatures,
  config: ModelConfig
): ComplexityClassification {
  // 1. Determine Component Type
  let type: ComponentType = 'unknown'
  if (high.isDesignSystemCandidate) type = 'design-system'
  else if (high.isPageCandidate) type = 'page'
  else if (high.isFeatureCandidate) type = 'feature'
  else if (low.meta.fileName.toLowerCase().includes('util')) type = 'utility'

  // 2. Calculate Sub-Scores (mapping to breakdown scales)
  // locScore: scale nonEmptyRuntimeLines -> [0 .. config.LOC_MAX_SCORE]
  const locRaw = Math.floor(
    low.metrics.nonEmptyRuntimeLines / config.LOC_DIVISOR
  )
  const locScore = Math.min(config.LOC_MAX_SCORE, locRaw)

  // hooksScore: from high.dimensions.logic but scaled to HOOKS_MAX_SCORE
  const hooksScore = Math.min(
    config.HOOKS_MAX_SCORE,
    Math.floor(high.dimensions.logic * config.HOOK_MULTIPLIER) +
      (high.hasCustomHooks ? config.CUSTOM_HOOK_BONUS : 0)
  )

  // dependenciesScore (imports)
  const dependenciesScore = Math.min(
    config.IMPORT_MAX_SCORE,
    Math.floor(low.imports.total / config.IMPORT_DIVISOR)
  )

  // Pattern Score: weighted by PATTERN_WEIGHTS
  let patternsScore = 0
  for (const [patternKey, weight] of Object.entries(config.PATTERN_WEIGHTS)) {
    // map from config key to our PATTERNS keys - use case-insensitive matching
    const upperKey = patternKey.toUpperCase()
    // If pattern exists in PATTERNS, use counts; otherwise treat as zero
    if ((PATTERNS as any)[upperKey]) {
      const count = (low.patternCounts as any)[upperKey] ?? 0
      if (count > 0) patternsScore += weight
    } else {
      // fallback: attempt direct mapping (e.g. "ERROR_HANDLING")
      const count = (low.patternCounts as any)[upperKey] ?? 0
      if (count > 0) patternsScore += weight
    }
  }
  patternsScore = Math.min(config.PATTERN_MAX_SCORE, patternsScore)

  // Classification Score (contextual base)
  let classificationScore = config.CLASSIFICATION_BASE.DEFAULT
  if (type === 'design-system')
    classificationScore = config.CLASSIFICATION_BASE.DESIGN_SYSTEM
  else if (type === 'page')
    classificationScore = config.CLASSIFICATION_BASE.PAGE
  else if (type === 'feature')
    classificationScore = config.CLASSIFICATION_BASE.FEATURE
  else if (type === 'utility')
    classificationScore = config.CLASSIFICATION_BASE.UTILITY

  // Total Score
  const rawScore =
    locScore +
    hooksScore +
    dependenciesScore +
    patternsScore +
    classificationScore
  const complexityScore = Math.min(100, Math.round(rawScore))

  // Complexity Level
  let level: ComplexityLevel
  if (complexityScore <= config.LEVELS.SIMPLE) level = 'simple'
  else if (complexityScore <= config.LEVELS.MEDIUM) level = 'medium'
  else if (complexityScore <= config.LEVELS.HIGH) level = 'high'
  else level = 'very-high'

  // Factors (top reasons) - deterministic selection order
  const factors: string[] = []
  if (low.metrics.nonEmptyRuntimeLines > config.LOC_DIVISOR * 5)
    factors.push('Large component size')
  if (low.hooks.count > 3) factors.push('Multiple hooks usage')
  if (low.imports.total > 5) factors.push('High dependency count')
  if (high.hasAuthIntegration) factors.push('Authentication logic')
  if (high.hasDataFetching) factors.push('Data fetching operations')
  if (low.patternCounts.STATE_MANAGEMENT > 0) factors.push('State management')
  if (low.patternCounts.CSS_IN_JS > 0) factors.push('CSS-in-JS styling')
  if (high.hasRouting) factors.push('Router integration')
  if (low.patternCounts.ASYNC > 0) factors.push('Async operations')
  if (low.patternCounts.CONTEXT > 0) factors.push('Context usage')
  if (low.patternCounts.ERROR_HANDLING > 0) factors.push('Error handling')

  if (type === 'page') factors.push('Page component')
  else if (type === 'feature') factors.push('Feature component')
  else if (type === 'design-system') factors.push('Design system component')

  return {
    modelVersion: MODEL_VERSION,
    modelConfig: config,
    score: complexityScore,
    level,
    type,
    factors: factors.slice(0, 6), // keep to a reasonable number
    breakdown: {
      locScore,
      hooksScore,
      dependenciesScore,
      patternsScore,
      classificationScore,
    },
  }
}

// -----------------------------
// 6. Public API (Pipeline Execution)
// -----------------------------
export async function getComponentComplexity(
  filePath: string,
  config: ModelConfig = DEFAULT_MODEL_CONFIG
): Promise<ComponentComplexity> {
  try {
    const lowLevel = await extractLowLevelFeatures(filePath)
    const highLevel = synthesizeHighLevelFeatures(lowLevel)
    const classification = classifyComplexityWithConfig(
      lowLevel,
      highLevel,
      config
    )

    const result: ComponentComplexity = {
      ...classification,
      features: {
        low: lowLevel,
        high: highLevel,
      },
      timestamp: new Date().toISOString(),
    }

    return result
  } catch (error) {
    throw new Error(
      `Failed to analyze component complexity for ${filePath}: ${String(error)}`
    )
  }
}

// -----------------------------
// 7. Persistence Utilities (Snapshots)
// -----------------------------
export async function saveSnapshot(
  componentComplexity: ComponentComplexity,
  outPath: string
): Promise<void> {
  const dir = dirname(outPath)
  try {
    // Ensure directory exists (simple attempt)
    await mkdir(dir, { recursive: true })
  } catch {
    // ignore
  }
  const snapshot: ComponentSnapshot = {
    modelVersion: componentComplexity.modelVersion,
    modelConfig: componentComplexity.modelConfig,
    result: componentComplexity,
  }
  await writeFile(outPath, JSON.stringify(snapshot, null, 2), 'utf-8')
}

export async function loadSnapshot(path: string): Promise<ComponentSnapshot> {
  const content = await readFile(path, 'utf-8')
  const parsed = JSON.parse(content) as ComponentSnapshot
  return parsed
}

// -----------------------------
// 8. Reclassification Helpers
//    (Re-run classification deterministically on raw low-level features)
// -----------------------------
export function reclassifyWithConfig(
  low: LowLevelFeatures,
  config: ModelConfig = DEFAULT_MODEL_CONFIG
): ComplexityClassification {
  const high = synthesizeHighLevelFeatures(low)
  return classifyComplexityWithConfig(low, high, config)
}

// -----------------------------
// 9. CLI convenience (minimal)
// -----------------------------
export async function runAndMaybeSave(
  filePath: string,
  options?: { saveSnapshot?: boolean; outDir?: string; config?: ModelConfig }
): Promise<ComponentComplexity> {
  const config = options?.config ?? DEFAULT_MODEL_CONFIG
  const result = await getComponentComplexity(filePath, config)
  if (options?.saveSnapshot) {
    const name = `${basename(filePath).replace(/\.[^.]+$/, '')}.complexity.json`
    const outDir = options.outDir ?? './component-complexity-snapshots'
    const outPath = join(outDir, name)
    await saveSnapshot(result, outPath)
  }
  return result
}

// -----------------------------
// 10. Small utilities for debugging
// -----------------------------
export function prettyPrint(result: ComponentComplexity): string {
  return [
    `Component: ${result.features.low.meta.filePath}`,
    `Model version: ${result.modelVersion}`,
    `Score: ${result.score} (${result.level})`,
    `Type: ${result.type}`,
    `Factors: ${result.factors.join(', ')}`,
    `Breakdown: ${JSON.stringify(result.breakdown)}`,
    `Dimensions: ${JSON.stringify(result.features.high.dimensions)}`,
  ].join('\n')
}

// -----------------------------
// 11. Exports (default and named)
// -----------------------------
export default {
  MODEL_VERSION,
  DEFAULT_MODEL_CONFIG,
  extractLowLevelFeatures,
  synthesizeHighLevelFeatures,
  classifyComplexityWithConfig,
  getComponentComplexity,
  saveSnapshot,
  loadSnapshot,
  reclassifyWithConfig,
  runAndMaybeSave,
  prettyPrint,
}
