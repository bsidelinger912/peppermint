<script lang="ts">
	import Play from "svelte-ionicons/Play.svelte";

	import AddToQueue from "$lib/components/ds/icons/playlist-add.svelte";
	import Tooltip from "$lib/components/tooltip/tooltip.svelte";
	import { addToPlaylist, playNow } from "$lib/components/audio-player/store";

	import Download from "./download.svelte";
	import SongRow from "./song-row.svelte";
  import type { Album, Song, Artist } from "@peppermint/shared";

  export let userOwnsAlbum: boolean;
  export let album: Album;
  export let songs: (Song & { trackNumber: number })[];
  export let artist: Artist;

  $: sortedSongs = songs.sort((a, b) => (a.trackNumber || 0) - (b.trackNumber || 0))

  function play(e: MouseEvent) {
    e.stopPropagation();
    e.preventDefault();

    sortedSongs.forEach((song, i) => {
      if (i === 0) {
        playNow({
          name: song.title,
          artistName: artist.name,
          songId: String(song.id), // todo could probably pass the number here
          artistId: String(artist.id),
          image: song.image as string,
          url: song.mp3,
        });
      } else {
        addToPlaylist({
          name: song.title,
          artistName: artist.name,
          songId: String(song.id), // todo could probably pass the number here
          artistId: String(artist.id),
          image: song.image as string,
          url: song.mp3,
        });
      }
    });
  }

  function add(e: MouseEvent) {
    e.stopPropagation();
    e.preventDefault();

    sortedSongs.forEach((song, i) => {
      addToPlaylist({
        name: song.title,
        artistName: artist.name,
        songId: String(song.id), // todo could probably pass the number here
        artistId: String(artist.id),
        image: song.image as string,
        url: song.mp3,
      });
    });
  }
</script>

<div class="flex flex-col gap-6">
  <div class="flex flex-col gap-6">
    {#if userOwnsAlbum}
      <div class="flex items-center justify-between">
        <div class="flex gap-4 items-center text-slate-600">
          <Tooltip>
            <button on:click={play}>
              <div class="rounded-full p-2 bg-green-700 border border-green-900 hover:bg-slate-500">
                <Play size="24" class="text-white relative left-[1px]" />
              </div>
            </button>

            <p slot="content">
              Play now
            </p>
          </Tooltip>
          <Tooltip>
            <button on:click={add} class="hover:text-slate-500">
              <AddToQueue size="28" />
            </button>

            <p slot="content">
              Add to queue
            </p>
          </Tooltip>
        </div>

        <div>
          <Download {songs} {artist} />
        </div>
      </div>
    {/if}
    
    <div class="flex flex-col gap-2">
      <h3 class="text-lg font-semibold">From the artist:</h3>
      <p>
        {album.description}
      </p>
    </div>
 

    <hr />

    <div class="flex flex-col gap-3">
      <h2 class="font-semibold text-2xl">Songs</h2>

      <div class="flex flex-col gap-2">
        {#each sortedSongs as song, i}
          <SongRow {song} {artist} songNumber={i + 1} {userOwnsAlbum} />
        {/each}
      </div>
    </div>
  </div>
</div>