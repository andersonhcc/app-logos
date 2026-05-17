import { useSQLiteContext } from 'expo-sqlite';
import { useEffect, useRef, useState } from 'react';

import { bootstrapBible, isBibleBootstrapped, type RawBibleBook } from './bible';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const rawBible: RawBibleBook[] = require('../assets/bible/aa.json');

export function useBibleBootstrap() {
  const db = useSQLiteContext();
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;

    (async () => {
      try {
        if (await isBibleBootstrapped(db)) {
          setReady(true);
          return;
        }
        if (!Array.isArray(rawBible) || rawBible.length === 0) {
          setError('Bíblia não foi baixada. Rode `npm run fetch:bible` e reabra o app.');
          return;
        }
        await bootstrapBible(db, rawBible);
        setReady(true);
      } catch (e) {
        setError(e instanceof Error ? e.message : String(e));
      }
    })();
  }, [db]);

  return { ready, error };
}
