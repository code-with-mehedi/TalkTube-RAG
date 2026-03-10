import { SendIcon } from "./icons";

interface ChatInputProps {
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  disabled?: boolean;
}

export function ChatInput({
  placeholder = "Ask anything about this video...",
  value,
  onChange,
  onSend,
  disabled = false,
}: ChatInputProps) {
  const handleSend = () => {
    if (!disabled && value.trim()) onSend();
  };

  return (
    <div className="border-t border-border bg-card p-4">
      <div className="relative flex items-end gap-2 rounded-2xl border border-border bg-background px-4 py-3 shadow-sm transition-shadow focus-within:shadow-md focus-within:border-primary/50">
        <textarea
          placeholder={placeholder}
          rows={1}
          className="flex-1 resize-none bg-transparent text-sm outline-none placeholder:text-muted"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
        />
        <button
          type="button"
          onClick={handleSend}
          disabled={disabled || !value.trim()}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-white transition-all hover:bg-primary-hover disabled:opacity-50"
        >
          <SendIcon className="h-4 w-4" />
        </button>
      </div>
      <p className="mt-2 text-center text-xs text-muted">
        TalkTube can make mistakes. Consider verifying important information.
      </p>
    </div>
  );
}
