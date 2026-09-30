import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import {
  findLintConfigsWithStorybook,
  removeStorybookFromLintConfig,
} from './lint'

describe('findLintConfigsWithStorybook', () => {
  let dir: string

  beforeEach(() => {
    dir = fs.mkdtempSync(path.join(os.tmpdir(), 'sb-utils-lint-'))
  })

  afterEach(() => {
    fs.rmSync(dir, { recursive: true, force: true })
  })

  function write(name: string, content: string): string {
    const file = path.join(dir, name)
    fs.writeFileSync(file, content)
    return file
  }

  it('matches oxlint, flat eslint, and legacy eslint filenames that reference storybook', () => {
    const oxlint = write(
      '.oxlintrc.json',
      '{ "jsPlugins": ["eslint-plugin-storybook"] }',
    )
    const flat = write(
      'eslint.config.js',
      `import storybook from 'eslint-plugin-storybook';`,
    )
    const legacy = write(
      '.eslintrc.json',
      '{ "extends": "plugin:storybook/recommended" }',
    )

    const result = findLintConfigsWithStorybook([oxlint, flat, legacy])
    expect(result.sort()).toEqual([oxlint, flat, legacy].sort())
  })

  it('ignores files that are not lint configs, even if they mention storybook', () => {
    const viteConfig = write(
      'vite.config.ts',
      `import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';`,
    )
    const randomJson = write('random.json', '{ "storybook": true }')

    const result = findLintConfigsWithStorybook([viteConfig, randomJson])
    expect(result).toEqual([])
  })

  it('ignores lint configs with no storybook reference', () => {
    const oxlint = write(
      '.oxlintrc.json',
      '{ "rules": { "react/react-in-jsx-scope": "off" } }',
    )
    const flat = write(
      'eslint.config.js',
      `import js from '@eslint/js'; export default [js.configs.recommended];`,
    )

    const result = findLintConfigsWithStorybook([oxlint, flat])
    expect(result).toEqual([])
  })

  it('ignores lint configs that do not exist on disk', () => {
    const result = findLintConfigsWithStorybook([
      path.join(dir, '.oxlintrc.json'),
      path.join(dir, 'eslint.config.js'),
    ])
    expect(result).toEqual([])
  })
})

describe('removeStorybookFromLintConfig — oxlint', () => {
  it('handles the full real-world fixture', () => {
    const input = `{
  "$schema": "./node_modules/oxlint/configuration_schema.json",
  "plugins": ["typescript", "react"],
  "jsPlugins": ["eslint-plugin-storybook"],
  "rules": { "react/react-in-jsx-scope": "off" },
  "overrides": [
    { "files": ["**/*.stories.{ts,tsx}"], "rules": { "react-hooks/rules-of-hooks": "off", "storybook/await-interactions": "error", "storybook/default-exports": "error" } },
    { "files": [".storybook/main.{js,ts}"], "rules": { "storybook/no-uninstalled-addons": "error" } }
  ]
}
`
    const result = removeStorybookFromLintConfig('.oxlintrc.json', input)
    const parsed = JSON.parse(result)

    expect(parsed.jsPlugins).toBeUndefined()
    expect(parsed.overrides).toHaveLength(1)
    expect(parsed.overrides[0].rules).toEqual({
      'react-hooks/rules-of-hooks': 'off',
    })
    expect(parsed.rules).toEqual({ 'react/react-in-jsx-scope': 'off' })
    expect(result.endsWith('\n')).toBe(true)
    expect(result).toContain('  "$schema"') // 2-space indent preserved
  })

  it('removes jsPlugins entry when there are no storybook rules', () => {
    const input = `{
  "jsPlugins": ["eslint-plugin-storybook"],
  "rules": { "react/react-in-jsx-scope": "off" }
}
`
    const result = removeStorybookFromLintConfig('.oxlintrc.json', input)
    const parsed = JSON.parse(result)

    expect(parsed.jsPlugins).toBeUndefined()
    expect(parsed.rules).toEqual({ 'react/react-in-jsx-scope': 'off' })
  })

  it('drops all overrides when every one becomes empty', () => {
    const input = `{
  "overrides": [
    { "files": ["a"], "rules": { "storybook/await-interactions": "error" } },
    { "files": ["b"], "rules": { "storybook/default-exports": "error" } }
  ]
}
`
    const result = removeStorybookFromLintConfig('.oxlintrc.json', input)
    const parsed = JSON.parse(result)

    expect(parsed.overrides).toEqual([])
  })

  it('returns content unchanged when JSON is invalid', () => {
    const input = `{
  "jsPlugins": ["eslint-plugin-storybook"],
  // a comment that makes this invalid JSON
}
`
    const result = removeStorybookFromLintConfig('.oxlintrc.json', input)
    expect(result).toBe(input)
  })
})

