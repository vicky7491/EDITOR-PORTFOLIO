import { useState, useEffect } from 'react';

/**
 * Returns a debounced version of value that only updates
 * after the specified delay (ms) has passed since last change.
 *
 * Usage:
 *   const debouncedSearch = useDebounce(searchQuery, 400);
 */
const useDebounce = (value, delay = 400) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
};

export default useDebounce;