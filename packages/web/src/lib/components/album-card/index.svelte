<script lang="ts">
  import Play from "svelte-ionicons/Play.svelte";
  
  import AddToQueue from "$lib/components/ds/icons/playlist-add.svelte";
	// import { collectionQuery, documentQuery } from "$lib/api/firestoreQuery";
	// import { db } from "$lib/firebase";
	// import type { Song } from "$lib/db/songs";
	// import type { Artist } from "$lib/db/artists";


  import MenuCard from "../menu-card/index.svelte";
	import { addToPlaylist, playNow } from "../audio-player/store";
  import type { Album, Artist } from "@peppermint/shared";
  
  export let album: Album & {
    artist_to_album: {
      artist: Artist;
    }[];
  };;

  // function play(e: MouseEvent) {
  //   e.stopPropagation();
  //   e.preventDefault();

  //   if (!$songs || !$artist) {
  //     return;
  //   }

  //   $songs.forEach((song, i) => {
  //     if (i === 0) {
  //       playNow({
  //         name: song.name,
  //         artistName: $artist.name,
  //         songId: song.id,
  //         artistId: album.artist,
  //         image: song.image as string,
  //         url: song.mp3,
  //       });
  //     } else {
  //       addToPlaylist({
  //         name: song.name,
  //         artistName: $artist.name,
  //         songId: song.id,
  //         artistId: album.artist,
  //         image: song.image as string,
  //         url: song.mp3,
  //       });
  //     }
  //   });
  // }

  // function add(e: MouseEvent) {
  //   e.stopPropagation();
  //   e.preventDefault();

  //   if (!$songs || !$artist) {
  //     return;
  //   }

  //   $songs.forEach((song, i) => {
  //     addToPlaylist({
  //       name: song.name,
  //       artistName: $artist.name,
  //       songId: song.id,
  //       artistId: album.artist,
  //       image: song.image as string,
  //       url: song.mp3,
  //     });
  //   });
  // }
</script>

<MenuCard title={album.name} image={album.image} subTitle={album.artist_to_album.map(({ artist }) => artist.name).join(", ")}>
  <!-- <div slot="actions" class="text-white flex gap-3">
    <button on:click={play}>
      <Play size="20"  />
    </button>
    <button on:click={add}>
      <AddToQueue size="20" />
    </button>
  </div> -->
</MenuCard>