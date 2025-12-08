import { readFile } from 'node:fs/promises'
import { basename, dirname } from 'node:path'

export type ComplexityPattern =
  | 'auth'
  | 'data-fetching'
  | 'router'
  | 'async-operations'
  | 'error-handling'
  | 'state-management'
  | 'context-usage'
  | 'css-in-js'

export interface ComponentComplexity {
  filePath: string
  fileName: string
  directory: string

  // Basic metrics
  linesOfCode: number
  nonEmptyLines: number

  // Code patterns
  hooks: {
    count: number
    names: string[]
    hasCustomHooks: boolean
  }

  // Dependencies and imports
  dependencies: {
    total: number
    external: number
    internal: number
    reactImports: string[]
    thirdPartyImports: string[]
  }

  // Patterns indicating complexity
  patterns: ComplexityPattern[]

  // Component classification
  isDesignSystem: boolean
  isPage: boolean
  isFeature: boolean
  componentType: 'design-system' | 'page' | 'feature' | 'utility' | 'unknown'

  // Complexity score (0-100)
  complexityScore: number

  // Complexity level
  complexityType: 'simple' | 'medium' | 'high' | 'ultra'

  // Detailed breakdown for score calculation
  scoreBreakdown: {
    locScore: number
    hooksScore: number
    dependenciesScore: number
    patternsScore: number
    classificationScore: number
  }

  // Top complexity factors
  complexityFactors: string[]
}

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

