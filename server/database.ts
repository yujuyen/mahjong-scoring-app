import { Pool } from 'pg';

// Check if DATABASE_URL is set
if (!process.env.DATABASE_URL) {
  console.error('ERROR: DATABASE_URL environment variable is not set!');
  console.error('Please create a PostgreSQL database on Render and connect it to this service.');
  console.error('See: https://render.com/docs/databases');
  process.exit(1);
}

// Use PostgreSQL connection string from environment variable
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

// Initialize database tables on startup
let dbInitialized = false;
const dbInitPromise = initDatabase();

async function initDatabase() {
  if (dbInitialized) return;

  const client = await pool.connect();
  try {
    console.log('Initializing database...');
    await client.query('BEGIN');

    // Sessions table
    await client.query(`
      CREATE TABLE IF NOT EXISTS sessions (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        status TEXT DEFAULT 'active' CHECK(status IN ('active', 'completed'))
      )
    `);

    // Players table
    await client.query(`
      CREATE TABLE IF NOT EXISTS players (
        id SERIAL PRIMARY KEY,
        session_id INTEGER NOT NULL,
        name TEXT NOT NULL,
        FOREIGN KEY (session_id) REFERENCES sessions(id) ON DELETE CASCADE
      )
    `);

    // Hands table - stores individual winning hands
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

    // Scores table - running totals
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
    dbInitialized = true;
    console.log('Database tables initialized successfully');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error initializing database:', err);
    throw err;
  } finally {
    client.release();
  }
}

export async function query<T>(sql: string, params: any[] = []): Promise<T[]> {
  await dbInitPromise; // Ensure DB is initialized
  const result = await pool.query(sql, params);
  return result.rows as T[];
}

export async function run(sql: string, params: any[] = []): Promise<{ lastID: number; changes: number }> {
  await dbInitPromise; // Ensure DB is initialized
  const result = await pool.query(sql, params);
  // PostgreSQL returns the inserted row with RETURNING clause
  // For compatibility, we return lastID from the first row if available
  const lastID = result.rows[0]?.id || 0;
  return { lastID, changes: result.rowCount || 0 };
}

export async function get<T>(sql: string, params: any[] = []): Promise<T | undefined> {
  await dbInitPromise; // Ensure DB is initialized
  const result = await pool.query(sql, params);
  return result.rows[0] as T | undefined;
}

export { pool };
