<script lang="ts">
  import type { Album, Artist, Song } from "@peppermint/shared";

  import { page } from "$app/stores";
	import HeroLayout from "$lib/layout/hero-layout.svelte"; 

	import Details from "./details.svelte";
	import Hero from "./hero.svelte";
  import { queryOne } from "$lib/api";
  import { supabase } from "$lib/supabase";

  type QueryResult = Album & {
    song_to_album: {
      song: Song;
      track_number: number;
    }[];
    artist_to_album: {
      artist: Artist;
    }[];
  };

  const { data: album } = queryOne<QueryResult>(
    async () =>
      await supabase
        .from("album")
        .select(
          "*, song_to_album(song_id, song(*), track_number), artist_to_album(artist_id, artist(*))"
        )
        .eq("id", $page.params.id)
        .single(),
    [{ table: "album", filter: `id=eq.${$page.params.id}` }]
  );

  // TODO: add back
  $: userOwnsAlbum = true; // $userTokens?.some((token) => token.id === $data?.id) || false;
</script>

{#if $album}
  {@const artist = $album.artist_to_album[0].artist}
  {@const songs = $album.song_to_album.map((doc) => ({ ...doc.song, trackNumber: doc.track_number }))}
  <HeroLayout>
    <div slot="hero" class="h-full relative" style="background-image: url('{artist.hero_image}'); background-size: cover; background-position: center;">
      <Hero album={$album} songs={songs} artist={artist} />
    </div>
      
    <Details album={$album} songs={songs} artist={artist} {userOwnsAlbum} />
  </HeroLayout>
{:else}
  <HeroLayout loading={true} />
{/if}