import {
  intro,
  outro,
  note,
  log,
  spinner,
  multiselect,
  isCancel,
} from '@clack/prompts'
import { spawnSync } from 'child_process'
import fs from 'node:fs'
import path from 'node:path'
import {
  getProjectRoot,
  walk,
  getRelativePath,
  deleteDir,
  cleanPackageJson,
  deleteFile,
} from '../utils/file'
import {
  findVitestConfigsWithStorybook,
  removeStorybookVitestPlugin,
} from '../utils/vitest'
import { blue, grey } from '../utils/colors'

type Summary = {
  storybookDirs: string[]
  storyFiles: string[]
  packageChanges: Record<string, string[]>
  vitestConfigs: string[]
}

const summary: Summary = {
  storybookDirs: [],
  storyFiles: [],
  packageChanges: {},
  vitestConfigs: [],
}

type UninstallOptions = {
  yes: boolean
  keepStories: boolean
  keepStorybookDir: boolean
  vitestOnly: boolean
  storiesOnly: boolean
}

export async function uninstall(options: UninstallOptions): Promise<void> {
  intro('🧹 Storybook Uninstaller')

  const root = getProjectRoot()
  const allPaths = walk(root)
  const allDirs = allPaths
    .map((p) => path.dirname(p))
    .filter((v, i, arr) => arr.indexOf(v) === i)

  // Find all Storybook-related items
  const storybookDirs = allDirs.filter(
    (dir) =>
      path.basename(dir) === '.storybook' &&
      fs.existsSync(dir) &&
      fs.statSync(dir).isDirectory(),
  )

  const storyFiles = allPaths.filter((file) =>
    /(\.stories|\.story)\.[^.]+$/.test(file),
  )
  const mdxFiles = allPaths.filter((file) => {
    if (file.endsWith('.mdx')) {
      try {
        const content = fs.readFileSync(file, 'utf-8')
        return content.includes('@storybook/')
      } catch {
        return false
      }
    }
    return false
  })

  const packageJsons = allPaths.filter((p) => p.endsWith('package.json'))

  // Filter package.json files that contain Storybook dependencies
  const packageJsonsWithStorybook = packageJsons.filter((pkgPath) => {
    try {
      const content = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'))
      return ['dependencies', 'devDependencies'].some(
        (section) =>
          content[section] &&
          Object.keys(content[section]).some((key) =>
            key.includes('storybook'),
          ),
      )
    } catch {
      return false
    }
  })

  // Find vitest/vite config files containing the Storybook vitest addon plugin
  const vitestConfigsWithStorybook = findVitestConfigsWithStorybook(allPaths)

  const doVitest = !options.storiesOnly
  const doStories = !options.vitestOnly && !options.keepStories
  const doFull = !options.vitestOnly && !options.storiesOnly

  // Build the list of available categories based on what was detected
  type Category = 'dirs' | 'deps' | 'stories' | 'vitest'
  const availableCategories: { value: Category; label: string; hint: string }[] = []

  if (doFull && storybookDirs.length > 0) {
    const dirAction = options.keepStorybookDir ? 'Rename' : 'Remove'
    availableCategories.push({
      value: 'dirs',
      label: `${dirAction} .storybook directories`,
      hint: `${storybookDirs.length} found`,
    })
  }
  if (doFull && packageJsonsWithStorybook.length > 0) {
    availableCategories.push({
      value: 'deps',
      label: 'Remove Storybook dependencies',
      hint: `${packageJsonsWithStorybook.length} package.json`,
    })
  }
  if (doStories && (storyFiles.length > 0 || mdxFiles.length > 0)) {
    availableCategories.push({
      value: 'stories',
      label: 'Remove story & MDX files',
      hint: `${storyFiles.length} stories, ${mdxFiles.length} MDX`,
    })
  }
  if (doVitest && vitestConfigsWithStorybook.length > 0) {
    availableCategories.push({
      value: 'vitest',
      label: 'Remove Storybook vitest plugin',
      hint: `${vitestConfigsWithStorybook.length} config ${vitestConfigsWithStorybook.length === 1 ? 'file' : 'files'}`,
    })
  }

  if (availableCategories.length === 0) {
    note(
      'This project does not use Storybook, there is nothing to uninstall!',
      'No Action Needed',
    )
    outro('✨ Done')
    return
  }

  // --- Step 1: Select categories ---

  let selectedCategories: Category[]

  if (options.yes) {
    selectedCategories = availableCategories.map((c) => c.value)
  } else {
    const result = await multiselect({
      message: 'Select what to uninstall:',
      options: availableCategories,
      initialValues: availableCategories.map((c) => c.value),
    })

    if (isCancel(result)) {
      note('Uninstallation cancelled.', 'Cancelled')
      outro('✨ Done')
      return
    }
    selectedCategories = result as Category[]
  }

  if (selectedCategories.length === 0) {
    note('Nothing selected.', 'No Action Needed')
    outro('✨ Done')
    return
  }

  // --- Step 2: Drill down for categories with multiple items ---

  let selectedDirs: string[] = []
  let selectedPackages: string[] = []
  let shouldRemoveStories = false
  let selectedVitestConfigs: string[] = []

  if (selectedCategories.includes('dirs')) {
    if (options.yes || storybookDirs.length === 1) {
      selectedDirs = storybookDirs
    } else {
      const result = await multiselect({
        message: options.keepStorybookDir
          ? 'Select .storybook directories to rename:'
          : 'Select .storybook directories to remove:',
        options: storybookDirs.map((dir) => ({
          value: dir,
          label: getRelativePath(dir),
        })),
        initialValues: storybookDirs,
      })

      if (isCancel(result)) {
        note('Uninstallation cancelled.', 'Cancelled')
        outro('✨ Done')
        return
      }
      selectedDirs = result as string[]
    }
  }

  if (selectedCategories.includes('deps')) {
    if (options.yes || packageJsonsWithStorybook.length === 1) {
      selectedPackages = packageJsonsWithStorybook
    } else {
      const result = await multiselect({
        message: 'Select package.json files to clean:',
        options: packageJsonsWithStorybook.map((pkg) => ({
          value: pkg,
          label: getRelativePath(pkg),
        })),
        initialValues: packageJsonsWithStorybook,
      })

      if (isCancel(result)) {
        note('Uninstallation cancelled.', 'Cancelled')
        outro('✨ Done')
        return
      }
      selectedPackages = result as string[]
    }
  }

  if (selectedCategories.includes('stories')) {
    shouldRemoveStories = true
  }

  if (selectedCategories.includes('vitest')) {
    if (options.yes || vitestConfigsWithStorybook.length === 1) {
      selectedVitestConfigs = vitestConfigsWithStorybook
    } else {
      const result = await multiselect({
        message: 'Select vitest/vite config files to clean:',
        options: vitestConfigsWithStorybook.map((file) => ({
          value: file,
          label: getRelativePath(file),
        })),
        initialValues: vitestConfigsWithStorybook,
      })

      if (isCancel(result)) {
        note('Uninstallation cancelled.', 'Cancelled')
        outro('✨ Done')
        return
      }
      selectedVitestConfigs = result as string[]
    }
  }

  // --- Execute actions ---

  // Process .storybook directories
  if (selectedDirs.length > 0) {
    const dirAction = options.keepStorybookDir ? 'Renaming' : 'Removing'
    log.success(
      `${dirAction} ${selectedDirs.length} .storybook ${
        selectedDirs.length === 1 ? 'directory' : 'directories'
      }...`,
    )
    for (const dir of selectedDirs) {
      if (options.keepStorybookDir) {
        const originalDir = dir.replace(/\.storybook$/, '.storybook-original')
        fs.renameSync(dir, originalDir)
        summary.storybookDirs.push(`${dir} → ${originalDir}`)
      } else {
        deleteDir(dir)
        summary.storybookDirs.push(dir)
      }
    }
  }

  // Clean package.json files
  if (selectedPackages.length > 0) {
    let totalDeps = 0
    for (const pkg of selectedPackages) {
      const content = JSON.parse(fs.readFileSync(pkg, 'utf-8'))
      ;['dependencies', 'devDependencies'].forEach((section) => {
        if (content[section]) {
          totalDeps += Object.keys(content[section]).filter((key: string) =>
            key.includes('storybook'),
          ).length
        }
      })
    }

    log.success(
      `Removing ${totalDeps} Storybook ${
        totalDeps === 1 ? 'dependency' : 'dependencies'
      } from ${selectedPackages.length} package.json ${
        selectedPackages.length === 1 ? 'file' : 'files'
      }...`,
    )
    for (const pkg of selectedPackages) {
      const removed = cleanPackageJson(pkg)
      if (removed.length > 0) {
        summary.packageChanges[pkg] = removed
      }
    }
  }

  // Clean vitest config files
  if (selectedVitestConfigs.length > 0) {
    log.success(
      `Removing Storybook vitest plugin from ${selectedVitestConfigs.length} config ${
        selectedVitestConfigs.length === 1 ? 'file' : 'files'
      }...`,
    )
    for (const configFile of selectedVitestConfigs) {
      const original = fs.readFileSync(configFile, 'utf-8')
      const cleaned = removeStorybookVitestPlugin(original)
      if (cleaned !== original) {
        fs.writeFileSync(configFile, cleaned)
        summary.vitestConfigs.push(configFile)
      }
    }
  }

  // Remove story/MDX files
  if (shouldRemoveStories) {
    log.success(
      `Removing ${storyFiles.length} story ${
        storyFiles.length === 1 ? 'file' : 'files'
      }...`,
    )
    for (const file of storyFiles) {
      deleteFile(file)
      summary.storyFiles.push(file)
    }

    log.success(
      `Removing ${mdxFiles.length} MDX ${
        mdxFiles.length === 1 ? 'doc' : 'docs'
      }...`,
    )
    for (const file of mdxFiles) {
      deleteFile(file)
      summary.storyFiles.push(file)
    }
  }

  // Run package install if dependencies were removed
  const hasPackageChanges = Object.keys(summary.packageChanges).length > 0

  if (hasPackageChanges) {
    const s = spinner()
    s.start('Running install command...')
    const result = spawnSync('ni', [], {
      stdio: 'ignore',
      cwd: root,
      shell: true,
    })
    if ((result as { error?: Error }).error) {
      log.error(
        'Error running package manager install: ' +
          (result as { error: Error }).error.message,
      )
      process.exit(1)
    } else {
      s.stop('Install command completed')
    }
  }

  // --- Summary ---

  log.info(`All done! Here's the summary of changes:`)

  if (hasPackageChanges) {
    note('Package.json changes:')
    for (const [file, deps] of Object.entries(summary.packageChanges)) {
      console.log(`${grey('│')} • ${blue(getRelativePath(file))}`)
      console.log(
        `${grey('│')}   ◦ ${(deps as string[]).length} deps removed: ${(
          deps as string[]
        ).join(', ')}`,
      )
    }
  }

  if (summary.storybookDirs.length > 0) {
    const dirAction = options.keepStorybookDir ? 'renamed' : 'removed'
    note(`.storybook directories ${dirAction}:`)
    summary.storybookDirs.forEach((dir) => {
      if (options.keepStorybookDir && dir.includes(' → ')) {
        const [original, renamed] = dir.split(' → ')
        console.log(
          `${grey('│')}  • ${blue(getRelativePath(original))} → ${blue(
            getRelativePath(renamed),
          )}`,
        )
      } else {
        console.log(`${grey('│')}  • ${blue(getRelativePath(dir))}`)
      }
    })
  }

  if (summary.vitestConfigs.length > 0) {
    note('Vitest config files cleaned:')
    summary.vitestConfigs.forEach((file) => {
      console.log(
        `${grey('│')}  • ${blue(getRelativePath(file))} — removed Storybook vitest plugin`,
      )
    })
  }

  if (shouldRemoveStories) {
    if (summary.storyFiles.length > 0) {
      note(
        `${summary.storyFiles.length} ${
          summary.storyFiles.length === 1 ? 'file' : 'files'
        } removed`,
        `Stories:`,
      )
    }

    if (mdxFiles.length > 0) {
      note(
        `${mdxFiles.length} ${
          mdxFiles.length === 1 ? 'file' : 'files'
        } removed`,
        `MDX docs:`,
      )
    }
  }

  outro('✨ Storybook uninstallation complete!')
}

// Allow running directly as a script
if (import.meta.url === `file://${process.argv[1]}`) {
  uninstall({ yes: false, keepStories: false, keepStorybookDir: false, vitestOnly: false, storiesOnly: false })
}
