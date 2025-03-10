"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

// Create a context for sessions
const SessionsContext = createContext<{
  sessions: Session[];
  setSessions: React.Dispatch<React.SetStateAction<Session[]>>;
} | undefined>(undefined);

// Create a provider component
export const SessionsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [sessions, setSessions] = useState<Session[]>(() => {
    const storedSessions = localStorage.getItem('sessions');
    return storedSessions ? JSON.parse(storedSessions) as Session[] : [];
  });

  return (
    <SessionsContext.Provider value={{ sessions, setSessions }}>
      {children}
    </SessionsContext.Provider>
  );
};

// Custom hook to use the SessionsContext
export const useSessions = () => {
  const context = useContext(SessionsContext);
  if (context === undefined) {
    throw new Error('useSessions must be used within a SessionsProvider');
  }
  return context;
};
