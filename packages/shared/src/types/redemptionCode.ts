import { Album } from "./album";
import { Artist } from "./artist";
import { Song } from "./song";

export type RedemptionCode = {
  album: Album & {
    artist_to_album: {
      artist: Artist;
    }[];
  };
  id: string;
  redeemed_by?: string;
};
