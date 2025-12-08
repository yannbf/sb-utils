import { getComponentComplexity } from '../utils/component-complexity.js'
export { getComponentComplexity } from '../utils/component-complexity.js'

export async function analyzeComponent({
  filePath,
}: {
  filePath: string
}): Promise<void> {
  try {
    console.log(`Analyzing component complexity for: ${filePath}\n`)

    const complexity = await getComponentComplexity(filePath)

    console.log('📊 Component Complexity Analysis')
    console.log('='.repeat(50))

    console.log(`File: ${complexity.fileName}`)
    console.log(`Directory: ${complexity.directory}`)

    console.log(`\n🏷️  Classification: ${complexity.componentType}`)

    console.log('\n📏 Basic Metrics:')
    console.log(`  Lines of code: ${complexity.linesOfCode}`)
    console.log(`  Non-empty lines: ${complexity.nonEmptyLines}`)

    if (complexity.hooks.count > 0) {
      console.log('\n🪝 Hooks:')
      console.log(`  Count: ${complexity.hooks.count}`)
      console.log(
        `  Custom hooks: ${complexity.hooks.hasCustomHooks ? 'Yes' : 'No'}`
      )
      if (complexity.hooks.names.length > 0) {
        console.log(`  Hook names: ${complexity.hooks.names.join(', ')}`)
      }
    }

    if (complexity.dependencies.total > 0) {
      console.log('\n📦 Dependencies:')
      console.log(`  Total: ${complexity.dependencies.total}`)
      console.log(`  External: ${complexity.dependencies.external}`)
      console.log(`  Internal: ${complexity.dependencies.internal}`)
      if (complexity.dependencies.reactImports.length > 0) {
        console.log(
          `  React imports: ${complexity.dependencies.reactImports.join(', ')}`
        )
      }
      if (complexity.dependencies.thirdPartyImports.length > 0) {
        console.log(
          `  Third-party: ${complexity.dependencies.thirdPartyImports.join(
            ', '
          )}`
        )
      }
    }

    if (complexity.patterns.length > 0) {
      console.log('\n🔍 Patterns Detected:')
      console.log(`  ${complexity.patterns.join(', ')}`)
    }

    console.log('\n📈 Complexity Score:')
    console.log(`  Overall score: ${complexity.complexityScore}/100`)

    console.log('\nScore Breakdown:')
    console.log(`  LOC score: ${complexity.scoreBreakdown.locScore}/20`)
    console.log(`  Hooks score: ${complexity.scoreBreakdown.hooksScore}/15`)
    console.log(
      `  Dependencies score: ${complexity.scoreBreakdown.dependenciesScore}/15`
    )
    console.log(
      `  Patterns score: ${complexity.scoreBreakdown.patternsScore}/30`
    )
    console.log(
      `  Classification score: ${complexity.scoreBreakdown.classificationScore}/20`
    )

    // Complexity interpretation
    let complexityLevel = 'Low'
    if (complexity.complexityScore >= 70) {
      complexityLevel = 'High'
    } else if (complexity.complexityScore >= 40) {
      complexityLevel = 'Medium'
    }

    console.log(`\nComplexity Level: ${complexityLevel}`)
    if (complexity.complexityFactors.length > 0) {
      console.log(
        `\nComplexity Factors: ${complexity.complexityFactors.join(', ')}`
      )
    }
  } catch (error) {
    console.error('Error analyzing component:', error)
    process.exit(1)
  }
}

// Allow running directly as a script
if (import.meta.url === `file://${process.argv[1]}`) {
  analyzeComponent({ filePath: process.argv[2] })
}
