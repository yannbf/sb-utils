import { expect, test, describe, vi, beforeEach } from 'vitest'
import { getComponentComplexity } from '../src/utils/component-complexity'
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
