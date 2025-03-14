import { Album, Song } from "@peppermint/shared";
import { documentDirectory } from "expo-file-system";

export function getFilePath(album: Album, song: Song) {
  return documentDirectory + `${song.title}.mp3`;
}
