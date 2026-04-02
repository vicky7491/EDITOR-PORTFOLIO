import { useState, useEffect, useCallback } from 'react';
import axiosAdmin from '@/api/axiosAdmin';

/**
 * Generic fetch hook for admin pages.
 * Usage: const { data, meta, isLoading, error, refetch } = useFetch('/api/projects');
 */
const useFetch = (url, params = {}) => {
  const [data,      setData]      = useState(null);
  const [meta,      setMeta]      = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error,     setError]     = useState(null);

  const fetchData = useCallback(async () => {
    if (!url) return;
    setIsLoading(true);
    setError(null);
    try {
      const res = await axiosAdmin.get(url, { params });
      setData(res.data.data);
      setMeta(res.data.meta || null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch data');
    } finally {
      setIsLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url, JSON.stringify(params)]);

  useEffect(() => { fetchData(); }, [fetchData]);

  return { data, meta, isLoading, error, refetch: fetchData };
};

export default useFetch;