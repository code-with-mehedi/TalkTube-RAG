import { BotIcon, UserIcon, CopyIcon } from "./icons";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
  timestamp?: string;
}

export function ChatMessage({ role, content, timestamp }: ChatMessageProps) {
  const isUser = role === "user";

  return (
    <div className={`flex gap-3 px-4 py-4 ${isUser ? "bg-transparent" : "bg-secondary/50"}`}>
      <div
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
          isUser ? "bg-foreground text-background" : "bg-primary text-white"
        }`}
      >
        {isUser ? <UserIcon className="h-4 w-4" /> : <BotIcon className="h-4 w-4" />}
      </div>
      <div className="flex-1 space-y-2 overflow-hidden">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">{isUser ? "You" : "TalkTube AI"}</span>
          {timestamp && (
            <span className="text-xs text-muted">{timestamp}</span>
          )}
        </div>
        <div className="prose prose-sm max-w-none text-foreground">
          <p className="whitespace-pre-wrap leading-relaxed">{content}</p>
        </div>
        {!isUser && (
          <div className="flex items-center gap-2 pt-2">
            <button className="flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-muted transition-colors hover:bg-secondary hover:text-foreground">
              <CopyIcon className="h-3 w-3" />
              Copy
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
