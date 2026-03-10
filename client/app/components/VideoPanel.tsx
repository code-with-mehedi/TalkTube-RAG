import { YoutubeIcon, LinkIcon, FileTextIcon, SparklesIcon, LoaderIcon } from "./icons";

interface VideoPanelProps {
  videoInfo: { id: string; title: string } | null;
  videoUrl: string;
  onVideoUrlChange: (url: string) => void;
  onLoadVideo: () => void;
  isLoading: boolean;
  onGenerateSummary: () => void;
  onViewTranscript: () => void;
  actionsDisabled: boolean;
  loadingSummary: boolean;
  loadingTranscript: boolean;
  onSelectSampleVideo: (url: string) => void;
}

const SAMPLE_VIDEOS = [
  {
    label: "TED Talk",
    url: "https://www.youtube.com/watch?v=qp0HIF3SfI4",
  },
  {
    label: "Tech Review",
    url: "https://www.youtube.com/watch?v=8jPQjjsBbIc",
  },
] as const;

export function VideoPanel({
  videoInfo,
  videoUrl,
  onVideoUrlChange,
  onLoadVideo,
  isLoading,
  onGenerateSummary,
  onViewTranscript,
  actionsDisabled,
  loadingSummary,
  loadingTranscript,
  onSelectSampleVideo,
}: VideoPanelProps) {
  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="border-b border-border p-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <YoutubeIcon className="h-4 w-4 text-white" />
          </div>
          <div>
            <h2 className="font-semibold">Video Source</h2>
            <p className="text-xs text-muted">Add a YouTube video to chat</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* URL Input */}
        <div className="space-y-3">
          <label className="text-sm font-medium">YouTube URL</label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <LinkIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
              <input
                type="text"
                placeholder="https://youtube.com/watch?v=..."
                className="w-full rounded-lg border border-border bg-background py-2.5 pl-10 pr-4 text-sm outline-none transition-colors placeholder:text-muted focus:border-primary"
                value={videoUrl}
                onChange={(e) => onVideoUrlChange(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <button
              type="button"
              onClick={onLoadVideo}
              disabled={isLoading || !videoUrl.trim()}
              className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-hover disabled:opacity-50"
            >
              {isLoading ? "Loading..." : "Load"}
            </button>
          </div>
        </div>

        {/* Video Preview */}
        {videoInfo && (
          <div className="mt-6 space-y-4">
            <div className="overflow-hidden rounded-xl border border-border bg-card">
              <div className="aspect-video w-full">
                <iframe
                  src={`https://www.youtube.com/embed/${videoInfo.id}`}
                  title={videoInfo.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="h-full w-full"
                />
              </div>
              <div className="p-3">
                <h3 className="line-clamp-2 text-sm font-medium">{videoInfo.title}</h3>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid gap-2">
              <button
                type="button"
                onClick={onGenerateSummary}
                disabled={actionsDisabled}
                className="flex items-center justify-center gap-2 rounded-lg border border-border bg-card py-2.5 text-sm font-medium transition-colors hover:bg-secondary disabled:opacity-50"
              >
                {loadingSummary ? (
                  <LoaderIcon className="h-4 w-4 animate-spin" />
                ) : (
                  <SparklesIcon className="h-4 w-4" />
                )}
                {loadingSummary ? "Generating..." : "Generate Summary"}
              </button>
              <button
                type="button"
                onClick={onViewTranscript}
                disabled={actionsDisabled}
                className="flex items-center justify-center gap-2 rounded-lg border border-border bg-card py-2.5 text-sm font-medium transition-colors hover:bg-secondary disabled:opacity-50"
              >
                {loadingTranscript ? (
                  <LoaderIcon className="h-4 w-4 animate-spin" />
                ) : (
                  <FileTextIcon className="h-4 w-4" />
                )}
                {loadingTranscript ? "Loading transcript..." : "View Transcript"}
              </button>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!videoInfo && (
          <div className="mt-8 flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-border p-8 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent">
              <YoutubeIcon className="h-6 w-6 text-primary" />
            </div>
            <h3 className="mt-4 font-medium">No video loaded</h3>
            <p className="mt-1 text-sm text-muted">
              Paste a YouTube URL above to get started
            </p>
          </div>
        )}
      </div>

      {/* Suggested Videos */}
      <div className="border-t border-border p-4">
        <p className="mb-3 text-xs font-medium text-muted">Try these examples:</p>
        <div className="space-y-2">
          {SAMPLE_VIDEOS.map(({ label, url }) => (
            <button
              key={url}
              type="button"
              onClick={() => onSelectSampleVideo(url)}
              className="flex w-full items-center gap-2 rounded-lg bg-secondary/50 px-3 py-2 text-left text-sm transition-colors hover:bg-secondary"
            >
              <YoutubeIcon className="h-4 w-4 shrink-0 text-primary" />
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
