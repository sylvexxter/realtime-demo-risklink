"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";

interface QAItem {
  question: string;
  answer: string;
}

interface QALogContextType {
  qaLog: QAItem[];
  addQAItem: (item: QAItem) => void;
}

const QALogContext = createContext<QALogContextType | undefined>(undefined);

export const QALogProvider = ({ children }: { children: ReactNode }) => {
  const [qaLog, setQaLog] = useState<QAItem[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("qa_log");
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  const addQAItem = (item: QAItem) => {
    const updated = [...qaLog, item];
    setQaLog(updated);
    localStorage.setItem("qa_log", JSON.stringify(updated));
  };

  return (
    <QALogContext.Provider value={{ qaLog, addQAItem }}>
      {children}
    </QALogContext.Provider>
  );
};

export const useQALog = () => {
  const context = useContext(QALogContext);
  if (!context) throw new Error("useQALog must be used inside QALogProvider");
  return context;
};