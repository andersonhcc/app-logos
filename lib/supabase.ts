const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.warn(
    '[supabase] EXPO_PUBLIC_SUPABASE_URL or EXPO_PUBLIC_SUPABASE_ANON_KEY not set'
  );
}

export async function invokeFunction<TBody, TResult>(
  name: string,
  body: TBody
): Promise<TResult> {
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    throw new Error('Supabase env vars missing');
  }
  const res = await fetch(`${SUPABASE_URL}/functions/v1/${name}`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      apikey: SUPABASE_KEY,
      authorization: `Bearer ${SUPABASE_KEY}`,
    },
    body: JSON.stringify(body),
  });
  const text = await res.text();
  if (!res.ok) {
    throw new Error(`${name} ${res.status}: ${text}`);
  }
  return JSON.parse(text) as TResult;
}
