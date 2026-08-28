import path from 'path';

/**
 * Database layer.
 *
 * In production (Render) a PostgreSQL connection string is provided via
 * DATABASE_URL and we use `pg`. For local development, if DATABASE_URL is not
 * set we fall back to a zero-setup SQLite database file so the app runs without
 * installing/running Postgres. Both backends expose the same query/run/get API,
 * and all callers use `$1`-style placeholders (translated to `?` for SQLite).
 */

const DATABASE_URL = process.env.DATABASE_URL;
const USE_SQLITE = !DATABASE_URL;

export interface RunResult {
  lastID: number;
  changes: number;
}

interface Backend {
  query<T>(sql: string, params: any[]): Promise<T[]>;
  run(sql: string, params: any[]): Promise<RunResult>;
  get<T>(sql: string, params: any[]): Promise<T | undefined>;
}

let backend: Backend;

// Kick off initialization on module load.
const dbInitPromise: Promise<void> = USE_SQLITE ? initSqlite() : initPostgres();

// ---------------------------------------------------------------------------
// PostgreSQL backend (production)
// ---------------------------------------------------------------------------
async function initPostgres(): Promise<void> {
  const { Pool } = await import('pg');

  const urlWithoutPassword = DATABASE_URL!.replace(/:([^@]+)@/, ':****@');
  console.log(`Connecting to database (PostgreSQL): ${urlWithoutPassword}`);

  const pool = new Pool({
    connectionString: DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  });

  pool.on('error', (err) => {
    console.error('Unexpected error on idle client', err);
    process.exit(-1);
  });

  const client = await pool.connect();
  try {
    console.log('Initializing database (PostgreSQL)...');
    await client.query('BEGIN');

    await client.query(`
      CREATE TABLE IF NOT EXISTS sessions (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        status TEXT DEFAULT 'active' CHECK(status IN ('active', 'completed'))
      )
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS players (
        id SERIAL PRIMARY KEY,
        session_id INTEGER NOT NULL,
        name TEXT NOT NULL,
        FOREIGN KEY (session_id) REFERENCES sessions(id) ON DELETE CASCADE
      )
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS hands (
        id SERIAL PRIMARY KEY,
        session_id INTEGER NOT NULL,
        winner_id INTEGER NOT NULL,
        loser_id INTEGER,
        hand_type TEXT NOT NULL,
        fan_count INTEGER NOT NULL,
        base_points INTEGER NOT NULL,
        total_points INTEGER NOT NULL,
        image_path TEXT,
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (session_id) REFERENCES sessions(id) ON DELETE CASCADE,
        FOREIGN KEY (winner_id) REFERENCES players(id),
        FOREIGN KEY (loser_id) REFERENCES players(id)
      )
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS scores (
        id SERIAL PRIMARY KEY,
        session_id INTEGER NOT NULL,
        player_id INTEGER NOT NULL,
        total_score INTEGER DEFAULT 0,
        FOREIGN KEY (session_id) REFERENCES sessions(id) ON DELETE CASCADE,
        FOREIGN KEY (player_id) REFERENCES players(id),
        UNIQUE(session_id, player_id)
      )
    `);

    await client.query('COMMIT');
    console.log('Database tables initialized successfully');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error initializing database:', err);
    throw err;
  } finally {
    client.release();
  }

  backend = {
    query: async <T>(sql: string, params: any[]) => (await pool.query(sql, params)).rows as T[],
    run: async (sql: string, params: any[]) => {
      const result = await pool.query(sql, params);
      return { lastID: result.rows[0]?.id || 0, changes: result.rowCount || 0 };
    },
    get: async <T>(sql: string, params: any[]) =>
      (await pool.query(sql, params)).rows[0] as T | undefined,
  };
}

// ---------------------------------------------------------------------------
// SQLite backend (local development fallback)
// ---------------------------------------------------------------------------

