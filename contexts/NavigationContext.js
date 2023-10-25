import React, { createContext, useContext, useState } from 'react';

const NavigationContext = createContext();

export const useNavigation = () => {
  return useContext(NavigationContext);
};

export const NavigationProvider = ({ children }) => {
  const [lastNavigatedPage, setLastNavigatedPage] = useState(null);

  const value = {
    lastNavigatedPage,
    setLastNavigatedPage
  };

  return <NavigationContext.Provider value={value}>{children}</NavigationContext.Provider>;
};
