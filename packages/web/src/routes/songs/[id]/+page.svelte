<script lang="ts">
  import Play from "svelte-ionicons/Play.svelte";

  import type { Song, Album, Artist } from "@peppermint/shared";

  import { page } from "$app/stores";
	import HeroLayout from "$lib/layout/hero-layout.svelte";
	import AddToQueue from "$lib/components/ds/icons/playlist-add.svelte";
	import { addToPlaylist, isPlaying, playlist, playNow } from "$lib/components/audio-player/store";
	import Tooltip from "$lib/components/tooltip/tooltip.svelte";

	import { formatDuration } from "../../albums/[id]/utils";
	import Download from "../../albums/[id]/download.svelte";
	import BarsLoader from "$lib/components/ds/icons/bars-loader.svelte";
  import { supabase } from "$lib/supabase";
  import { queryOne } from "$lib/api";

  type SongWithAlbumsAndArtist = Song & {
    song_to_album: { album: Album }[];
    artist_to_song: { artist: Artist }[];
  };

  const { data } = queryOne<SongWithAlbumsAndArtist>(
    async () =>
      await supabase
        .from("song")
        .select(
          "*, song_to_album(album_id, album(*), track_number), artist_to_song(artist_id, artist(*))"
        )
        .eq("id", $page.params.id)
        .single(),
    [{ table: "song", filter: `id=eq.${$page.params.id}` }]
  );

  $: userOwnsSong = true; // $userTokens?.some((album) => album.songs.includes($page.params.id));
  $: currentPlaylistItem = $playlist[0];

  function add() {
    if (!$data) return;

    addToPlaylist({
      name: $data.title,
      artistName: $data.artist_to_song[0].artist.name,
      songId: String($data.id),
      artistId: String($data.artist_to_song[0].artist.id), // todo: don't need string
      image: $data.image as string,
      url: $data.mp3,
    });
  }

  function play() {
    if (!$data) return;

    playNow({
      name: $data.title,
      artistName: $data.artist_to_song[0].artist.name,
      songId: String($data.id),
      artistId: String($data.artist_to_song[0].artist.id), // todo: don't need string
      image: $data.image as string,
      url: $data.mp3,
    });
  }
</script>

{#if $data}
  {@const album = $data.song_to_album[0].album}
  {@const artist = $data.artist_to_song[0].artist}
  <HeroLayout>
    <div slot="hero" class="h-full relative" style="background-image: url('{$data.image || album.image || artist.hero_image}'); background-size: cover; background-position: center;">
      <div class="absolute top-0 h-20 w-full bg-gradient-to-b from-black to-transparent" />
      <div class="absolute bottom-0 px-4 pb-7 w-full bg-gradient-to-t from-black to-transparent">
        <div class="relative max-w-[1100px] h-full mx-auto flex flex-col gap-3 text-white">
          <h2 class="text-3xl font-semibold">
            {$data.title}
          </h2>
          <div class="flex gap-2">
            <a href={`/artists/${$data.artist_to_song[0].artist.id}`} class="text-white underline hover:text-blue-400">
              <h4>{$data.artist_to_song[0].artist.name}</h4>
            </a>
            {#if $data.duration}
              <span>•</span>
              <span>{formatDuration($data.duration)}</span>
            {/if}
          </div>
        </div>
      </div>
    </div>
      
    <div class="flex flex-col gap-6">
      {#if userOwnsSong}
        <div class="flex items-center justify-between">
          <div class="flex gap-4 items-center text-slate-600">
            <Tooltip>
              <button on:click={play}>
                <div class="rounded-full p-2 bg-green-700 border border-green-900">
                  <Play size="24" class="text-white relative left-[1px]" />
                </div>
              </button>

              <p slot="content">
                Play now
              </p>
            </Tooltip>
            
            <Tooltip>
              <button on:click={add}>
                <AddToQueue />
              </button>

              <p slot="content">
                Add to queue
              </p>
            </Tooltip>

            {#if currentPlaylistItem?.songId === String($data?.id) && $isPlaying}
              <Tooltip>
                <div class="mt-[-4px] text-slate-600">
                  <BarsLoader size=20 />
                </div>

                <p slot="content">
                  Currently playing
                </p>
              </Tooltip>
            {/if}
          </div>

          <div>
            <Download songs={[$data]} artist={$data.artist_to_song[0].artist} />
          </div>
        </div>
      {/if}
      
      {#if $data.description}
        <p>
          {$data.description}
        </p>
      {/if}

      {#if $data.lyrics}
        <div class="flex flex-col gap-2">
          <h3 class="text-xl font-semibold">Lyrics</h3>
          <p class="whitespace-pre-line">
            {$data.lyrics}
          </p>
        </div>
      {/if}
    </div>
  </HeroLayout>
{:else}
  <HeroLayout loading={true} />
{/if}