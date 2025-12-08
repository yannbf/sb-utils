import { getComponentComplexity } from '../utils/component-complexity.js'
export {
  getComponentComplexity,
  type ComponentComplexity,
} from '../utils/component-complexity.js'

export async function runAnalyzeComponent({
  filePath,
}: {
  filePath: string
}): Promise<void> {
  try {
    console.log(`Analyzing component complexity for: ${filePath}\n`)

    const complexity = await getComponentComplexity(filePath)
    const { low, high } = complexity.features

    console.log('📊 Component Complexity Analysis')
    console.log('='.repeat(50))

    console.log(`File: ${low.meta.fileName}`)
    console.log(`Directory: ${low.meta.directory}`)

    console.log(`\n🏷️  Classification: ${complexity.type}`)

    console.log('\n📏 Basic Metrics:')
    console.log(`  Lines of code: ${low.metrics.totalLines}`)
    console.log(`  Non-empty lines: ${low.metrics.nonEmptyLines}`)

    if (low.hooks.count > 0) {
      console.log('\n🪝 Hooks:')
      console.log(`  Count: ${low.hooks.count}`)
      console.log(`  Custom hooks: ${high.hasCustomHooks ? 'Yes' : 'No'}`)
      if (low.hooks.names.length > 0) {
        console.log(`  Hook names: ${low.hooks.names.join(', ')}`)
      }
    }

    if (low.imports.total > 0) {
      console.log('\n📦 Dependencies:')
      console.log(`  Total: ${low.imports.total}`)
      console.log(`  External: ${low.imports.external.length}`)
      console.log(`  Internal: ${low.imports.internal.length}`)
      if (low.imports.react.length > 0) {
        console.log(`  React imports: ${low.imports.react.join(', ')}`)
      }
      if (low.imports.external.length > 0) {
        console.log(`  Third-party: ${low.imports.external.join(', ')}`)
      }
    }

    const activePatterns: string[] = []
    if (high.hasAuthIntegration) activePatterns.push('auth')
    if (high.hasDataFetching) activePatterns.push('data-fetching')
    if (high.hasRouting) activePatterns.push('router')
    if (low.patternCounts.ASYNC > 0) activePatterns.push('async-operations')
    if (low.patternCounts.ERROR_HANDLING > 0)
      activePatterns.push('error-handling')
    if (low.patternCounts.STATE_MANAGEMENT > 0)
      activePatterns.push('state-management')
    if (low.patternCounts.CONTEXT > 0) activePatterns.push('context-usage')
    if (low.patternCounts.CSS_IN_JS > 0) activePatterns.push('css-in-js')

    if (activePatterns.length > 0) {
      console.log('\n🔍 Patterns Detected:')
      console.log(`  ${activePatterns.join(', ')}`)
    }

    console.log('\n📈 Complexity Score:')
    console.log(`  Overall score: ${complexity.score}/100`)

    console.log('\nScore Breakdown:')
    console.log(`  LOC score: ${complexity.breakdown.locScore}/20`)
    console.log(`  Hooks score: ${complexity.breakdown.hooksScore}/15`)
    console.log(
      `  Dependencies score: ${complexity.breakdown.dependenciesScore}/15`
    )
    console.log(`  Patterns score: ${complexity.breakdown.patternsScore}/30`)
    console.log(
      `  Classification score: ${complexity.breakdown.classificationScore}/20`
    )

    // Complexity interpretation
    let complexityLevel = 'Low'
    if (complexity.score >= 70) {
      complexityLevel = 'High'
    } else if (complexity.score >= 40) {
      complexityLevel = 'Medium'
    }

    console.log(`\nComplexity Level: ${complexityLevel} (${complexity.level})`)
    if (complexity.factors.length > 0) {
      console.log(`\nComplexity Factors: ${complexity.factors.join(', ')}`)
    }
  } catch (error) {
    console.error('Error analyzing component:', error)
    process.exit(1)
  }
}

// Allow running directly as a script
if (import.meta.url === `file://${process.argv[1]}`) {
  runAnalyzeComponent({ filePath: process.argv[2] })
}
