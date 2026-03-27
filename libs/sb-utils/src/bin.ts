import { Command } from 'commander'
import { uninstall } from './commands/uninstall'
import { version } from '../package.json'

const program = new Command()

program
  .name('sb-utils')
  .description('A set of different utilities for Storybook')
  .version(version)

program
  .command('uninstall')
  .description('Remove Storybook from your project')
  .option('-y, --yes', "Don't ask for prompts")
  .option('-k, --keep-stories', 'Keep .stories and MDX files when uninstalling')
  .option(
    '-d, --keep-storybook-dir',
    'Rename .storybook directories to .storybook-original instead of deleting it',
  )
  .option(
    '--vitest-only',
    'Only remove the Storybook vitest plugin from config files',
  )
  .option(
    '--stories-only',
    'Only remove story and MDX files',
  )
  .action(async (options) => {
    await uninstall(options).catch(console.error)
  })

program.parse()
