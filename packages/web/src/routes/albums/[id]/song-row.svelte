<script lang="ts">
  import PlayOutline from "svelte-ionicons/PlayCircle.svelte";

  import Link from "$lib/components/ds/link/index.svelte"; 
	import { playNow, addToPlaylist, playlist, isPlaying } from "$lib/components/audio-player/store";
  import BarsLoader from "$lib/components/ds/icons/bars-loader.svelte";

	import { formatDuration } from "./utils";
	import AddToQueue from "$lib/components/ds/icons/playlist-add.svelte";
	import Tooltip from "$lib/components/tooltip/tooltip.svelte";
  import type { Song, Artist } from "@peppermint/shared";

  export let song: Song;
  export let songNumber: number;
  export let artist: Artist;
  export let userOwnsAlbum: boolean;

  $: currentPlaylistItem = $playlist[0];

  function play() {
    playNow({
      name: song.title,
      artistName: artist.name,
      songId: String(song.id), // todo could probably pass the number here
      artistId: String(artist.id),
      image: song.image as string,
      url: song.mp3,
    });
  }

  function addToQueue() {
    addToPlaylist({
      name: song.title,
      artistName: artist.name,
      songId: String(song.id), // todo could probably pass the number here
      artistId: String(artist.id),
      image: song.image as string,
      url: song.mp3,
    });
  }
</script>

<div class="flex items-center justify-between">
  <div class="flex items-center gap-1.5">
    <span class="relative top-[1px]">{songNumber}.</span>
    <Link href="/songs/{song.id}">{song.title}</Link>

    {#if currentPlaylistItem?.songId === String(song.id) && $isPlaying}
      <div class="pl-4 text-slate-600">
        <BarsLoader size=16 />
      </div>
    {/if}
  </div>

  <div class="flex items-center gap-6">
    {#if song.duration}
      <span>{formatDuration(song.duration)}</span>
    {/if}
    {#if userOwnsAlbum}
      <div class="flex items-center gap-3">
        <Tooltip>
          <button class="hover:text-slate-500" on:click={play}>
            <PlayOutline size="24" />
          </button>

          <p slot="content">
            Play now
          </p>
        </Tooltip>
        <Tooltip>
          <button class="hover:text-slate-500" on:click={addToQueue}>
            <AddToQueue size="20" />
          </button>

          <p slot="content">
            Add to queue
          </p>
        </Tooltip>
      </div>
    {/if}
  </div>
</div>