import { useSQLiteContext } from 'expo-sqlite';
import { useEffect, useRef, useState } from 'react';

import { bootstrapBible, isBibleBootstrapped, type RawBibleBook } from './bible';
import { translate } from './i18n';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const portugueseBible: RawBibleBook[] = require('../assets/bible/pt-BR.json');
const englishBible: RawBibleBook[] = require('../assets/bible/en.json');

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
        if (!Array.isArray(portugueseBible) || !Array.isArray(englishBible)) {
          setError(translate('bible.loadError'));
          return;
        }
        await bootstrapBible(db, { 'pt-BR': portugueseBible, en: englishBible });
        setReady(true);
      } catch (e) {
        setError(e instanceof Error ? e.message : String(e));
      }
    })();
  }, [db]);

  return { ready, error };
}