/** Translate `$1`-style placeholders to `?` and drop unsupported RETURNING clause. */
function toSqlite(sql: string): string {
  return sql.replace(/\bRETURNING\s+\w+/gi, '').replace(/\$\d+/g, '?');
}

async function initSqlite(): Promise<void> {
  // Lazy require so production (which has no sqlite3 dev dependency installed)
  // never tries to load this module.
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const sqlite3 = require('sqlite3');
  const dbFile = path.join(process.cwd(), 'mahjong.dev.db');

  console.warn(
    `DATABASE_URL not set — using local SQLite database for development at ${dbFile}`
  );

  const db: any = await new Promise((resolve, reject) => {
    const database = new sqlite3.Database(dbFile, (err: Error | null) => {
      if (err) reject(err);
      else resolve(database);
    });
  });

  const runDdl = (sql: string): Promise<void> =>
    new Promise((resolve, reject) => {
      db.run(sql, (err: Error | null) => (err ? reject(err) : resolve()));
    });

  console.log('Initializing database (SQLite)...');
  await runDdl('PRAGMA foreign_keys = ON');

  await runDdl(`
    CREATE TABLE IF NOT EXISTS sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      status TEXT DEFAULT 'active' CHECK(status IN ('active', 'completed'))
    )
  `);

  await runDdl(`
    CREATE TABLE IF NOT EXISTS players (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      session_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      FOREIGN KEY (session_id) REFERENCES sessions(id) ON DELETE CASCADE
    )
  `);

  await runDdl(`
    CREATE TABLE IF NOT EXISTS hands (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      session_id INTEGER NOT NULL,
      winner_id INTEGER NOT NULL,
      loser_id INTEGER,
      hand_type TEXT NOT NULL,
      fan_count INTEGER NOT NULL,
      base_points INTEGER NOT NULL,
      total_points INTEGER NOT NULL,
      image_path TEXT,
      notes TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (session_id) REFERENCES sessions(id) ON DELETE CASCADE,
      FOREIGN KEY (winner_id) REFERENCES players(id),
      FOREIGN KEY (loser_id) REFERENCES players(id)
    )
  `);

  await runDdl(`
    CREATE TABLE IF NOT EXISTS scores (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      session_id INTEGER NOT NULL,
      player_id INTEGER NOT NULL,
      total_score INTEGER DEFAULT 0,
      FOREIGN KEY (session_id) REFERENCES sessions(id) ON DELETE CASCADE,
      FOREIGN KEY (player_id) REFERENCES players(id),
      UNIQUE(session_id, player_id)
    )
  `);

  console.log('Database tables initialized successfully');

  backend = {
    query: <T>(sql: string, params: any[]) =>
      new Promise<T[]>((resolve, reject) => {
        db.all(toSqlite(sql), params, (err: Error | null, rows: any[]) =>
          err ? reject(err) : resolve(rows as T[])
        );
      }),
    run: (sql: string, params: any[]) =>
      new Promise<RunResult>((resolve, reject) => {
        db.run(toSqlite(sql), params, function (this: any, err: Error | null) {
          if (err) reject(err);
          else resolve({ lastID: this.lastID, changes: this.changes });
        });
      }),
    get: <T>(sql: string, params: any[]) =>
      new Promise<T | undefined>((resolve, reject) => {
        db.get(toSqlite(sql), params, (err: Error | null, row: any) =>
          err ? reject(err) : resolve(row as T | undefined)
        );
      }),
  };
}

// ---------------------------------------------------------------------------
// Public API (backend-agnostic)
// ---------------------------------------------------------------------------
export async function query<T>(sql: string, params: any[] = []): Promise<T[]> {
  await dbInitPromise;
  return backend.query<T>(sql, params);
}

export async function run(sql: string, params: any[] = []): Promise<RunResult> {
  await dbInitPromise;
  return backend.run(sql, params);
}

export async function get<T>(sql: string, params: any[] = []): Promise<T | undefined> {
  await dbInitPromise;
  return backend.get<T>(sql, params);
}
