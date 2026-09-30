import { describe, expect, it } from 'vitest'
import { removeStorybookVitestPlugin } from './vitest'

describe('removeStorybookVitestPlugin', () => {
  it('removes storybook entry from existing workspace array', () => {
    const input = `
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
const dirname = typeof __dirname !== 'undefined' ? __dirname : path.dirname(fileURLToPath(import.meta.url));

// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    workspace: ['packages/*', {
      extends: true,
      plugins: [storybookTest({
        configDir: path.join(dirname, '.storybook')
      })],
      test: {
        name: 'storybook',
        browser: {
          enabled: true,
          headless: true,
          provider: 'playwright',
          instances: [{
            browser: 'chromium'
          }]
        }
      }
    }]
  }
});`

    const result = removeStorybookVitestPlugin(input)

    expect(result).not.toContain('storybookTest')
    expect(result).not.toContain('@storybook/addon-vitest')
    expect(result).not.toContain('dirname')
    expect(result).not.toContain('node:path')
    expect(result).not.toContain('node:url')
    expect(result).not.toContain('storybook.js.org')
    expect(result).toContain("workspace: ['packages/*']")
    expect(result).toContain('globals: true')
    expect(result).toContain("plugins: [react()]")
  })

  it('removes storybook entry from existing projects array', () => {
    const input = `
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
const dirname = typeof __dirname !== 'undefined' ? __dirname : path.dirname(fileURLToPath(import.meta.url));

// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    projects: ['packages/*', {some: 'config'}, {
      extends: true,
      plugins: [storybookTest({
        configDir: path.join(dirname, '.storybook')
      })],
      test: {
        name: 'storybook',
        browser: {
          enabled: true,
          headless: true,
          provider: 'playwright',
          instances: [{
            browser: 'chromium'
          }]
        }
      }
    }]
  }
});`

    const result = removeStorybookVitestPlugin(input)

    expect(result).not.toContain('storybookTest')
    expect(result).not.toContain('@storybook/addon-vitest')
    expect(result).toContain("projects: ['packages/*', {some: 'config'}]")
    expect(result).toContain('globals: true')
  })

  it('removes storybook entry that was wrapped (projects with extends: true)', () => {
    const input = `
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
const dirname = typeof __dirname !== 'undefined' ? __dirname : path.dirname(fileURLToPath(import.meta.url));

// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon

export default defineConfig({
  plugins: [react()],
  test: {
    projects: [{
      extends: true,
      test: {
        globals: true
      }
    }, {
      extends: true,
      plugins: [storybookTest({
        configDir: path.join(dirname, '.storybook')
      })],
      test: {
        name: 'storybook',
        browser: {
          enabled: true,
          headless: true,
          provider: 'playwright',
          instances: [{
            browser: 'chromium'
          }]
        }
      }
    }]
  }
});`

    const result = removeStorybookVitestPlugin(input)

    expect(result).not.toContain('storybookTest')
    expect(result).not.toContain('@storybook/addon-vitest')
    // The first project entry (wrapping original config) should remain
    expect(result).toContain('extends: true')
    expect(result).toContain('globals: true')
  })

  it('handles config without defineConfig (object notation)', () => {
    const input = `
import react from '@vitejs/plugin-react';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
const dirname = typeof __dirname !== 'undefined' ? __dirname : path.dirname(fileURLToPath(import.meta.url));

// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon

export default {
  plugins: [react()],
  test: {
    globals: true,
    workspace: ['packages/*', {
      extends: true,
      plugins: [storybookTest({
        configDir: path.join(dirname, '.storybook')
      })],
      test: {
        name: 'storybook',
        browser: {
          enabled: true,
          headless: true,
          provider: 'playwright',
          instances: [{
            browser: 'chromium'
          }]
        }
      }
    }]
  }
};`

    const result = removeStorybookVitestPlugin(input)

    expect(result).not.toContain('storybookTest')
    expect(result).not.toContain('@storybook/addon-vitest')
    expect(result).not.toContain('vitest/config')
    expect(result).toContain("workspace: ['packages/*']")
  })

  it('preserves path import when used elsewhere', () => {
    const input = `
import path from 'node:path';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
const dirname = typeof __dirname !== 'undefined' ? __dirname : path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  test: {
    workspace: ['packages/*', {
      extends: true,
      plugins: [storybookTest({
        configDir: path.join(dirname, '.storybook')
      })],
      test: {
        name: 'storybook',
        browser: { enabled: true, headless: true, provider: 'playwright', instances: [{ browser: 'chromium' }] }
      }
    }]
  }
});`

    const result = removeStorybookVitestPlugin(input)

    expect(result).not.toContain('storybookTest')
    // path import should remain because it's used in resolve.alias
    expect(result).toContain("import path from 'node:path'")
  })

  it('preserves fileURLToPath import when used elsewhere', () => {
    const input = `
import { fileURLToPath, URL } from 'node:url';
import { fileURLToPath } from 'node:url';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
const dirname = typeof __dirname !== 'undefined' ? __dirname : path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  test: {
    workspace: [{
      extends: true,
      plugins: [storybookTest({})],
      test: { name: 'storybook' }
    }]
  }
});`

    const result = removeStorybookVitestPlugin(input)

    expect(result).not.toContain('storybookTest')
    // The combined import should remain since fileURLToPath is used in resolve.alias
    expect(result).toContain('fileURLToPath')
  })

  it('handles vitest workspace file with defineWorkspace', () => {
    const input = `
import { defineWorkspace } from 'vitest/config';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
const dirname = typeof __dirname !== 'undefined' ? __dirname : path.dirname(fileURLToPath(import.meta.url));

// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon

export default defineWorkspace([
  'packages/*',
  {
    extends: true,
    plugins: [storybookTest({
      configDir: path.join(dirname, '.storybook')
    })],
    test: {
      name: 'storybook',
      browser: {
        enabled: true,
        headless: true,
        provider: 'playwright',
        instances: [{ browser: 'chromium' }]
      }
    }
  }
]);`

    const result = removeStorybookVitestPlugin(input)

    expect(result).not.toContain('storybookTest')
    expect(result).not.toContain('@storybook/addon-vitest')
    expect(result).not.toContain('dirname')
    expect(result).toContain("'packages/*'")
    expect(result).toContain('defineWorkspace')
  })

  it('handles vitest workspace file with plain array export', () => {
    const input = `
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
const dirname = typeof __dirname !== 'undefined' ? __dirname : path.dirname(fileURLToPath(import.meta.url));

// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon

export default [
  'packages/*',
  {
    extends: true,
    plugins: [storybookTest({
      configDir: path.join(dirname, '.storybook')
    })],
    test: {
      name: 'storybook',
      browser: {
        enabled: true,
        headless: true,
        provider: 'playwright',
        instances: [{ browser: 'chromium' }]
      }
    }
  }
];`

    const result = removeStorybookVitestPlugin(input)

    expect(result).not.toContain('storybookTest')
    expect(result).not.toContain('@storybook/addon-vitest')
    expect(result).toContain("'packages/*'")
  })

  it('handles vitest 4 format with playwright({})', () => {
    const input = `
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import { playwright } from '@vitest/browser-playwright';
const dirname = typeof __dirname !== 'undefined' ? __dirname : path.dirname(fileURLToPath(import.meta.url));

// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon

export default defineConfig({
  plugins: [react()],
  test: {
    workspace: ['packages/*', {
      extends: true,
      plugins: [storybookTest({
        configDir: path.join(dirname, '.storybook')
      })],
      test: {
        name: 'storybook',
        browser: {
          enabled: true,
          headless: true,
          provider: playwright({}),
          instances: [{
            browser: 'chromium'
          }]
        }
      }
    }]
  }
});`

    const result = removeStorybookVitestPlugin(input)

    expect(result).not.toContain('storybookTest')
    expect(result).not.toContain('@storybook/addon-vitest')
    expect(result).toContain("workspace: ['packages/*']")
  })

  it('handles config with mergeConfig', () => {
    const input = `
import { defineConfig, mergeConfig } from 'vitest/config';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
const dirname = typeof __dirname !== 'undefined' ? __dirname : path.dirname(fileURLToPath(import.meta.url));

// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon

export default mergeConfig(
  defineConfig({ plugins: [] }),
  defineConfig({
    test: {
      workspace: ['packages/*', {
        extends: true,
        plugins: [storybookTest({
          configDir: path.join(dirname, '.storybook')
        })],
        test: {
          name: 'storybook',
          browser: { enabled: true, headless: true, provider: 'playwright', instances: [{ browser: 'chromium' }] }
        }
      }]
    }
  })
);`

    const result = removeStorybookVitestPlugin(input)

    expect(result).not.toContain('storybookTest')
    expect(result).not.toContain('@storybook/addon-vitest')
    expect(result).toContain("workspace: ['packages/*']")
  })

  it('does not modify content without storybook vitest plugin', () => {
    const input = `
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
  },
});`

    const result = removeStorybookVitestPlugin(input)
    expect(result).toBe(input)
  })

  it('cleans up consecutive blank lines', () => {
    const input = `
import { defineConfig } from 'vite';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';

// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon

export default defineConfig({
  test: {
    workspace: [{
      extends: true,
      plugins: [storybookTest({})],
      test: { name: 'storybook' }
    }]
  }
});`

    const result = removeStorybookVitestPlugin(input)

    // Should not have more than 2 consecutive newlines
    expect(result).not.toMatch(/\n{3,}/)
    expect(result).not.toContain('storybookTest')
  })

  it('handles storybook entry as the only project in the array', () => {
    const input = `
import { defineConfig } from 'vite';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
const dirname = typeof __dirname !== 'undefined' ? __dirname : path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [],
  test: {
    workspace: [{
      extends: true,
      plugins: [storybookTest({
        configDir: path.join(dirname, '.storybook')
      })],
      test: {
        name: 'storybook',
        browser: { enabled: true, headless: true, provider: 'playwright', instances: [{ browser: 'chromium' }] }
      }
    }]
  }
});`

    const result = removeStorybookVitestPlugin(input)

    expect(result).not.toContain('storybookTest')
    expect(result).not.toContain('@storybook/addon-vitest')
    expect(result).not.toContain('dirname')
    expect(result).toContain('workspace: []')
  })

  it('handles config exported via const variable', () => {
    const input = `
import { defineConfig } from 'vite';
import viteReact from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'url';
import path from 'node:path';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
const dirname = typeof __dirname !== 'undefined' ? __dirname : path.dirname(fileURLToPath(import.meta.url));

// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon

const config = defineConfig({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  plugins: [viteReact()],
  test: {
    projects: [{
      extends: true,
      plugins: [storybookTest({
        configDir: path.join(dirname, '.storybook')
      })],
      test: {
        name: 'storybook',
        browser: {
          enabled: true,
          headless: true,
          provider: 'playwright',
          instances: [{ browser: 'chromium' }]
        }
      }
    }]
  }
});

export default config;`

    const result = removeStorybookVitestPlugin(input)

    expect(result).not.toContain('storybookTest')
    expect(result).not.toContain('@storybook/addon-vitest')
    // fileURLToPath is still used in resolve.alias via the 'url' import
    expect(result).toContain("import { fileURLToPath, URL } from 'url'")
    expect(result).toContain('export default config')
  })
})
