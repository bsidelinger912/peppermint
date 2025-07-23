<script lang="ts">
  import { page } from "$app/stores";

  import type { Album, Artist } from "@peppermint/shared";
	import HeroLayout from "$lib/layout/hero-layout.svelte";
  import MenuCard from "$lib/components/menu-card/index.svelte";
  import Carousel from "$lib/components/carousel/index.svelte";
  import Link from "$lib/components/ds/link/index.svelte";
  import { queryOne } from "$lib/api";
  import { supabase } from "$lib/supabase";

  type QueryResult = Artist & {
    artist_to_album: {
      album: Album;
    }[];
  };

  const { data } = queryOne<QueryResult>(
    async () =>
      await supabase
        .from("artist")
        .select("*, artist_to_album(album_id, album(*))")
        .eq("id", $page.params.id)
        .single(),
    [{ table: "artist", filter: `id=eq.${$page.params.id}` }]
  );
</script>

{#if $data}
  {@const albums = $data.artist_to_album.map((doc) => doc.album)}
  <HeroLayout>
    <div slot="hero" class="h-full relative" style="background-image: url('{$data.hero_image}'); background-size: cover; background-position: center;">
      <div class="absolute top-0 h-20 w-full bg-gradient-to-b from-black to-transparent" />
      <div class="absolute bottom-0 px-4 pb-7 w-full bg-gradient-to-t from-black to-transparent">
        <div class="max-w-[1100px] mx-auto flex flex-col gap-4">
          <h2 class="text-white text-3xl font-semibold">
            {$data.name}
          </h2>
        </div>
      </div>
    </div>
      
    <div class="flex flex-col gap-8">
      <div class="flex flex-col gap-6">
        <Carousel loading={!albums} title="Albums" description="{$data.name} has {albums.length} album{albums.length === 1 ? "" : "s"} on Peppermint">
          {#each (albums || []) as album}
            <a class="w-[43%] flex-shrink-0" href={`/albums/${album.id}`}>
              <MenuCard title={album.name} image={album.image} />
            </a>
          {/each}
        </Carousel>
      </div>

      <div class="flex flex-col gap-1">
        <h3 class="text-xl font-semibold text-slate-700">Want to find Peppermint merch from {$data.name}?</h3>
        <p class="text-sm">Check out a shows to get your unique copy!  
        View upcoming shows <Link href="https://bennysidelinger.com/shows" blank>here.</Link></p>
      </div>
    </div>
  </HeroLayout>
{:else}
  <HeroLayout loading />
{/if}