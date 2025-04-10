import React from "react";
import { TranscriptProvider } from "@/app/contexts/TranscriptContext";
import { EventProvider } from "@/app/contexts/EventContext";
import App from "./App";
import { QALogProvider } from "@/app/contexts/QALogContext";

export default function Page() {
  return (
    <TranscriptProvider>
      <EventProvider>
        <QALogProvider>
          <App />
        </QALogProvider>
      </EventProvider>
    </TranscriptProvider>
  );
}
