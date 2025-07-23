export function formatDuration(seconds: number, variant: "short" | "long" = "short"): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  const paddedSeconds = remainingSeconds.toString().padStart(2, '0');

  if (variant === "long") {
    return `${minutes} minute${minutes !== 1 ? 's' : ''} ${remainingSeconds} second${remainingSeconds !== 1 ? 's' : ''}`;
  }

  return `${minutes}:${paddedSeconds}`;
}