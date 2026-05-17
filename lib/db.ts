import type { SQLiteDatabase } from 'expo-sqlite';

export const DB_NAME = 'logos.db';

const MIGRATIONS: ((db: SQLiteDatabase) => Promise<void>)[] = [
  async (db) => {
    await db.execAsync(`
      CREATE TABLE plans (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        theme TEXT NOT NULL,
        days_count INTEGER NOT NULL,
        current_day INTEGER NOT NULL DEFAULT 1,
        status TEXT NOT NULL DEFAULT 'active',
        created_at INTEGER NOT NULL
      );
      CREATE TABLE plan_days (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        plan_id INTEGER NOT NULL REFERENCES plans(id) ON DELETE CASCADE,
        day_number INTEGER NOT NULL,
        passages_json TEXT,
        reflection TEXT,
        prayer TEXT,
        completed_at INTEGER,
        generated_at INTEGER,
        UNIQUE(plan_id, day_number)
      );
      CREATE INDEX idx_plan_days_plan ON plan_days(plan_id);
    `);
  },
  async (db) => {
    await db.execAsync(`
      CREATE TABLE bible_books (
        id INTEGER PRIMARY KEY,
        slug TEXT NOT NULL UNIQUE,
        abbrev TEXT NOT NULL,
        name TEXT NOT NULL,
        testament TEXT NOT NULL,
        book_order INTEGER NOT NULL
      );
      CREATE TABLE bible_verses (
        book_id INTEGER NOT NULL REFERENCES bible_books(id),
        chapter INTEGER NOT NULL,
        verse INTEGER NOT NULL,
        text TEXT NOT NULL,
        PRIMARY KEY (book_id, chapter, verse)
      );
      CREATE TABLE bible_meta (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL
      );
    `);
  },
];

export async function migrate(db: SQLiteDatabase) {
  await db.execAsync('PRAGMA journal_mode = WAL; PRAGMA foreign_keys = ON;');
  const { user_version: version } = (await db.getFirstAsync<{ user_version: number }>(
    'PRAGMA user_version'
  )) ?? { user_version: 0 };

  for (let i = version; i < MIGRATIONS.length; i++) {
    await db.withTransactionAsync(async () => {
      await MIGRATIONS[i](db);
      await db.execAsync(`PRAGMA user_version = ${i + 1}`);
    });
  }
}
