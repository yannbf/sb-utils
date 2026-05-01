import { Command } from 'commander'
import { uninstall } from './commands/uninstall'
import { eventLogger } from './commands/event-logger'
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

program
  .command('event-logger')
  .description('Start a telemetry event debugger with a real-time dashboard UI')
  .option('-p, --port <port>', 'Port to listen on', '6007')
  .option('--open', 'Auto-open the dashboard in your browser')
  .option('--json', 'Output events as NDJSON to stdout (auto-enabled when an AI agent is detected)')
  .option('-q, --quiet', 'Suppress all terminal output except errors')
  .option('--max-events <count>', 'Maximum events to keep in memory (0 = unlimited)', '0')
  .option('--import <path>', 'Preload events from a JSON file exported from the dashboard')
  .option(
    '--project-root <path>',
    'Project to inspect the Storybook cache for. Defaults to walking up from cwd',
  )
  .option(
    '--no-cache',
    'Hide cache events from the CLI output and start the dashboard with cache toggled off',
  )
  .option('--no-cache-watch', 'Disable live cache watching entirely (no cache events captured)')
  .action(async (options) => {
    await eventLogger({
      port: Number(options.port),
      open: !!options.open,
      json: !!options.json,
      quiet: !!options.quiet,
      maxEvents: Number(options.maxEvents),
      importPath: options.import,
      projectRoot: options.projectRoot,
      // commander inverts --no-* flags, so `cache` and `cacheWatch` are
      // `true` by default and `false` when --no-cache / --no-cache-watch
      // are passed.
      noCache: options.cache === false,
      noCacheWatch: options.cacheWatch === false,
    }).catch(console.error)
  })

program.parse()
