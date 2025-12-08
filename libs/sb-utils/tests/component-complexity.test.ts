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

    expect(result).toMatchInlineSnapshot(`
      {
        "complexityFactors": [
          "CSS-in-JS styling",
        ],
        "complexityScore": 16,
        "complexityType": "simple",
        "componentType": "design-system",
        "dependencies": {
          "external": 1,
          "internal": 0,
          "reactImports": [
            "react",
          ],
          "thirdPartyImports": [
            "styled-components",
          ],
          "total": 2,
        },
        "directory": "/components",
        "fileName": "Button.tsx",
        "filePath": "/components/Button.tsx",
        "hooks": {
          "count": 1,
          "hasCustomHooks": false,
          "names": [
            "useState",
          ],
        },
        "isDesignSystem": true,
        "isFeature": false,
        "isPage": false,
        "linesOfCode": 26,
        "nonEmptyLines": 20,
        "patterns": [
          "css-in-js",
        ],
        "scoreBreakdown": {
          "classificationScore": 5,
          "dependenciesScore": 3,
          "hooksScore": 2,
          "locScore": 2,
          "patternsScore": 4,
        },
      }
    `)

    // Basic file info
    expect(result.fileName).toBe('Button.tsx')
    expect(result.linesOfCode).toBeGreaterThan(10)
    expect(result.nonEmptyLines).toBeGreaterThan(5)

    // Hooks analysis
    expect(result.hooks.count).toBe(1)
    expect(result.hooks.names).toContain('useState')
    expect(result.hooks.hasCustomHooks).toBe(false)

    // Dependencies
    expect(result.dependencies.total).toBeGreaterThan(0)
    expect(result.dependencies.reactImports).toContain('react')
    expect(result.dependencies.thirdPartyImports).toContain('styled-components')

    // Patterns
    expect(result.patterns).toContain('css-in-js') // Should detect styled-components usage
    expect(result.patterns).not.toContain('state-management') // useState alone doesn't count as state management
    expect(result.patterns).not.toContain('auth')
    expect(result.patterns).not.toContain('data-fetching')

    // Classification
    expect(result.componentType).toBeDefined()
    expect(typeof result.complexityScore).toBe('number')
    expect(result.complexityScore).toBeGreaterThanOrEqual(0)
    expect(result.complexityScore).toBeLessThanOrEqual(100)

    // Score breakdown
    expect(result.scoreBreakdown).toBeDefined()
    expect(result.scoreBreakdown.locScore).toBeGreaterThanOrEqual(0)
    expect(result.scoreBreakdown.hooksScore).toBeGreaterThanOrEqual(0)
    expect(result.scoreBreakdown.dependenciesScore).toBeGreaterThanOrEqual(0)
    expect(result.scoreBreakdown.patternsScore).toBeGreaterThanOrEqual(0)
    expect(result.scoreBreakdown.classificationScore).toBeGreaterThanOrEqual(0)
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

    expect(result).toMatchInlineSnapshot(`
      {
        "complexityFactors": [
          "Multiple hooks usage",
          "High dependency count",
          "Large component size",
          "Authentication logic",
          "Data fetching operations",
        ],
        "complexityScore": 69,
        "complexityType": "high",
        "componentType": "unknown",
        "dependencies": {
          "external": 3,
          "internal": 2,
          "reactImports": [
            "react",
          ],
          "thirdPartyImports": [
            "next/router",
            "@tanstack/react-query",
            "styled-components",
          ],
          "total": 6,
        },
        "directory": "/path/to",
        "fileName": "ComplexComponent.tsx",
        "filePath": "/path/to/ComplexComponent.tsx",
        "hooks": {
          "count": 6,
          "hasCustomHooks": true,
          "names": [
            "useState",
            "useState<string|null>",
            "useRouter",
            "useContext",
            "useQuery",
            "useEffect",
          ],
        },
        "isDesignSystem": false,
        "isFeature": false,
        "isPage": false,
        "linesOfCode": 94,
        "nonEmptyLines": 80,
        "patterns": [
          "auth",
          "data-fetching",
          "router",
          "async-operations",
          "error-handling",
          "state-management",
          "context-usage",
          "css-in-js",
        ],
        "scoreBreakdown": {
          "classificationScore": 8,
          "dependenciesScore": 9,
          "hooksScore": 15,
          "locScore": 8,
          "patternsScore": 29,
        },
      }
    `)

    // Should detect multiple patterns
    expect(result.patterns).toContain('auth')
    expect(result.patterns).toContain('data-fetching')
    expect(result.patterns).toContain('router')
    expect(result.patterns).toContain('async-operations')
    expect(result.patterns).toContain('error-handling')
    expect(result.patterns).toContain('state-management')
    expect(result.patterns).toContain('context-usage')
    expect(result.patterns).toContain('css-in-js')

    // Should have higher complexity score due to multiple patterns
    expect(result.complexityScore).toBeGreaterThan(20)

    // Should detect multiple hooks
    expect(result.hooks.count).toBeGreaterThan(2)
    expect(result.hooks.names).toContain('useState')
    expect(result.hooks.names).toContain('useEffect')
    expect(result.hooks.names).toContain('useContext')

    // Should detect third-party dependencies
    expect(result.dependencies.thirdPartyImports).toContain(
      '@tanstack/react-query'
    )
    expect(result.dependencies.thirdPartyImports).toContain('next/router')
    expect(result.dependencies.thirdPartyImports).toContain('styled-components')
  })
})
