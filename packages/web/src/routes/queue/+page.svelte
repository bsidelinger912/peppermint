<script lang="ts">
  import Link from "$lib/components/ds/link/index.svelte";
  import HeroLayout from "$lib/layout/hero-layout.svelte";

  import { playlist, isPlaying } from "$lib/components/audio-player/store";
	import RemoveFromQueue from "$lib/components/ds/icons/playlist-remove.svelte";
	import BarsLoader from "$lib/components/ds/icons/bars-loader.svelte";

  function removeItem(songId: string, index: number) {
    playlist.update((current) => current.filter((item, i) => item.songId !== songId && i !== index));
  }

  $: currentPlaylistItem = $playlist[0];
</script>

<HeroLayout>
  <div class="flex flex-col gap-4">
    <h1 class="text-3xl md:text-4xl font-semibold text-slate-700 notranslate">Your Queue</h1>

    <div class="flex flex-col gap-4">
      {#each $playlist as playlistItem, i (`${playlistItem.songId}-${i}`)}

        <hr />

        <a href="/songs/{playlistItem.songId}">
          <div class="flex items-center justify-between">
            <div class="flex gap-2">
              <div class="mt-0.5">
                {`${i + 1}.`}
              </div>
              <div class="flex flex-col gap-1">
                <h4 class="text-lg font-medium">
                  {playlistItem.name}
                </h4>
                <span class="text-sm">
                  <Link href="/artists/{playlistItem.artistId}">{playlistItem.artistName}</Link>
                </span>
              </div>

              {#if currentPlaylistItem?.songId === playlistItem.songId && $isPlaying}
                <div class="pl-2 text-slate-600 flex items-center">
                  <BarsLoader size=16 />
                </div>
              {/if}
            </div>
            
            <button type="button" on:click={(e) => {
              e.stopPropagation();
              e.preventDefault();
              removeItem(playlistItem.songId, i);
            }}>
              <RemoveFromQueue size="28" />
            </button>
          </div>
        </a>
      {/each}
    </div>
  </div>
</HeroLayout>
