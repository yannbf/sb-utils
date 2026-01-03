import { Command } from 'commander'
import { uninstall } from './commands/uninstall'
import { runAnalyzeComponent } from './commands/component-analyzer'
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
    'Rename .storybook directories to .storybook-original instead of deleting it'
  )
  .action(async (options) => {
    await uninstall(options).catch(console.error)
  })

program
  .command('component-analyzer <file>')
  .description('Analyze component complexity')
  .action(async (filePath) => {
    await runAnalyzeComponent({ filePath }).catch(console.error)
  })

program.parse()
