"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

// Create a context for sessions
const SessionsContext = createContext<{
  sessions: Session[];
  setSessions: React.Dispatch<React.SetStateAction<Session[]>>;
  addSession: (session: Session) => void;
  getSession: (id: string) => Session | undefined;
  addMessage: (id: string, message: Message) => void;
  updateMessage: (id: string, message: Message) => void;
  deleteSession: (id: string) => void;
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

  function addMessage(id: string, message: Message) {
    setSessions((prevSessions) => prevSessions.map((s) => s.id === id ? { ...s, messages: [...s.messages, message] } : s));
    localStorage.setItem('sessions', JSON.stringify(sessions.map((s) => s.id === id ? { ...s, messages: [...s.messages, message] } : s)));
  }

  function updateMessage(id: string, message: Message) {
    setSessions((prevSessions) => {
      return prevSessions.map((s) => {
        if (s.id === id) {
          const updatedMessages = [...s.messages];
          const messageIndex = updatedMessages.findIndex((m) => m.id === message.id);
          if (messageIndex !== -1) {
            updatedMessages[messageIndex] = {
              ...updatedMessages[messageIndex],
              content: updatedMessages[messageIndex].content + message.content,
              toolOutput: message.toolOutput
            };
          }
          return { ...s, messages: updatedMessages };
        }
        return s;
      });
    });

    const updatedSessions = JSON.parse(localStorage.getItem('sessions') || '[]');
    const sessionIndex = updatedSessions.findIndex((s: Session) => s.id === id);
    if (sessionIndex !== -1) {
      const messageIndex = updatedSessions[sessionIndex].messages.findIndex((m: Message) => m.id === message.id);
      if (messageIndex !== -1) {
        updatedSessions[sessionIndex].messages[messageIndex] = {
          ...updatedSessions[sessionIndex].messages[messageIndex],
          content: updatedSessions[sessionIndex].messages[messageIndex].content + message.content,
          toolOutput: message.toolOutput
        };
        localStorage.setItem('sessions', JSON.stringify(updatedSessions));
      }
    }
  }

  function getSession(id: string) {
    return sessions.find((session) => session.id === id);
  }

  function deleteSession(id: string) {
    setSessions(sessions.filter((session) => session.id !== id));
    localStorage.setItem('sessions', JSON.stringify(sessions.filter((session) => session.id !== id)));
  }

  return (
    <SessionsContext.Provider value={{ sessions, setSessions, addSession, getSession, addMessage, updateMessage, deleteSession }}>
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
