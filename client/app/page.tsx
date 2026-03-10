"use client";

import { useState } from "react";
import { ChatMessage } from "./components/ChatMessage";
import { ChatInput } from "./components/ChatInput";
import { VideoPanel } from "./components/VideoPanel";
import { YoutubeIcon } from "./components/icons";

type Role = "user" | "assistant";

interface Message {
  id: string;
  role: Role;
  content: string;
  timestamp: string;
}

function extractYoutubeId(url: string): string | null {
  try {
    const u = new URL(url);
    if (u.searchParams.has("v")) return u.searchParams.get("v");
    if (u.hostname === "youtu.be") return u.pathname.slice(1) || null;
    const parts = u.pathname.split("/");
    const last = parts[parts.length - 1];
    return last || null;
  } catch {
    return null;
  }
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [videoUrl, setVideoUrl] = useState("");
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [input, setInput] = useState("");
  const [isLoadingVideo, setIsLoadingVideo] = useState(false);
  type LoadingAction = "summary" | "transcript" | "chat" | null;
  const [loadingAction, setLoadingAction] = useState<LoadingAction>(null);

  const backendBaseUrl = "http://localhost:5001/store-transcript";

  const addMessage = (role: Role, content: string) => {
    const timestamp = new Date().toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
    });
    setMessages((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        role,
        content,
        timestamp,
      },
    ]);
  };

  const handleLoadVideo = async () => {
    const url = videoUrl.trim();
    if (!url || isLoadingVideo) return;

    setIsLoadingVideo(true);
    try {
      setVideoLoaded(true);
      setMessages([]);
      addMessage(
        "assistant",
        "Video loaded. Ask a question about it in the chat.",
      );
    } catch (err: unknown) {
      addMessage(
        "assistant",
        `Error loading video: ${err instanceof Error ? err.message : "unknown error"}`,
      );
    } finally {
      setIsLoadingVideo(false);
    }
  };

  const handleSelectSampleVideo = (url: string) => {
    setVideoUrl(url);
    setVideoLoaded(true);
    setMessages([]);
    addMessage(
      "assistant",
      "Sample video loaded. You can generate a summary or view the transcript.",
    );
  };

  const askBackend = async (
    question: string,
    echoUser: boolean,
    action: LoadingAction = "chat"
  ) => {
    const trimmedQuestion = question.trim();
    if (!trimmedQuestion || loadingAction) return;

    const url = videoUrl.trim();
    if (!url) {
      addMessage(
        "assistant",
        "Please paste a YouTube URL and load the video first.",
      );
      return;
    }

    if (echoUser) {
      addMessage("user", trimmedQuestion);
      setInput("");
    }

    setLoadingAction(action);

    try {
      const res = await fetch(backendBaseUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, question: trimmedQuestion }),
      });

      if (!res.ok) {
        throw new Error(`Failed to get answer (status ${res.status})`);
      }

      const data = await res.json();
      const answerText =
        typeof data === "string"
          ? data
          : Array.isArray(data)
          ? data
              .map((d: any) =>
                typeof d === "string" ? d : d.pageContent ?? "",
              )
              .join("\n\n")
          : data.pageContent ?? JSON.stringify(data, null, 2);

      addMessage("assistant", answerText || "No useful answer returned.");
    } catch (err: any) {
      addMessage(
        "assistant",
        `Error getting answer: ${err?.message ?? "unknown error"}`,
      );
    } finally {
      setLoadingAction(null);
    }
  };

  const handleSend = async () => {
    await askBackend(input, true);
  };

  const embedId = extractYoutubeId(videoUrl);
  const videoInfo =
    embedId && videoLoaded
      ? {
          id: embedId,
          title: "YouTube Video",
        }
      : null;

  const isVideoReady = Boolean(videoLoaded && embedId);

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 z-40 h-full w-80 transform border-r border-border bg-card transition-transform duration-300 lg:relative lg:translate-x-0">
        <VideoPanel
          videoInfo={videoInfo}
          videoUrl={videoUrl}
          onVideoUrlChange={setVideoUrl}
          onLoadVideo={handleLoadVideo}
          isLoading={isLoadingVideo}
          onGenerateSummary={() =>
            askBackend("Give me a concise summary of this video.", false, "summary")
          }
          onViewTranscript={() =>
            askBackend(
              "Show me the full (or as much as possible) cleaned transcript of this video.",
              false,
              "transcript",
            )
          }
          actionsDisabled={loadingAction !== null || !isVideoReady}
          loadingSummary={loadingAction === "summary"}
          loadingTranscript={loadingAction === "transcript"}
          onSelectSampleVideo={handleSelectSampleVideo}
        />
      </aside>

      {/* Main Content */}
      <main className="flex flex-1 flex-col">
        {/* Header */}
        <header className="flex items-center justify-between border-b border-border bg-card px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <YoutubeIcon className="h-4 w-4 text-white" />
              </div>
              <h1 className="text-xl font-bold">
                Talk<span className="text-primary">Tube</span>
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden rounded-full px-3 py-1 text-xs font-medium sm:inline-flex">
              {isVideoReady
                ? "Video ready for questions"
                : "Paste a YouTube URL and load it"}
            </span>
          </div>
        </header>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto">
          <div className="divide-y divide-border">
            {messages.map((message) => (
              <ChatMessage
                key={message.id}
                role={message.role}
                content={message.content}
                timestamp={message.timestamp}
              />
            ))}
            {messages.length === 0 && (
              <div className="px-4 py-6 text-sm text-muted">
                1. Paste a YouTube URL on the left and click Load.{"\n"}
                2. Then ask any question about the video here.
              </div>
            )}
          </div>
        </div>

        {/* Input Area */}
        <ChatInput
          placeholder={
            isVideoReady
              ? "Ask anything about this video..."
              : "Load a video first, then ask a question..."
          }
          value={input}
          onChange={setInput}
          onSend={handleSend}
          disabled={loadingAction !== null || !isVideoReady}
        />
      </main>
    </div>
  );
}
