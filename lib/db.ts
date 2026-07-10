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
  async (db) => {
    await db.execAsync(`
      ALTER TABLE plans ADD COLUMN locale TEXT NOT NULL DEFAULT 'pt-BR';
      DROP TABLE bible_verses;
      DROP TABLE bible_books;
      DROP TABLE bible_meta;
      CREATE TABLE bible_books (
        locale TEXT NOT NULL,
        id INTEGER NOT NULL,
        slug TEXT NOT NULL,
        abbrev TEXT NOT NULL,
        name TEXT NOT NULL,
        testament TEXT NOT NULL,
        book_order INTEGER NOT NULL,
        PRIMARY KEY (locale, id),
        UNIQUE (locale, slug)
      );
      CREATE TABLE bible_verses (
        locale TEXT NOT NULL,
        book_id INTEGER NOT NULL,
        chapter INTEGER NOT NULL,
        verse INTEGER NOT NULL,
        text TEXT NOT NULL,
        PRIMARY KEY (locale, book_id, chapter, verse),
        FOREIGN KEY (locale, book_id) REFERENCES bible_books(locale, id)
      );
      CREATE TABLE bible_meta (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL
      );
    `);
  },
  async (db) => {
    await db.execAsync(`
      UPDATE plans
      SET status = 'abandoned'
      WHERE status = 'active'
        AND id <> (
          SELECT id FROM plans
          WHERE status = 'active'
          ORDER BY created_at DESC, id DESC
          LIMIT 1
        );
      CREATE UNIQUE INDEX idx_plans_single_active
      ON plans ((1))
      WHERE status = 'active';
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
