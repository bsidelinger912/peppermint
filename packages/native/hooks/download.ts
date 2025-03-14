import { Album, Song } from "@peppermint/shared";
import { useState } from "react";
import {
  DownloadProgressData,
  DownloadResumable,
  FileSystemDownloadResult,
  FileSystemNetworkTaskProgressCallback,
  createDownloadResumable,
  documentDirectory,
} from "expo-file-system";
import { getFilePath } from "~/utils/files";

export function useDownloadSongs(
  album: Album,
  songs: Song[],
  options: { onSuccess?: (results: (FileSystemDownloadResult | undefined)[]) => void }
) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const [downloads, setDownloads] = useState<DownloadResumable[] | undefined>();
  const [_, setProgressList] = useState<number[] | undefined>();
  const [aggregateProgress, setAggregateProgress] = useState<number>(0);

  async function download() {
    setLoading(true);
    setError(undefined);

    const newDownloads = songs.map((song, i) => {
      const callback: FileSystemNetworkTaskProgressCallback<DownloadProgressData> = (
        downloadProgress
      ) => {
        const progress =
          downloadProgress.totalBytesWritten / downloadProgress.totalBytesExpectedToWrite;
        setProgressList((curr) => {
          const next = [...(curr || [])];
          next[i] = progress;

          // Calculate average progress
          const average = next.reduce((sum, val) => sum + (val || 0), 0) / songs.length;
          setAggregateProgress(average);

          return next;
        });
      };

      // todo: wave as well
      const downloadResumable = createDownloadResumable(
        song.mp3,
        getFilePath(album, song),
        {},
        callback
      );

      return downloadResumable;
    });

    setDownloads((curr) => curr?.concat(newDownloads));
    try {
      const results = await Promise.all(newDownloads.map((download) => download.downloadAsync()));
      options?.onSuccess?.(results);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return { loading, error, downloads, download, progress: aggregateProgress };
}