describe('removeStorybookFromLintConfig — eslint flat config', () => {
  it('removes the default import and spread entry from an export default array', () => {
    const input = `import js from '@eslint/js';
import storybook from 'eslint-plugin-storybook';

export default [
  js.configs.recommended,
  ...storybook.configs['flat/recommended'],
  {
    rules: {
      'no-console': 'off',
    },
  },
];
`
    const result = removeStorybookFromLintConfig('eslint.config.js', input)

    expect(result).not.toContain('eslint-plugin-storybook')
    expect(result).not.toContain('storybook.configs')
    expect(result).toContain('js.configs.recommended')
    expect(result).toContain("'no-console': 'off'")
  })

  it('removes only the storybook lines from a real-world config, preserving indentation and trailing commas', () => {
    const input = `import globals from 'globals'
import pluginJs from '@eslint/js'
import pluginStorybook from 'eslint-plugin-storybook'
import pluginPrettier from 'eslint-plugin-prettier/recommended'

/** @type {import('eslint').Linter.Config[]} */
export default [
  pluginPrettier,
  ...pluginStorybook.configs['flat/recommended'],
  {
    files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'],
    ignores: [
      'node_modules',
      '!.storybook',
    ],
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
    },
  },
  pluginJs.configs.recommended,
]
`
    const result = removeStorybookFromLintConfig('eslint.config.js', input)

    expect(result).toBe(`import globals from 'globals'
import pluginJs from '@eslint/js'
import pluginPrettier from 'eslint-plugin-prettier/recommended'

/** @type {import('eslint').Linter.Config[]} */
export default [
  pluginPrettier,
  {
    files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'],
    ignores: [
      'node_modules',
      '!.storybook',
    ],
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
    },
  },
  pluginJs.configs.recommended,
]
`)
  })

  it('removes the import and spread entry inside a defineConfig([...]) wrapper', () => {
    const input = `import { defineConfig } from 'eslint/config';
import storybook from 'eslint-plugin-storybook';
import js from '@eslint/js';

export default defineConfig([
  js.configs.recommended,
  ...storybook.configs['flat/recommended'],
  {
    rules: {
      'no-unused-vars': 'warn',
    },
  },
]);
`
    const result = removeStorybookFromLintConfig('eslint.config.mjs', input)

    expect(result).not.toContain('eslint-plugin-storybook')
    expect(result).not.toContain('storybook.configs')
    expect(result).toContain('defineConfig([')
    expect(result).toContain('js.configs.recommended')
    expect(result).toContain("'no-unused-vars': 'warn'")
  })

  it('removes a require()-based import and inline spread', () => {
    const input = `const storybook = require('eslint-plugin-storybook');

module.exports = [...storybook.configs['flat/recommended'], { rules: {} }];
`
    const result = removeStorybookFromLintConfig('eslint.config.cjs', input)

    expect(result).not.toContain('eslint-plugin-storybook')
    expect(result).not.toContain('storybook.configs')
    expect(result).toContain('module.exports')
  })

  it('removes a standalone plugins-only element', () => {
    const input = `import storybook from 'eslint-plugin-storybook';

export default [
  { plugins: { storybook } },
  { rules: { 'no-console': 'off' } },
];
`
    const result = removeStorybookFromLintConfig('eslint.config.js', input)

    expect(result).not.toContain('eslint-plugin-storybook')
    expect(result).not.toContain('plugins: { storybook }')
    expect(result).toContain("'no-console': 'off'")
  })

  it('leaves content unchanged when there is no storybook import', () => {
    const input = `import js from '@eslint/js';

export default [js.configs.recommended];
`
    const result = removeStorybookFromLintConfig('eslint.config.js', input)
    expect(result).toBe(input)
  })
})

