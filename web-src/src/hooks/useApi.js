// Tiny data-loading hook: runs `fetcher` on mount / when deps change and exposes reload().
import { useCallback, useEffect, useRef, useState } from 'react';

export default function useApi(fetcher, deps = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const alive = useRef(true);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const run = useCallback(fetcher, deps);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await run();
      if (alive.current) setData(result);
    } catch (e) {
      console.log(e);
      if (alive.current) setError(e);
    } finally {
      if (alive.current) setLoading(false);
    }
  }, [run]);

  useEffect(() => {
    alive.current = true;
    reload();
    return () => {
      alive.current = false;
    };
  }, [reload]);

  return { data, loading, error, reload };
}
