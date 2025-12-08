import {
  intro,
  outro,
  note,
  log,
  spinner,
  confirm,
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
import { blue, grey } from '../utils/colors'

type Summary = {
  storybookDirs: string[]
  storyFiles: string[]
  packageChanges: Record<string, string[]>
}

const summary: Summary = {
  storybookDirs: [],
  storyFiles: [],
  packageChanges: {},
}

type UninstallOptions = {
  yes: boolean
  keepStories: boolean
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
      fs.statSync(dir).isDirectory()
  )

  const storyFiles = allPaths.filter((file) =>
    /(\.stories|\.story)\.[^.]+$/.test(file)
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
          Object.keys(content[section]).some((key) => key.includes('storybook'))
      )
    } catch {
      return false
    }
  })

  if (
    storybookDirs.length === 0 &&
    storyFiles.length === 0 &&
    mdxFiles.length === 0 &&
    packageJsonsWithStorybook.length === 0
  ) {
    note(
      'This project does not use Storybook, there is nothing to uninstall!',
      'No Action Needed'
    )
    outro('✨ Done')
    return
  }

  // Select Storybook directories to remove
  const selectedDirs: string[] = options.yes
    ? storybookDirs
    : storybookDirs.length > 1
    ? ((await multiselect({
        message: 'Select .storybook directories to remove:',
        options: storybookDirs.map((dir) => ({
          value: dir,
          label: getRelativePath(dir),
          hint: 'Directory',
        })),
        initialValues: storybookDirs,
      })) as string[])
    : storybookDirs

  if (!selectedDirs || isCancel(selectedDirs)) {
    note('Uninstallation cancelled.', 'Cancelled')
    outro('✨ Done')
    return
  }

  // Select package.json files to clean
  const selectedPackages: string[] = options.yes
    ? packageJsonsWithStorybook
    : packageJsonsWithStorybook.length > 1
    ? ((await multiselect({
        message: 'Select package.json files to clean:',
        options: packageJsonsWithStorybook.map((pkg) => ({
          value: pkg,
          label: getRelativePath(pkg),
          hint: 'Package.json',
        })),
        initialValues: packageJsonsWithStorybook,
      })) as string[])
    : packageJsonsWithStorybook

  if (!selectedPackages || isCancel(selectedPackages)) {
    note('Uninstallation cancelled.', 'Cancelled')
    outro('✨ Done')
    return
  }

  const shouldRemoveStories = !options.keepStories
  const confirmMessage = shouldRemoveStories
    ? `This command will remove the storybook directories, dependencies, ${
        storyFiles.length
      } story ${storyFiles.length === 1 ? 'file' : 'files'} and ${
        mdxFiles.length
      } MDX docs. Proceed with uninstallation?`
    : `This command will remove the storybook directories and dependencies but keep the ${
        storyFiles.length
      } story ${storyFiles.length === 1 ? 'file' : 'files'} and ${
        mdxFiles.length
      } MDX docs. Proceed with uninstallation?`

  const shouldProceed = options.yes
    ? true
    : await confirm({
        message: confirmMessage,
        initialValue: true,
      })

  if (!shouldProceed || isCancel(shouldProceed)) {
    note('Uninstallation cancelled.', 'Cancelled')
    outro('✨ Done')
    return
  }

  log.success(
    `Removing ${selectedDirs.length} .storybook ${
      selectedDirs.length === 1 ? 'directory' : 'directories'
    }...`
  )
  // Delete .storybook directories
  for (const dir of selectedDirs) {
    deleteDir(dir)
    summary.storybookDirs.push(dir)
  }

  // Count total Storybook dependencies
  let totalDeps = 0
  for (const pkg of selectedPackages) {
    const content = JSON.parse(fs.readFileSync(pkg, 'utf-8'))
    ;['dependencies', 'devDependencies'].forEach((section) => {
      if (content[section]) {
        totalDeps += Object.keys(content[section]).filter((key: string) =>
          key.includes('storybook')
        ).length
      }
    })
  }

  log.success(
    `Removing ${totalDeps} Storybook ${
      totalDeps === 1 ? 'dependency' : 'dependencies'
    } from ${selectedPackages.length} package.json ${
      selectedPackages.length === 1 ? 'file' : 'files'
    }...`
  )
  // Clean package.json files
  for (const pkg of selectedPackages) {
    const removed = cleanPackageJson(pkg)
    if (removed.length > 0) {
      summary.packageChanges[pkg] = removed
    }
  }

  if (shouldRemoveStories) {
    log.success(
      `Removing ${storyFiles.length} story ${
        storyFiles.length === 1 ? 'file' : 'files'
      }...`
    )
    // Delete story files
    for (const file of storyFiles) {
      deleteFile(file)
      summary.storyFiles.push(file)
    }

    log.success(
      `Removing ${mdxFiles.length} MDX ${
        mdxFiles.length === 1 ? 'doc' : 'docs'
      }...`
    )
    // Delete MDX files
    for (const file of mdxFiles) {
      deleteFile(file)
      summary.storyFiles.push(file)
    }
  }

  const hasPackageChanges = Object.keys(summary.packageChanges).length > 0

  if (hasPackageChanges) {
    const shouldInstall = true
    // await confirm({
    //   message: 'Storybook dependencies were removed from package.json. Run package manager install?',
    //   initialValue: true,
    // });

    if (shouldInstall) {
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
            (result as { error: Error }).error.message
        )
        process.exit(1)
      } else {
        s.stop('Install command completed')
      }
    }
  }

  log.info(`All done! Here's the summary of changes:`)

  // Show summary
  if (hasPackageChanges) {
    note('Package.json changes:')
    for (const [file, deps] of Object.entries(summary.packageChanges)) {
      console.log(`${grey('│')} • ${blue(getRelativePath(file))}`)
      console.log(
        `${grey('│')}   ◦ ${(deps as string[]).length} deps removed: ${(
          deps as string[]
        ).join(', ')}`
      )
    }
  }

  if (summary.storybookDirs.length > 0) {
    note('.storybook directories removed:')
    summary.storybookDirs.forEach((dir) =>
      console.log(`${grey('│')}  • ${blue(getRelativePath(dir))}`)
    )
  }

  if (shouldRemoveStories) {
    if (summary.storyFiles.length > 0) {
      note(
        `${summary.storyFiles.length} ${
          summary.storyFiles.length === 1 ? 'file' : 'files'
        } removed`,
        `Stories:`
      )
    }

    if (mdxFiles.length > 0) {
      note(
        `${mdxFiles.length} ${
          mdxFiles.length === 1 ? 'file' : 'files'
        } removed`,
        `MDX docs:`
      )
    }
  }

  outro('✨ Storybook uninstallation complete!')
}

// Allow running directly as a script
if (import.meta.url === `file://${process.argv[1]}`) {
  uninstall({ yes: false, keepStories: false })
}
