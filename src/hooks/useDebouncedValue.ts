import { useEffect, useState } from 'react';

/**
 * Trails `value` by `delay` ms. Search inputs stay controlled by the raw state
 * so typing is instant, while the (much heavier) list filtering and re-render
 * only run once the user pauses.
 */
export function useDebouncedValue<T>(value: T, delay = 150): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timeout = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timeout);
  }, [value, delay]);

  return debounced;
}
