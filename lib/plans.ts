import type { SQLiteDatabase } from 'expo-sqlite';

import type { ThemeId } from './themes';
import type { SupportedLocale } from './i18n';

export type PlanStatus = 'active' | 'completed' | 'abandoned';

export type Plan = {
  id: number;
  theme: ThemeId;
  days_count: number;
  current_day: number;
  status: PlanStatus;
  created_at: number;
  locale: SupportedLocale;
};

export type PlanDay = {
  id: number;
  plan_id: number;
  day_number: number;
  passages_json: string | null;
  reflection: string | null;
  prayer: string | null;
  completed_at: number | null;
  generated_at: number | null;
};

export type PlanSummary = Plan & {
  completed_days: number;
};

export type PreparedPlanDay = {
  day: number;
  passagesJson: string;
};

export async function createPlan(
  db: SQLiteDatabase,
  input: { theme: ThemeId; days: number; locale: SupportedLocale }
): Promise<number> {
  const now = Date.now();
  const result = await db.runAsync(
    'INSERT INTO plans (theme, days_count, locale, created_at) VALUES (?, ?, ?, ?)',
    input.theme,
    input.days,
    input.locale,
    now
  );
  return result.lastInsertRowId;
}

export async function replaceActivePlan(
  db: SQLiteDatabase,
  input: { theme: ThemeId; days: number; locale: SupportedLocale },
  preparedDays: PreparedPlanDay[]
): Promise<number> {
  let planId = 0;

  await db.withTransactionAsync(async () => {
    await db.runAsync("UPDATE plans SET status = 'abandoned' WHERE status = 'active'");
    const result = await db.runAsync(
      'INSERT INTO plans (theme, days_count, locale, created_at) VALUES (?, ?, ?, ?)',
      input.theme,
      input.days,
      input.locale,
      Date.now()
    );
    planId = result.lastInsertRowId;

    for (const day of preparedDays) {
      await db.runAsync(
        `INSERT INTO plan_days (plan_id, day_number, passages_json, generated_at)
         VALUES (?, ?, ?, ?)`,
        planId,
        day.day,
        day.passagesJson,
        Date.now()
      );
    }
  });

  return planId;
}

export async function getPlan(db: SQLiteDatabase, id: number) {
  return db.getFirstAsync<Plan>('SELECT * FROM plans WHERE id = ?', id);
}

export async function getActivePlan(db: SQLiteDatabase) {
  return db.getFirstAsync<Plan>(
    "SELECT * FROM plans WHERE status = 'active' ORDER BY created_at DESC LIMIT 1"
  );
}

export async function getLatestPlan(db: SQLiteDatabase) {
  return db.getFirstAsync<Plan>(
    'SELECT * FROM plans ORDER BY created_at DESC, id DESC LIMIT 1'
  );
}

export async function listPlans(db: SQLiteDatabase) {
  return db.getAllAsync<PlanSummary>(
    `SELECT plans.*, COUNT(plan_days.completed_at) AS completed_days
     FROM plans
     LEFT JOIN plan_days ON plan_days.plan_id = plans.id
     GROUP BY plans.id
     ORDER BY plans.created_at DESC, plans.id DESC`
  );
}

export async function getPlanDay(db: SQLiteDatabase, planId: number, dayNumber: number) {
  return db.getFirstAsync<PlanDay>(
    'SELECT * FROM plan_days WHERE plan_id = ? AND day_number = ?',
    planId,
    dayNumber
  );
}

export async function listPlanDays(db: SQLiteDatabase, planId: number) {
  return db.getAllAsync<PlanDay>(
    'SELECT * FROM plan_days WHERE plan_id = ? ORDER BY day_number',
    planId
  );
}

export async function markDayCompleted(
  db: SQLiteDatabase,
  planId: number,
  dayNumber: number
) {
  const now = Date.now();
  await db.withTransactionAsync(async () => {
    await db.runAsync(
      `INSERT INTO plan_days (plan_id, day_number, completed_at) VALUES (?, ?, ?)
       ON CONFLICT(plan_id, day_number) DO UPDATE SET completed_at = excluded.completed_at`,
      planId,
      dayNumber,
      now
    );
    await db.runAsync(
      `UPDATE plans
       SET current_day = MIN(current_day + 1, days_count),
           status = CASE WHEN current_day >= days_count THEN 'completed' ELSE status END
       WHERE id = ?`,
      planId
    );
  });
}
