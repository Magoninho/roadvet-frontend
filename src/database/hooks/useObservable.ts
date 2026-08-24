import { useEffect, useState } from 'react';
import type { Observable } from 'rxjs';

/**
 * Subscribes to a WatermelonDB/rxjs Observable and re-renders on every emission.
 * `factory` is re-run whenever an entry in `deps` changes.
 */
export function useObservable<T>(factory: () => Observable<T>, deps: unknown[], defaultValue: T): T {
  const [value, setValue] = useState<T>(defaultValue);

  useEffect(() => {
    const subscription = factory().subscribe(setValue);
    return () => subscription.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return value;
}