const HOOK_PATTERNS = [
  /\buse[A-Z]\w*(?:\s*<[^>]*>)?\s*\(/g, // Standard React hooks (useState, useEffect, etc.) with optional generics
  /\bReact\.use[A-Z]\w*(?:\s*<[^>]*>)?\s*\(/g, // React.useState, React.useEffect, etc. with optional generics
  /\buse\w+\s*=\s*use[A-Z]\w*(?:\s*<[^>]*>)?\s*\(/g, // Destructured hooks with optional generics
]

const AUTH_PATTERNS = [
  /\bauth\b/i,
  /\blogin\b/i,
  /\blogout\b/i,
  /\bsignin\b/i,
  /\bsignout\b/i,
  /\bauthentication\b/i,
  /\bauthorization\b/i,
  /\btoken\b/i,
  /\bsession\b/i,
  /\buser\b\s*\.\s*\w+/i, // user.id, user.name, etc.
  /\bpermission\b/i,
  /\brole\b/i,
  /\buseAuth\b/i,
  /\bAuthProvider\b/i,
]

const DATA_FETCHING_PATTERNS = [
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
]

const ROUTER_PATTERNS = [
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
]

const ASYNC_PATTERNS = [
  /\basync\s+/,
  /\bawait\s+/,
  /\bPromise\s*\./,
  /\bthen\s*\(/,
  /\bcatch\s*\(/,
  /\buseAsync\b/i,
]

const ERROR_HANDLING_PATTERNS = [
  /\btry\s*\{/,
  /\bcatch\s*\(/,
  /\bError\s*\(/,
  /\bthrow\s+/,
  /\buseError\b/i,
  /\berror\s*boundary/i,
]

const STATE_MANAGEMENT_PATTERNS = [
  /\buseReducer\b/,
  /\buseContext\b/,
  /\buseStore\b/i,
  /\buseSelector\b/i,
  /\buseDispatch\b/i,
  /\bredux/i,
  /\bzustand/i,
  /\bjotai/i,
  /\brecoil/i,
]

const CONTEXT_PATTERNS = [
  /\bcreateContext\b/,
  /\buseContext\b/,
  /\bContext\.Provider\b/,
  /\bContext\.Consumer\b/,
]

const CSS_IN_JS_PATTERNS = [
  // styled-components
  /\bimport.*styled.*from.*styled-components\b/,
  /\bimport.*\{.*styled.*\}.*from.*styled-components\b/,
  /\bstyled\.\w+\s*<\s*\{[^}]*\}\s*>\s*\(\s*\)/,
  /\bstyled\.\w+\s*`\s*.*?\s*`/,
  /\bstyled\s*\([^)]*\)\s*`\s*.*?\s*`/,
  /\bThemeProvider\b/,
  /\buseTheme\b/,

  // emotion
  /\bimport.*styled.*from.*@emotion\/styled\b/,
  /\bimport.*\{.*styled.*\}.*from.*@emotion\/styled\b/,
  /\bimport.*css.*from.*@emotion\/css\b/,
  /\bimport.*\{.*css.*\}.*from.*@emotion\/css\b/,
  /\bimport.*\{.*keyframes.*\}.*from.*@emotion\/react\b/,
  /\bimport.*\{.*Global.*\}.*from.*@emotion\/react\b/,
  /\bimport.*\{.*ThemeProvider.*\}.*from.*@emotion\/react\b/,
  /\bimport.*\{.*useTheme.*\}.*from.*@emotion\/react\b/,

  // styled-jsx
  /\bimport.*'styled-jsx\/css'\b/,
  /\bimport.*\{.*css.*\}.*from.*styled-jsx\b/,
  /\bimport.*\{.*global.*\}.*from.*styled-jsx\b/,

  // linaria
  /\bimport.*styled.*from.*@linaria\/core\b/,
  /\bimport.*\{.*css.*\}.*from.*@linaria\/core\b/,
  /\bimport.*\{.*keyframes.*\}.*from.*@linaria\/core\b/,

  // jss
  /\bimport.*\{.*createUseStyles.*\}.*from.*react-jss\b/,
  /\bimport.*\{.*createUseStyles.*\}.*from.*jss\b/,
  /\bimport.*\{.*withStyles.*\}.*from.*react-jss\b/,

  // aphrodite
  /\bimport.*\{.*StyleSheet.*\}.*from.*aphrodite\b/,
  /\bimport.*\{.*css.*\}.*from.*aphrodite\b/,

  // glamor
  /\bimport.*\{.*css.*\}.*from.*glamor\b/,
  /\bimport.*\{.*style.*\}.*from.*glamor\b/,

  // styletron
  /\bimport.*\{.*styled.*\}.*from.*styletron-react\b/,
  /\bimport.*\{.*createStyled.*\}.*from.*styletron-react\b/,

  // goober
  /\bimport.*styled.*from.*goober\b/,
  /\bimport.*\{.*styled.*\}.*from.*goober\b/,

  // stitches
  /\bimport.*\{.*styled.*\}.*from.*@stitches\/react\b/,
  /\bimport.*\{.*createCss.*\}.*from.*@stitches\/core\b/,

  // vanilla-extract
  /\bimport.*\{.*style.*\}.*from.*@vanilla-extract\/css\b/,
  /\bimport.*\{.*createTheme.*\}.*from.*@vanilla-extract\/css\b/,

  // Common CSS-in-JS patterns
  /\bcss\s*`\s*.*?\s*`/,
  /\bstyled\s*\(/,
  /\bkeyframes\s*\(/,
]

export async function getComponentComplexity(
  filePath: string
): Promise<ComponentComplexity> {
  try {
    const content = await readFile(filePath, 'utf-8')
    const fileName = basename(filePath)
    const directory = dirname(filePath)

    // Basic metrics
    const lines = content.split('\n')
    const linesOfCode = lines.length
    const nonEmptyLines = lines.filter((line) => line.trim().length > 0).length

    // Analyze hooks
    const hooks = analyzeHooks(content)

    // Analyze dependencies
    const dependencies = analyzeDependencies(content)

    // Analyze patterns
    const patterns: ComplexityPattern[] = []
    if (AUTH_PATTERNS.some((pattern) => pattern.test(content))) {
      patterns.push('auth')
    }
    if (DATA_FETCHING_PATTERNS.some((pattern) => pattern.test(content))) {
      patterns.push('data-fetching')
    }
    if (ROUTER_PATTERNS.some((pattern) => pattern.test(content))) {
      patterns.push('router')
    }
    if (ASYNC_PATTERNS.some((pattern) => pattern.test(content))) {
      patterns.push('async-operations')
    }
    if (ERROR_HANDLING_PATTERNS.some((pattern) => pattern.test(content))) {
      patterns.push('error-handling')
    }
    if (STATE_MANAGEMENT_PATTERNS.some((pattern) => pattern.test(content))) {
      patterns.push('state-management')
    }
    if (CONTEXT_PATTERNS.some((pattern) => pattern.test(content))) {
      patterns.push('context-usage')
    }
    if (CSS_IN_JS_PATTERNS.some((pattern) => pattern.test(content))) {
      patterns.push('css-in-js')
    }

    // Classify component
    const classification = classifyComponent(filePath, fileName)
    const { isDesignSystem, isPage, isFeature, componentType } = classification

    // Calculate complexity score
    const scoreBreakdown = calculateScoreBreakdown({
      linesOfCode,
      nonEmptyLines,
      hooks,
      dependencies,
      patterns,
      isDesignSystem,
      isPage,
      isFeature,
    })

    const complexityScore = Math.min(
      100,
      Math.round(
        scoreBreakdown.locScore +
          scoreBreakdown.hooksScore +
          scoreBreakdown.dependenciesScore +
          scoreBreakdown.patternsScore +
          scoreBreakdown.classificationScore
      )
    )

    // Determine complexity type based on score
    let complexityType: ComponentComplexity['complexityType']
    if (complexityScore <= 25) {
      complexityType = 'simple'
    } else if (complexityScore <= 50) {
      complexityType = 'medium'
    } else if (complexityScore <= 75) {
      complexityType = 'high'
    } else {
      complexityType = 'ultra'
    }

    // Calculate top complexity factors
    const complexityFactors = getTopComplexityFactors({
      scoreBreakdown,
      patterns,
      linesOfCode,
      hooksCount: hooks.count,
      dependenciesTotal: dependencies.total,
    })

    return {
      filePath,
      fileName,
      directory,
      linesOfCode,
      nonEmptyLines,
      hooks,
      dependencies,
      patterns,
      isDesignSystem,
      isPage,
      isFeature,
      componentType,
      complexityScore,
      complexityType,
      scoreBreakdown,
      complexityFactors,
    }
  } catch (error) {
    throw new Error(
      `Failed to analyze component complexity for ${filePath}: ${error}`
    )
  }
}

function analyzeHooks(content: string) {
  const hookNames = new Set<string>()

  for (const pattern of HOOK_PATTERNS) {
    const matches = content.match(pattern)
    if (matches) {
      matches.forEach((match) => {
        // Extract hook name from patterns like useState(, useEffect(, etc.
        const hookName = match.replace(/[(\s=]/g, '')
        if (hookName.startsWith('use')) {
          hookNames.add(hookName)
        }
      })
    }
  }

  const names = Array.from(hookNames)
  const count = names.length
  const hasCustomHooks = names.some(
    (name) =>
      !name.startsWith('useState') &&
      !name.startsWith('useEffect') &&
      !name.startsWith('useCallback') &&
      !name.startsWith('useMemo') &&
      !name.startsWith('useRef')
  )

  return { count, names, hasCustomHooks }
}

function analyzeDependencies(content: string) {
  const lines = content.split('\n')
  const importLines = lines.filter((line) => line.trim().startsWith('import'))

  const reactImports: string[] = []
  const thirdPartyImports: string[] = []
  let internalImports = 0

  for (const line of importLines) {
    // Handle different import patterns
    let importPath: string | null = null

    // ES6 import with from
    const fromMatch = line.match(/from\s+['"]([^'"]+)['"]/)
    if (fromMatch) {
      importPath = fromMatch[1]
    } else {
      // CSS imports or other import patterns
      const pathMatch = line.match(/import\s+['"]([^'"]+)['"]/)
      if (pathMatch) {
        importPath = pathMatch[1]
      }
    }

    if (importPath) {
      if (
        importPath.startsWith('react') ||
        importPath.startsWith('@types/react')
      ) {
        reactImports.push(importPath)
      } else if (importPath.startsWith('.') || importPath.startsWith('/')) {
        internalImports++
      } else {
        thirdPartyImports.push(importPath)
      }
    }
  }

  return {
    total: reactImports.length + thirdPartyImports.length + internalImports,
    external: thirdPartyImports.length,
    internal: internalImports,
    reactImports,
    thirdPartyImports,
  }
}

function classifyComponent(filePath: string, fileName: string) {
  const fileNameLower = fileName.toLowerCase()
  const pathLower = filePath.toLowerCase()

  const isDesignSystem = DESIGN_SYSTEM_NAMES.some(
    (name) =>
      fileNameLower.includes(name) &&
      !fileNameLower.includes('page') &&
      !fileNameLower.includes('screen')
  )

  const isPage = PAGE_NAMES.some((name) => fileNameLower.includes(name))

  const isFeature = FEATURE_INDICATORS.some((indicator) =>
    pathLower.includes(indicator)
  )

  let componentType: ComponentComplexity['componentType'] = 'unknown'
  if (isDesignSystem) {
    componentType = 'design-system'
  } else if (isPage) {
    componentType = 'page'
  } else if (isFeature) {
    componentType = 'feature'
  } else if (
    fileNameLower.includes('util') ||
    fileNameLower.includes('helper')
  ) {
    componentType = 'utility'
  }

  return { isDesignSystem, isPage, isFeature, componentType }
}

function calculateScoreBreakdown(factors: {
  linesOfCode: number
  nonEmptyLines: number
  hooks: { count: number; hasCustomHooks: boolean }
  dependencies: { total: number; external: number }
  patterns: ComplexityPattern[]
  isDesignSystem: boolean
  isPage: boolean
  isFeature: boolean
}) {
  // LOC score (0-20): More lines = higher complexity
  const locScore = Math.min(20, Math.floor(factors.nonEmptyLines / 10))

  // Hooks score (0-15): More hooks = higher complexity, custom hooks add more
  const hooksScore = Math.min(
    15,
    factors.hooks.count * 2 + (factors.hooks.hasCustomHooks ? 3 : 0)
  )

  // Dependencies score (0-15): More dependencies = higher complexity
  const dependenciesScore = Math.min(15, factors.dependencies.total * 1.5)

  // Patterns score (0-30): Various complexity indicators
  let patternsScore = 0
  for (const pattern of factors.patterns) {
    switch (pattern) {
      case 'auth':
        patternsScore += 5
        break
      case 'data-fetching':
        patternsScore += 5
        break
      case 'router':
        patternsScore += 3
        break
      case 'async-operations':
        patternsScore += 3
        break
      case 'error-handling':
        patternsScore += 2
        break
      case 'state-management':
        patternsScore += 4
        break
      case 'context-usage':
        patternsScore += 3
        break
      case 'css-in-js':
        patternsScore += 4 // CSS-in-JS solutions add complexity due to theming and runtime styling
        break
    }
  }

  // Classification score (0-20): Pages and features are generally more complex than design system components
  let classificationScore = 0
  if (factors.isDesignSystem) {
    classificationScore = 5 // Simpler components
  } else if (factors.isPage) {
    classificationScore = 15 // More complex
  } else if (factors.isFeature) {
    classificationScore = 12 // Moderately complex
  } else {
    classificationScore = 8
  } // Unknown/utility components

  return {
    locScore,
    hooksScore,
    dependenciesScore,
    patternsScore,
    classificationScore,
  }
}

function getTopComplexityFactors(factors: {
  scoreBreakdown: {
    locScore: number
    hooksScore: number
    dependenciesScore: number
    patternsScore: number
    classificationScore: number
  }
  patterns: ComplexityPattern[]
  linesOfCode: number
  hooksCount: number
  dependenciesTotal: number
}): string[] {
  const factorScores: Array<{ factor: string; score: number }> = []

  // Lines of code factor
  if (factors.linesOfCode > 50) {
    factorScores.push({
      factor: 'Large component size',
      score: factors.scoreBreakdown.locScore,
    })
  }

  // Hooks factor
  if (factors.hooksCount > 3) {
    factorScores.push({
      factor: 'Multiple hooks usage',
      score: factors.scoreBreakdown.hooksScore,
    })
  }

  // Dependencies factor
  if (factors.dependenciesTotal > 5) {
    factorScores.push({
      factor: 'High dependency count',
      score: factors.scoreBreakdown.dependenciesScore,
    })
  }

  // Individual pattern factors
  for (const pattern of factors.patterns) {
    switch (pattern) {
      case 'auth':
        factorScores.push({ factor: 'Authentication logic', score: 5 })
        break
      case 'data-fetching':
        factorScores.push({ factor: 'Data fetching operations', score: 5 })
        break
      case 'state-management':
        factorScores.push({ factor: 'State management', score: 4 })
        break
      case 'css-in-js':
        factorScores.push({ factor: 'CSS-in-JS styling', score: 4 })
        break
      case 'router':
        factorScores.push({ factor: 'Router integration', score: 3 })
        break
      case 'async-operations':
        factorScores.push({ factor: 'Async operations', score: 3 })
        break
      case 'context-usage':
        factorScores.push({ factor: 'Context usage', score: 3 })
        break
      case 'error-handling':
        factorScores.push({ factor: 'Error handling', score: 2 })
        break
    }
  }

  // Component classification factor
  if (factors.scoreBreakdown.classificationScore > 10) {
    const classificationFactors = {
      15: 'Page component',
      12: 'Feature component',
      8: 'Utility component',
      5: 'Design system component',
    }
    const factor = Object.entries(classificationFactors).find(
      ([score]) =>
        parseInt(score) === factors.scoreBreakdown.classificationScore
    )
    if (factor) {
      factorScores.push({
        factor: factor[1],
        score: factors.scoreBreakdown.classificationScore,
      })
    }
  }

  // Sort by score descending and return top factors (max 5)
  return factorScores
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
    .map((item) => item.factor)
}
