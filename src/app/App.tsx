/**
 * Main Application Component
 * This is the root component of the application that handles real-time audio communication
 * with OpenAI's API, including voice input/output and text messaging.
 */

"use client";

import React, { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { v4 as uuidv4 } from "uuid";

import Image from "next/image";

// UI Components
import Transcript from "./components/Transcript";        // Handles chat transcript display
import Events from "./components/Events";               // Displays system events and logs
import BottomToolbar from "./components/BottomToolbar"; // Contains control buttons and settings

// Types
import { AgentConfig, SessionStatus } from "@/app/types";

// Context Providers & Hooks
import { useTranscript } from "@/app/contexts/TranscriptContext";  // Manages chat transcript state
import { useEvent } from "@/app/contexts/EventContext";           // Manages system events
import { useHandleServerEvent } from "./hooks/useHandleServerEvent"; // Handles server events

// Utilities
import { createRealtimeConnection } from "./lib/realtimeConnection"; // WebRTC connection setup

// Agent Configurations
import { allAgentSets, defaultAgentSetKey } from "@/app/agentConfigs";

function App() {
  // URL Parameters
  const searchParams = useSearchParams();

  // Context Hooks
  const { transcriptItems, addTranscriptMessage, addTranscriptBreadcrumb } = useTranscript();
  const { logClientEvent, logServerEvent } = useEvent();

  // State Management
  const [selectedAgentName, setSelectedAgentName] = useState<string>("");           // Currently selected agent
  const [selectedAgentConfigSet, setSelectedAgentConfigSet] = useState<AgentConfig[] | null>(null); // Agent configuration set

  // WebRTC Connection State
  const [dataChannel, setDataChannel] = useState<RTCDataChannel | null>(null);      // Data channel for communication
  const pcRef = useRef<RTCPeerConnection | null>(null);                            // Peer connection reference
  const dcRef = useRef<RTCDataChannel | null>(null);                               // Data channel reference
  const audioElementRef = useRef<HTMLAudioElement | null>(null);                   // Audio element reference
  const [sessionStatus, setSessionStatus] = useState<SessionStatus>("DISCONNECTED"); // Connection status

  // UI State
  const [isEventsPaneExpanded, setIsEventsPaneExpanded] = useState<boolean>(true);  // Events panel visibility
  const [userText, setUserText] = useState<string>("");                            // User input text
  const [isPTTActive, setIsPTTActive] = useState<boolean>(false);                   // Push-to-talk mode
  const [isPTTUserSpeaking, setIsPTTUserSpeaking] = useState<boolean>(false);       // User speaking state
  const [isAudioPlaybackEnabled, setIsAudioPlaybackEnabled] = useState<boolean>(true); // Audio playback toggle

  /**
   * Sends a client event to the server through the data channel
   * @param eventObj - The event object to send
   * @param eventNameSuffix - Optional suffix for event logging
   */
  const sendClientEvent = (eventObj: any, eventNameSuffix = "") => {
    if (dcRef.current && dcRef.current.readyState === "open") {
      logClientEvent(eventObj, eventNameSuffix);
      dcRef.current.send(JSON.stringify(eventObj));
    } else {
      logClientEvent({ attemptedEvent: eventObj.type }, "error.data_channel_not_open");
      console.error("Failed to send message - no data channel available", eventObj);
    }
  };

  // Server event handler reference
  const handleServerEventRef = useHandleServerEvent({
    setSessionStatus,
    selectedAgentName,
    selectedAgentConfigSet,
    sendClientEvent,
    setSelectedAgentName,
  });

  /**
   * Effect: Initialize agent configuration from URL parameters
   * Sets up the initial agent configuration based on URL parameters or defaults
   */
  useEffect(() => {
    let finalAgentConfig = searchParams.get("agentConfig");
    if (!finalAgentConfig || !allAgentSets[finalAgentConfig]) {
      finalAgentConfig = defaultAgentSetKey;
      const url = new URL(window.location.toString());
      url.searchParams.set("agentConfig", finalAgentConfig);
      window.location.replace(url.toString());
      return;
    }

    const agents = allAgentSets[finalAgentConfig];
    const agentKeyToUse = agents[0]?.name || "";

    setSelectedAgentName(agentKeyToUse);
    setSelectedAgentConfigSet(agents);
  }, [searchParams]);

  /**
   * Effect: Connect to realtime when agent is selected
   * Automatically connects to the realtime service when an agent is selected
   */
  useEffect(() => {
    if (selectedAgentName && sessionStatus === "DISCONNECTED") {
      connectToRealtime();
    }
  }, [selectedAgentName]);

  /**
   * Effect: Update session when connected
   * Updates the session configuration when connected to the realtime service
   */
  useEffect(() => {
    if (sessionStatus === "CONNECTED" && selectedAgentConfigSet && selectedAgentName) {
      const currentAgent = selectedAgentConfigSet.find((a) => a.name === selectedAgentName);
      addTranscriptBreadcrumb(`Agent: ${selectedAgentName}`, currentAgent);
      updateSession(true);
    }
  }, [selectedAgentConfigSet, selectedAgentName, sessionStatus]);

  /**
   * Effect: Update session when PTT mode changes
   * Updates the session configuration when push-to-talk mode is toggled
   */
  useEffect(() => {
    if (sessionStatus === "CONNECTED") {
      console.log(`updatingSession, isPTTACtive=${isPTTActive} sessionStatus=${sessionStatus}`);
      updateSession();
    }
  }, [isPTTActive]);

  /**
   * Fetches an ephemeral key for the session
   * @returns Promise<string | null> - The ephemeral key or null if failed
   */
  const fetchEphemeralKey = async (): Promise<string | null> => {
    logClientEvent({ url: "/session" }, "fetch_session_token_request");
    const tokenResponse = await fetch("/api/session");
    const data = await tokenResponse.json();
    logServerEvent(data, "fetch_session_token_response");

    if (!data.client_secret?.value) {
      logClientEvent(data, "error.no_ephemeral_key");
      console.error("No ephemeral key provided by the server");
      setSessionStatus("DISCONNECTED");
      return null;
    }

    return data.client_secret.value;
  };

  /**
   * Establishes a realtime connection with the server
   * Sets up WebRTC connection and data channel for communication
   */
  const connectToRealtime = async () => {
    if (sessionStatus !== "DISCONNECTED") return;
    setSessionStatus("CONNECTING");

    try {
      const EPHEMERAL_KEY = await fetchEphemeralKey();
      if (!EPHEMERAL_KEY) {
        return;
      }

      if (!audioElementRef.current) {
        audioElementRef.current = document.createElement("audio");
      }
      audioElementRef.current.autoplay = isAudioPlaybackEnabled;

      const { pc, dc } = await createRealtimeConnection(
        EPHEMERAL_KEY,
        audioElementRef
      );
      pcRef.current = pc;
      dcRef.current = dc;

      // Set up data channel event listeners
      dc.addEventListener("open", () => {
        logClientEvent({}, "data_channel.open");
      });
      dc.addEventListener("close", () => {
        logClientEvent({}, "data_channel.close");
      });
      dc.addEventListener("error", (err: any) => {
        logClientEvent({ error: err }, "data_channel.error");
      });
      dc.addEventListener("message", (e: MessageEvent) => {
        handleServerEventRef.current(JSON.parse(e.data));
      });

      setDataChannel(dc);
    } catch (err) {
      console.error("Error connecting to realtime:", err);
      setSessionStatus("DISCONNECTED");
    }
  };

  /**
   * Disconnects from the realtime service
   * Cleans up WebRTC connections and resets state
   */
  const disconnectFromRealtime = () => {
    if (pcRef.current) {
      pcRef.current.getSenders().forEach((sender) => {
        if (sender.track) {
          sender.track.stop();
        }
      });

      pcRef.current.close();
      pcRef.current = null;
    }
    setDataChannel(null);
    setSessionStatus("DISCONNECTED");
    setIsPTTUserSpeaking(false);

    logClientEvent({}, "disconnected");
  };

  /**
   * Sends a simulated user message
   * @param text - The message text to send
   */
  const sendSimulatedUserMessage = (text: string) => {
    const id = uuidv4().slice(0, 32);
    addTranscriptMessage(id, "user", text, true);

    sendClientEvent(
      {
        type: "conversation.item.create",
        item: {
          id,
          type: "message",
          role: "user",
          content: [{ type: "input_text", text }],
        },
      },
      "(simulated user text message)"
    );
    sendClientEvent(
      { type: "response.create" },
      "(trigger response after simulated user text message)"
    );
  };

  /**
   * Updates the current session configuration
   * @param shouldTriggerResponse - Whether to trigger a response after update
   */
  const updateSession = (shouldTriggerResponse: boolean = false) => {
    sendClientEvent(
      { type: "input_audio_buffer.clear" },
      "clear audio buffer on session update"
    );

    const currentAgent = selectedAgentConfigSet?.find(
      (a) => a.name === selectedAgentName
    );

    // Voice Activity Detection (VAD) settings
    const turnDetection = isPTTActive
      ? null
      : {
          type: "server_vad",
          threshold: 0.6,          // Voice detection sensitivity (0-1)
          prefix_padding_ms: 300,  // Audio padding before speech
          silence_duration_ms: 200, // Silence duration to end speech
          create_response: true,
        };

    const instructions = currentAgent?.instructions || "";
    const tools = currentAgent?.tools || [];

    const sessionUpdateEvent = {
      type: "session.update",
      session: {
        modalities: ["text", "audio"],
        instructions,
        voice: "coral",
        input_audio_format: "pcm16",
        output_audio_format: "pcm16",
        input_audio_transcription: { 
          model: "gpt-4o-mini-transcribe",
          language: "en"
        },
        turn_detection: turnDetection,
        tools,
      },
    };

    sendClientEvent(sessionUpdateEvent);

    if (shouldTriggerResponse) {
      sendSimulatedUserMessage("hi");
    }
  };

  /**
   * Cancels the assistant's current speech
   * Stops the current response and allows for user interruption
   */
  const cancelAssistantSpeech = async () => {
    const mostRecentAssistantMessage = [...transcriptItems]
      .reverse()
      .find((item) => item.role === "assistant");

    if (!mostRecentAssistantMessage) {
      console.warn("can't cancel, no recent assistant message found");
      return;
    }
    if (mostRecentAssistantMessage.status === "DONE") {
      console.log("No truncation needed, message is DONE");
      return;
    }

    sendClientEvent({
      type: "conversation.item.truncate",
      item_id: mostRecentAssistantMessage?.itemId,
      content_index: 0,
      audio_end_ms: Date.now() - mostRecentAssistantMessage.createdAtMs,
    });
    sendClientEvent(
      { type: "response.cancel" },
      "(cancel due to user interruption)"
    );
  };

  /**
   * Handles sending a text message
   * Processes and sends user text input
   */
  const handleSendTextMessage = () => {
    if (!userText.trim()) return;
    cancelAssistantSpeech();

    sendClientEvent(
      {
        type: "conversation.item.create",
        item: {
          type: "message",
          role: "user",
          content: [{ type: "input_text", text: userText.trim() }],
        },
      },
      "(send user text message)"
    );
    setUserText("");

    sendClientEvent({ type: "response.create" }, "trigger response");
  };

  /**
   * Handles push-to-talk button press
   * Initiates voice input when the talk button is pressed
   */
  const handleTalkButtonDown = () => {
    if (sessionStatus !== "CONNECTED" || dataChannel?.readyState !== "open")
      return;
    cancelAssistantSpeech();

    setIsPTTUserSpeaking(true);
    sendClientEvent({ type: "input_audio_buffer.clear" }, "clear PTT buffer");
  };

  /**
   * Handles push-to-talk button release
   * Ends voice input and sends the recorded audio
   */
  const handleTalkButtonUp = () => {
    if (
      sessionStatus !== "CONNECTED" ||
      dataChannel?.readyState !== "open" ||
      !isPTTUserSpeaking
    )
      return;

    setIsPTTUserSpeaking(false);
    sendClientEvent({ type: "input_audio_buffer.commit" }, "commit PTT");
    sendClientEvent({ type: "response.create" }, "trigger response PTT");
  };

  /**
   * Toggles the realtime connection
   * Connects or disconnects from the realtime service
   */
  const onToggleConnection = () => {
    if (sessionStatus === "CONNECTED" || sessionStatus === "CONNECTING") {
      disconnectFromRealtime();
      setSessionStatus("DISCONNECTED");
    } else {
      connectToRealtime();
    }
  };

  /**
   * Handles agent configuration change
   * Updates the URL and reloads the page with new agent configuration
   */
  const handleAgentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newAgentConfig = e.target.value;
    const url = new URL(window.location.toString());
    url.searchParams.set("agentConfig", newAgentConfig);
    window.location.replace(url.toString());
  };

  /**
   * Handles selected agent change
   * Updates the currently selected agent
   */
  const handleSelectedAgentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newAgentName = e.target.value;
    setSelectedAgentName(newAgentName);
  };

  /**
   * Handles downloading the generated PDF report
   */
  const handleDownloadReport = async () => {
    try {
      const response = await fetch('/api/report/download');
      if (!response.ok) {
        console.error('Failed to generate report', response.status);
        return;
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const disposition = response.headers.get('Content-Disposition') || '';
      const match = disposition.match(/filename="(.+)"/);
      const filename = match ? match[1] : 'Risk_Assessment_Report.pdf';
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to download report', error);
    }
  };

  /**
   * Effect: Load saved UI preferences
   * Restores user preferences from localStorage
   */
  useEffect(() => {
    const storedPushToTalkUI = localStorage.getItem("pushToTalkUI");
    if (storedPushToTalkUI) {
      setIsPTTActive(storedPushToTalkUI === "true");
    }
    const storedLogsExpanded = localStorage.getItem("logsExpanded");
    if (storedLogsExpanded) {
      setIsEventsPaneExpanded(storedLogsExpanded === "true");
    }
    const storedAudioPlaybackEnabled = localStorage.getItem("audioPlaybackEnabled");
    if (storedAudioPlaybackEnabled) {
      setIsAudioPlaybackEnabled(storedAudioPlaybackEnabled === "true");
    }
  }, []);

  /**
   * Effect: Save PTT preference
   * Persists push-to-talk preference to localStorage
   */
  useEffect(() => {
    localStorage.setItem("pushToTalkUI", isPTTActive.toString());
  }, [isPTTActive]);

  /**
   * Effect: Save logs preference
   * Persists logs panel visibility preference to localStorage
   */
  useEffect(() => {
    localStorage.setItem("logsExpanded", isEventsPaneExpanded.toString());
  }, [isEventsPaneExpanded]);

  /**
   * Effect: Save audio playback preference
   * Persists audio playback preference to localStorage
   */
  useEffect(() => {
    localStorage.setItem("audioPlaybackEnabled", isAudioPlaybackEnabled.toString());
  }, [isAudioPlaybackEnabled]);

  /**
   * Effect: Handle audio playback
   * Controls audio playback based on user preference
   */
  useEffect(() => {
    if (audioElementRef.current) {
      if (isAudioPlaybackEnabled) {
        audioElementRef.current.play().catch((err) => {
          console.warn("Autoplay may be blocked by browser:", err);
        });
      } else {
        audioElementRef.current.pause();
      }
    }
  }, [isAudioPlaybackEnabled]);

  const agentSetKey = searchParams.get("agentConfig") || "default";

  return (
    <div className="text-base flex flex-col h-screen bg-gray-100 text-gray-800 relative">
      {/* Header Section */}
      <div className="h-16 px-5 text-lg font-semibold flex justify-between items-center">
        <div className="flex items-center h-full">
          <div>
            Cybersecurity <span className="text-gray-500">Risk Assessment</span>
          </div>
        </div>
        <div className="flex items-center">
          {/* Download Report button only (scenario & agent selectors removed) */}
          <button
            onClick={handleDownloadReport}
            className="ml-6 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg"
          >
            Download Report
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1 gap-2 px-2 overflow-hidden relative">
        <Transcript
          userText={userText}
          setUserText={setUserText}
          onSendMessage={handleSendTextMessage}
          canSend={sessionStatus === "CONNECTED" && dcRef.current?.readyState === "open"}
        />

        <Events isExpanded={isEventsPaneExpanded} />
      </div>

      {/* Bottom Toolbar */}
      <BottomToolbar
        sessionStatus={sessionStatus}
        onToggleConnection={onToggleConnection}
        isPTTActive={isPTTActive}
        setIsPTTActive={setIsPTTActive}
        isPTTUserSpeaking={isPTTUserSpeaking}
        handleTalkButtonDown={handleTalkButtonDown}
        handleTalkButtonUp={handleTalkButtonUp}
        isEventsPaneExpanded={isEventsPaneExpanded}
        setIsEventsPaneExpanded={setIsEventsPaneExpanded}
        isAudioPlaybackEnabled={isAudioPlaybackEnabled}
        setIsAudioPlaybackEnabled={setIsAudioPlaybackEnabled}
      />
    </div>
  );
}

export default App;
