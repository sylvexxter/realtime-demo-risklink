"use client";

import React, { createContext, useContext, useState, FC, PropsWithChildren } from "react";
import { v4 as uuidv4 } from "uuid";
import { TranscriptItem } from "@/app/types";
// Remove the direct import of the logger
// import { logMessage } from "@/app/server/utils/conversationLogger";

type TranscriptContextValue = {
  transcriptItems: TranscriptItem[];
  // Signature still includes agentName, as we need it to send to the API
  addTranscriptMessage: (itemId: string, agentName: string, role: "user" | "assistant", text: string, hidden?: boolean) => void;
  updateTranscriptMessage: (itemId: string, text: string, isDelta: boolean) => void;
  addTranscriptBreadcrumb: (title: string, data?: Record<string, any>) => void;
  toggleTranscriptItemExpand: (itemId: string) => void;
  updateTranscriptItemStatus: (itemId: string, newStatus: "IN_PROGRESS" | "DONE") => void;
};

const TranscriptContext = createContext<TranscriptContextValue | undefined>(undefined);

export const TranscriptProvider: FC<PropsWithChildren> = ({ children }) => {
  const [transcriptItems, setTranscriptItems] = useState<TranscriptItem[]>([]);

  // ... newTimestampPretty function ...

  const addTranscriptMessage: TranscriptContextValue["addTranscriptMessage"] = (itemId, agentName, role, text = "", isHidden = false) => {
    // Remove the direct call to logMessage
    // logMessage(agentName, role, text);

    // TODO: Add fetch call to API route here later

    setTranscriptItems((prev) => {
      if (prev.some((log) => log.itemId === itemId && log.type === "MESSAGE")) {
        console.warn(`[addTranscriptMessage] skipping; message already exists for itemId=${itemId}, role=${role}, text=${text}`);
        return prev;
      }

      const newItem: TranscriptItem = {
        itemId,
        type: "MESSAGE",
        role,
        title: text,
        expanded: false,
        timestamp: newTimestampPretty(),
        createdAtMs: Date.now(),
        status: "IN_PROGRESS",
        isHidden,
      };

      return [...prev, newItem];
    });
  };

  // ... other functions ...

  return (
    <TranscriptContext.Provider
      value={{
        transcriptItems,
        addTranscriptMessage, // Keep passing this function
        updateTranscriptMessage,
        addTranscriptBreadcrumb,
        toggleTranscriptItemExpand,
        updateTranscriptItemStatus,
      }}
    >
      {children}
    </TranscriptContext.Provider>
  );
};

// ... useTranscript hook ... 