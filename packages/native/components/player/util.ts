import { getInfoAsync } from "expo-file-system";

import { Song, Album } from "@peppermint/shared";
import { getFilePath } from "~/utils/files";

export async function getBestPlayableFile(album: Album, song: Song) {
  const downloadedFilePath = getFilePath(album, song);

  const fileInfo = await getInfoAsync(downloadedFilePath);

  if (fileInfo) {
    return downloadedFilePath;
  }

  return song.mp3;
}
