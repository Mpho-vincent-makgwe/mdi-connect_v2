"use client";

import { createContext, useState, useContext, useCallback } from 'react';

const SearchContext = createContext();

export const SearchProvider = ({ children }) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Stable context value that won't change unnecessarily
  const contextValue = {
    searchTerm,
    setSearchTerm
  };

  return (
    <SearchContext.Provider value={contextValue}>
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) {
    console.warn('useSearch used outside SearchProvider - returning default values');
    return {
      searchTerm: '',
      setSearchTerm: () => {},
    };
  }
  return context;
};