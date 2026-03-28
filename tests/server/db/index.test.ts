import { describe, it, expect, vi, beforeEach } from 'vitest'

const mockExec = vi.fn()
const mockPragma = vi.fn()
const mockPrepareGet = vi.fn()
const mockPrepareRun = vi.fn()

const mockDbInstance = {
  pragma: mockPragma,
  exec: mockExec,
  prepare: vi.fn((sql: string) => {
    if (sql.includes('COUNT(*)')) return { get: mockPrepareGet }
    return { run: mockPrepareRun }
  }),
}

vi.mock('better-sqlite3', () => ({
  default: class MockDatabase {
    pragma = mockPragma
    exec = mockExec
    prepare = mockDbInstance.prepare

    constructor() {
      Object.assign(this, mockDbInstance)
    }
  },
}))

vi.mock('path', async (importOriginal) => {
  const actual = await importOriginal<typeof import('path')>()
  return {
    ...actual,
    resolve: vi.fn(() => '/mocked/path/aurora.db'),
  }
})

describe('server/db/index', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.resetModules()

    mockDbInstance.prepare = vi.fn((sql: string) => {
      if (sql.includes('COUNT(*)')) return { get: mockPrepareGet }
      return { run: mockPrepareRun }
    })
  })

  it('creates a database instance on first call', async () => {
    mockPrepareGet.mockReturnValue({ count: 1 })
    const { getDb } = await import('~/server/db/index')

    const db = getDb()

    expect(db).toBeDefined()
  })

  it('returns the same singleton on subsequent calls', async () => {
    mockPrepareGet.mockReturnValue({ count: 1 })
    const { getDb } = await import('~/server/db/index')

    const db1 = getDb()
    const db2 = getDb()

    expect(db1).toBe(db2)
  })

  it('sets WAL journal mode pragma', async () => {
    mockPrepareGet.mockReturnValue({ count: 1 })
    const { getDb } = await import('~/server/db/index')

    getDb()

    expect(mockPragma).toHaveBeenCalledWith('journal_mode = WAL')
  })

  it('enables foreign keys pragma', async () => {
    mockPrepareGet.mockReturnValue({ count: 1 })
    const { getDb } = await import('~/server/db/index')

    getDb()

    expect(mockPragma).toHaveBeenCalledWith('foreign_keys = ON')
  })

  it('executes schema initialization (CREATE TABLE IF NOT EXISTS)', async () => {
    mockPrepareGet.mockReturnValue({ count: 1 })
    const { getDb } = await import('~/server/db/index')

    getDb()

    expect(mockExec).toHaveBeenCalledTimes(1)
    const execArg = mockExec.mock.calls[0][0] as string
    expect(execArg).toContain('CREATE TABLE IF NOT EXISTS products')
    expect(execArg).toContain('CREATE TABLE IF NOT EXISTS orders')
    expect(execArg).toContain('CREATE TABLE IF NOT EXISTS order_items')
  })

  it('seeds the Aurora One product when the products table is empty', async () => {
    mockPrepareGet.mockReturnValue({ count: 0 })
    const { getDb } = await import('~/server/db/index')

    getDb()

    expect(mockPrepareRun).toHaveBeenCalledWith('Aurora One', 89.0, 100)
  })

  it('does not seed products when the table already has rows', async () => {
    mockPrepareGet.mockReturnValue({ count: 5 })
    const { getDb } = await import('~/server/db/index')

    getDb()

    expect(mockPrepareRun).not.toHaveBeenCalled()
  })

  it('queries count before seeding to check if table is empty', async () => {
    mockPrepareGet.mockReturnValue({ count: 1 })
    const { getDb } = await import('~/server/db/index')

    getDb()

    expect(mockPrepareGet).toHaveBeenCalled()
  })
})