describe('removeStorybookFromLintConfig — legacy .eslintrc.json', () => {
  it('removes a string extends value', () => {
    const input = `{
  "extends": "plugin:storybook/recommended"
}
`
    const result = removeStorybookFromLintConfig('.eslintrc.json', input)
    const parsed = JSON.parse(result)
    expect(parsed.extends).toBeUndefined()
  })

  it('removes a storybook entry from an array extends, keeping the rest', () => {
    const input = `{
  "extends": ["eslint:recommended", "plugin:storybook/recommended"]
}
`
    const result = removeStorybookFromLintConfig('.eslintrc.json', input)
    const parsed = JSON.parse(result)
    expect(parsed.extends).toEqual(['eslint:recommended'])
  })

  it('deletes extends entirely when it becomes empty', () => {
    const input = `{
  "extends": ["plugin:storybook/recommended"]
}
`
    const result = removeStorybookFromLintConfig('.eslintrc.json', input)
    const parsed = JSON.parse(result)
    expect(parsed.extends).toBeUndefined()
  })

  it('removes storybook from plugins and cleans storybook rules', () => {
    const input = `{
  "plugins": ["react", "storybook"],
  "rules": {
    "react/jsx-uses-react": "off",
    "storybook/await-interactions": "error"
  }
}
`
    const result = removeStorybookFromLintConfig('.eslintrc.json', input)
    const parsed = JSON.parse(result)
    expect(parsed.plugins).toEqual(['react'])
    expect(parsed.rules).toEqual({ 'react/jsx-uses-react': 'off' })
  })

  it('drops overrides that become empty', () => {
    const input = `{
  "overrides": [
    { "files": ["*.stories.tsx"], "rules": { "storybook/default-exports": "error" } }
  ]
}
`
    const result = removeStorybookFromLintConfig('.eslintrc.json', input)
    const parsed = JSON.parse(result)
    expect(parsed.overrides).toEqual([])
  })

  it('returns content unchanged when JSON is invalid', () => {
    const input = `{ "extends": "plugin:storybook/recommended", }`
    const result = removeStorybookFromLintConfig('.eslintrc.json', input)
    expect(result).toBe(input)
  })
})

describe('removeStorybookFromLintConfig — legacy .eslintrc.js/.yml', () => {
  it('drops self-contained lines referencing storybook', () => {
    const input = `module.exports = {
  extends: ['eslint:recommended', 'plugin:storybook/recommended'],
  rules: {
    'react/jsx-uses-react': 'off',
    'storybook/await-interactions': 'error',
  },
};
`
    const result = removeStorybookFromLintConfig('.eslintrc.js', input)
    expect(result).not.toContain('plugin:storybook/recommended')
    expect(result).not.toContain('storybook/await-interactions')
    expect(result).toContain("'react/jsx-uses-react': 'off'")
  })

  it('leaves content unchanged when nothing is safely removable', () => {
    const input = `module.exports = {
  extends: ['eslint:recommended', require('./storybook-extends')],
};
`
    const result = removeStorybookFromLintConfig('.eslintrc.js', input)
    expect(result).toBe(input)
  })
})
