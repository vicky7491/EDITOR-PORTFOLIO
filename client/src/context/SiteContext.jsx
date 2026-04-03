import { createContext, useContext, useState, useEffect } from 'react';
import { siteApi } from '@/api/siteApi';

const SiteContext = createContext(null);

export const SiteProvider = ({ children }) => {
  const [settings,  setSettings]  = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    siteApi.getSettings()
      .then((data) => setSettings(data))
      .catch((err) => console.error('Failed to load site settings:', err))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <SiteContext.Provider value={{ settings, isLoading }}>
      {children}
    </SiteContext.Provider>
  );
};

export const useSite = () => {
  const ctx = useContext(SiteContext);
  if (!ctx) throw new Error('useSite must be inside SiteProvider');
  return ctx;
};