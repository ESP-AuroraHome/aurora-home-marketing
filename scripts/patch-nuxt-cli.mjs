import { readFileSync, writeFileSync, existsSync } from 'fs'
import { resolve } from 'path'

const MARKER = '/* ebadf-patch */'
const file = resolve('node_modules/@nuxt/cli/dist/dev-CY-a7lb7.mjs')

if (!existsSync(file)) {
  process.exit(0)
}

const src = readFileSync(file, 'utf8')

if (src.includes(MARKER)) {
  process.exit(0)
}

const patched = src
  .replace(
    'for (let i = 0; i < this.poolSize; i++) this.warmFork();',
    `for (let i = 0; i < this.poolSize; i++) { try { this.warmFork(); } catch {} } ${MARKER}`,
  )
  .replace(
    /if \(this\.warming\) this\.warmFork\(\);/g,
    `if (this.warming) { try { this.warmFork(); } catch {} }`,
  )

writeFileSync(file, patched)
console.log('[patch] @nuxt/cli ForkPool warmFork wrapped in try-catch (EBADF fix)')
