import { expect, test, describe, vi, beforeEach } from 'vitest'
import { getComponentComplexity } from './get-component-complexity'
// @ts-ignore
import { readFile } from 'node:fs/promises'

vi.mock('node:fs/promises')

describe('getComponentComplexity', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  test('analyzes a simple React component correctly', async () => {
    const componentCode = `
      import React, { useState } from 'react'
      import { styled } from 'styled-components'

      interface Props {
        title: string
        onClick?: () => void
      }

      export const Button: React.FC<Props> = ({ title, onClick }) => {
        const [count, setCount] = useState(0)

        return (
          <Container>
            <h1>{title}</h1>
            <button onClick={onClick}>Click me</button>
            <p>Count: {count}</p>
          </Container>
        )
      }

      const Container = styled.div\`
        padding: 20px;
        border: 1px solid #ccc;
      \`
      `

    vi.mocked(readFile).mockResolvedValue(componentCode)

    const result = await getComponentComplexity('/components/Button.tsx')
    const { low, high } = result.features

    // Basic file info
    expect(low.meta.fileName).toBe('Button.tsx')
    expect(low.metrics.totalLines).toBeGreaterThan(10)
    expect(low.metrics.nonEmptyLines).toBeGreaterThan(5)
    expect(low.metrics.nonEmptyRuntimeLines).toBeGreaterThan(0)
    expect(low.metrics.nonEmptyRuntimeLines).toBeLessThanOrEqual(
      low.metrics.nonEmptyLines
    )

    // Hooks analysis
    expect(low.hooks.count).toBe(1)
    expect(low.hooks.names).toContain('useState')
    expect(high.hasCustomHooks).toBe(false)

    // Dependencies
    expect(low.imports.total).toBeGreaterThan(0)
    expect(low.imports.react).toContain('react')
    expect(low.imports.external).toContain('styled-components')

    // Patterns
    expect(low.patternCounts.CSS_IN_JS).toBeGreaterThan(0) // Should detect styled-components usage
    expect(low.patternCounts.STATE_MANAGEMENT).toBe(0) // useState alone doesn't count as state management
    expect(high.hasAuthIntegration).toBe(false)
    expect(high.hasDataFetching).toBe(false)

    // Classification
    expect(result.type).toBe('design-system') // "Button.tsx" -> design system
    expect(typeof result.score).toBe('number')
    expect(result.score).toBeGreaterThanOrEqual(0)
    expect(result.score).toBeLessThanOrEqual(100)

    // Score breakdown
    expect(result.breakdown).toBeDefined()
    expect(result.breakdown.locScore).toBeGreaterThanOrEqual(0)
    expect(result.breakdown.hooksScore).toBeGreaterThanOrEqual(0)
    expect(result.breakdown.dependenciesScore).toBeGreaterThanOrEqual(0)
    expect(result.breakdown.patternsScore).toBeGreaterThanOrEqual(0)
    expect(result.breakdown.classificationScore).toBeGreaterThanOrEqual(0)

    expect(result).toMatchInlineSnapshot(`
      {
        "breakdown": {
          "classificationScore": 5,
          "dependenciesScore": 2,
          "hooksScore": 3,
          "locScore": 0,
          "patternsScore": 5,
        },
        "factors": [
          "CSS-in-JS styling",
          "Design system component",
        ],
        "features": {
          "high": {
            "dimensions": {
              "coupling": 2,
              "integration": 0,
              "logic": 2,
              "size": 1,
            },
            "hasAuthIntegration": false,
            "hasComplexState": false,
            "hasCustomHooks": false,
            "hasDataFetching": false,
            "hasRouting": false,
            "isDesignSystemCandidate": true,
            "isFeatureCandidate": false,
            "isPageCandidate": false,
          },
          "low": {
            "hooks": {
              "count": 1,
              "names": [
                "useState",
              ],
            },
            "imports": {
              "external": [
                "styled-components",
              ],
              "internal": [],
              "react": [
                "react",
              ],
              "total": 2,
            },
            "meta": {
              "directory": "/components",
              "fileName": "Button.tsx",
              "filePath": "/components/Button.tsx",
            },
            "metrics": {
              "nonEmptyLines": 20,
              "nonEmptyRuntimeLines": 16,
              "totalLines": 26,
            },
            "patternCounts": {
              "ASYNC": 0,
              "AUTH": 0,
              "CONTEXT": 0,
              "CSS_IN_JS": 2,
              "DATA_FETCHING": 0,
              "ERROR_HANDLING": 0,
              "HOOKS": 1,
              "ROUTER": 0,
              "STATE_MANAGEMENT": 0,
            },
          },
        },
        "level": "simple",
        "modelConfig": {
          "CLASSIFICATION_BASE": {
            "DEFAULT": 8,
            "DESIGN_SYSTEM": 5,
            "FEATURE": 12,
            "PAGE": 15,
            "UTILITY": 6,
          },
          "CUSTOM_HOOK_BONUS": 2,
          "HOOKS_MAX_SCORE": 15,
          "HOOK_MULTIPLIER": 1.5,
          "IMPORT_DIVISOR": 1,
          "IMPORT_MAX_SCORE": 15,
          "LEVELS": {
            "HIGH": 75,
            "MEDIUM": 50,
            "SIMPLE": 25,
          },
          "LOC_DIVISOR": 60,
          "LOC_MAX_SCORE": 20,
          "PATTERN_MAX_SCORE": 30,
          "PATTERN_WEIGHTS": {
            "ASYNC": 3,
            "AUTH": 5,
            "CONTEXT": 3,
            "CSS_IN_JS": 4,
            "DATA_FETCHING": 5,
            "ERROR_HANDLING": 2,
            "HOOKS": 1,
            "ROUTER": 3,
            "STATE_MANAGEMENT": 4,
          },
        },
        "modelVersion": "1.0.0",
        "score": 15,
        "type": "design-system",
      }
    `)
  })

  test('does not treat type-heavy files as large components (runtime LOC excludes type/interface blocks)', async () => {
    const tinyRuntime = `
      import React from 'react'

      type SomeProps = {
        a: string
        b: number
        c: boolean
        d: string[]
        e: {
          f: string
          g: number
          h: boolean
          i: string[]
          j: {
            k: string
            l: number
            m: boolean
          }
        }
      }

      interface SomeProps extends OtherProps {
        a: string
        b: number
        c: boolean
        d: string[]
        e: {
          f: string
          g: number
          h: boolean
          i: string[]
          j: {
            k: string
            l: number
            m: boolean
          }
        }
      }

      export const Tiny: React.FC = () => {
        return <div>ok</div>
      }
    `

    vi.mocked(readFile).mockResolvedValue(tinyRuntime)

    const result = await getComponentComplexity('/components/Tiny.tsx')
    const { low } = result.features

    expect(low.metrics.totalLines).toBe(43)
    expect(low.metrics.nonEmptyLines).toBe(38)
    expect(low.metrics.nonEmptyRuntimeLines).toBe(4)

    expect(result.factors).not.toContain('Large component size')
  })

  test('analyzes a complex component with multiple patterns', async () => {
    const complexComponentCode = `
      import React, { useState, useEffect, useContext } from 'react'
      import { useRouter } from 'next/router'
      import { useQuery } from '@tanstack/react-query'
      import { AuthContext } from '../contexts/AuthContext'
      import { api } from '../services/api'
      import styled from 'styled-components'

      interface ComplexComponentProps {
        userId: string
        onSuccess: (data: any) => void
      }

      export const ComplexComponent: React.FC<ComplexComponentProps> = ({
        userId,
        onSuccess
      }) => {
        const [data, setData] = useState(null)
        const [loading, setLoading] = useState(true)
        const [error, setError] = useState<string | null>(null)

        const router = useRouter()
        const { user, isAuthenticated } = useContext(AuthContext)

        const { data: fetchedData, isLoading, error: queryError } = useQuery({
          queryKey: ['user', userId],
          queryFn: () => api.getUser(userId),
          enabled: !!userId && isAuthenticated
        })

        useEffect(() => {
          if (fetchedData) {
            setData(fetchedData)
            setLoading(false)
            onSuccess(fetchedData)
          }
        }, [fetchedData, onSuccess])

        useEffect(() => {
          if (queryError) {
            setError('Failed to fetch user data')
            setLoading(false)
          }
        }, [queryError])

        const handleRetry = async () => {
          try {
            setError(null)
            setLoading(true)
            const result = await api.getUser(userId)
            setData(result)
            setLoading(false)
          } catch (err) {
            setError('Retry failed')
            setLoading(false)
          }
        }

        if (!isAuthenticated) {
          router.push('/login')
          return null
        }

        return (
          <Container>
            {loading && <div>Loading...</div>}
            {error && (
              <ErrorContainer>
                <p>{error}</p>
                <button onClick={handleRetry}>Retry</button>
              </ErrorContainer>
            )}
            {data && <UserData data={data} />}
          </Container>
        )
      }

      const Container = styled.div\`
        padding: 20px;
      \`

      const ErrorContainer = styled.div\`
        color: red;
        border: 1px solid red;
        padding: 10px;
        margin: 10px 0;
      \`

      const UserData = styled.div\`
        background: #f5f5f5;
        padding: 15px;
        border-radius: 4px;
      \`
      `

    vi.mocked(readFile).mockResolvedValue(complexComponentCode)

    const result = await getComponentComplexity('/path/to/ComplexComponent.tsx')
    const { low, high } = result.features

    // Should detect multiple patterns (High level booleans or low level counts)
    expect(high.hasAuthIntegration).toBe(true)
    expect(high.hasDataFetching).toBe(true)
    expect(high.hasRouting).toBe(true)

    expect(low.patternCounts.ASYNC).toBeGreaterThan(0)
    expect(low.patternCounts.ERROR_HANDLING).toBeGreaterThan(0)
    expect(low.patternCounts.STATE_MANAGEMENT).toBeGreaterThan(0) // useContext is counted here
    expect(low.patternCounts.CONTEXT).toBeGreaterThan(0)
    expect(low.patternCounts.CSS_IN_JS).toBeGreaterThan(0)

    // Should have higher complexity score due to multiple patterns
    expect(result.score).toBeGreaterThan(20)

    // Should detect multiple hooks
    expect(low.hooks.count).toBeGreaterThan(2)
    expect(low.hooks.names).toContain('useState')
    expect(low.hooks.names).toContain('useEffect')
    expect(low.hooks.names).toContain('useContext')

    // Should detect third-party dependencies
    expect(low.imports.external).toContain('@tanstack/react-query')
    expect(low.imports.external).toContain('next/router')
    expect(low.imports.external).toContain('styled-components')
  })
})
