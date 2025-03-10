"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

// Create a context for sessions
const SessionsContext = createContext<{
  sessions: Session[];
  setSessions: React.Dispatch<React.SetStateAction<Session[]>>;
  addSession: (session: Session) => void;
  getSession: (id: string) => Session | undefined;
} | undefined>(undefined);

// Create a provider component
export const SessionsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [sessions, setSessions] = useState<Session[]>(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const storedSessions = localStorage.getItem('sessions');
      return storedSessions ? JSON.parse(storedSessions) as Session[] : [];
    }
    return [];
  });

  function addSession(session: Session) {
    setSessions((prevSessions) => [...prevSessions, session]);
    localStorage.setItem('sessions', JSON.stringify([...sessions, session]));
  }

  function getSession(id: string) {
    return sessions.find((session) => session.id === id);
  }

  return (
    <SessionsContext.Provider value={{ sessions, setSessions, addSession, getSession }}>
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
