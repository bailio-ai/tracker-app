import { Pool, type QueryResultRow } from "pg";

declare global {
  var _pgPool: Pool | undefined;
}

const pool =
  globalThis._pgPool ??
  new Pool({
    connectionString: process.env.DB_URL,
  });

if (process.env.NODE_ENV !== "production") {
  globalThis._pgPool = pool;
}

export function query<T extends QueryResultRow = QueryResultRow>(
  text: string,
  params?: unknown[],
) {
  return pool.query<T>(text, params);
}

export type Bundle = {
  id: number;
  price: string;
  start_date: string;
  total_sessions: number;
  active: boolean;
};

export type Session = {
  id: number;
  bundle_id: number;
  session_date: string;
  effort: number | null;
  note: string | null;
};

export async function createBundle(params: {
  price: number;
  startDate: string;
  totalSessions?: number;
}): Promise<Bundle> {
  const { price, startDate, totalSessions = 10 } = params;
  const client = await pool.connect();

  try {
    await client.query("BEGIN");
    await client.query(
      "update bundles set active = false where active = true",
    );
    const { rows } = await client.query<Bundle>(
      `insert into bundles (price, start_date, total_sessions, active)
       values ($1, $2, $3, true)
       returning *`,
      [price, startDate, totalSessions],
    );
    await client.query("COMMIT");
    return rows[0];
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}

export async function getActiveBundle(): Promise<Bundle | null> {
  const { rows } = await query<Bundle>(
    "select * from bundles where active = true limit 1",
  );
  return rows[0] ?? null;
}

export async function createSession(params: {
  bundleId: number;
  effort?: number | null;
  note?: string | null;
  sessionDate?: string;
}): Promise<Session> {
  const { bundleId, effort = null, note = null, sessionDate } = params;

  const { rows } = sessionDate
    ? await query<Session>(
        `insert into sessions (bundle_id, session_date, effort, note)
         values ($1, $2, $3, $4)
         returning *`,
        [bundleId, sessionDate, effort, note],
      )
    : await query<Session>(
        `insert into sessions (bundle_id, effort, note)
         values ($1, $2, $3)
         returning *`,
        [bundleId, effort, note],
      );

  return rows[0];
}

export async function countSessionsForBundle(
  bundleId: number,
): Promise<number> {
  const { rows } = await query<{ count: string }>(
    "select count(*)::text as count from sessions where bundle_id = $1",
    [bundleId],
  );
  return Number(rows[0]?.count ?? 0);
}

export async function listBundlesWithSessions(): Promise<
  (Bundle & { sessions: Session[] })[]
> {
  const { rows: bundles } = await query<Bundle>(
    "select * from bundles order by start_date desc, id desc",
  );
  const { rows: sessions } = await query<Session>(
    "select * from sessions order by bundle_id, session_date",
  );

  const sessionsByBundle = new Map<number, Session[]>();
  for (const session of sessions) {
    const list = sessionsByBundle.get(session.bundle_id) ?? [];
    list.push(session);
    sessionsByBundle.set(session.bundle_id, list);
  }

  return bundles.map((bundle) => ({
    ...bundle,
    sessions: sessionsByBundle.get(bundle.id) ?? [],
  }));
}
