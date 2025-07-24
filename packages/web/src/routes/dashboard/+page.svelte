<script lang="ts">
  import { supabase } from "$lib/supabase";
  import { page } from "$app/stores";
  import type { Album, Artist, Token } from "@peppermint/shared";
  import type { User } from "@supabase/supabase-js";

  import { queryMany } from "$lib/api";
  import HeroLayout from "$lib/layout/hero-layout.svelte";
  import Link from "$lib/components/ds/link/index.svelte";
  import Button from "$lib/components/ds/button/index.svelte";
  import AlbumCard from "$lib/components/album-card/index.svelte";
  import { goto } from "$app/navigation";

  type QueryResult = Token & {
    album: Album & {
      artist_to_album: {
        artist: Artist;
      }[];
    };
  };

  const query = async () => {
    const user = $page.data.user as User;
    if (!user) return null;
    
    return await supabase
      .from("token")
      .select("*, album(*, artist_to_album(artist_id, artist(*)))")
      .eq("user_id", user.id);
  };

  const { data: tokens } = queryMany<QueryResult>(query, [ { table: "token" } ]);
</script>

<HeroLayout>
  <div class="flex flex-col gap-4">
    <h1 class="text-3xl md:text-4xl font-semibold">Your Music</h1>

    {#if !$tokens || $tokens?.length === 0}
      <div class="flex flex-col gap-8">
        <div class="flex flex-col gap-2">
          <h2 class="text-2xl text-slate-700">Looking to purchase some music?</h2>
          <p>
            Right now you can only purchase Peppermint music in person.  But check back for online purchase as we'll be adding that feature soon!
            In the meantime, read more about what Peppermint is all about <Link href="/about">here.</Link>
            And check out the artists using Peppermint <Link href="/artists">here.</Link>
          </p>
        </div>

        <div class="flex flex-col gap-2">
          <h2 class="text-2xl text-slate-700">Don't see your music?</h2>
          <div class="flex flex-col gap-2 pb-6 pt-2">
            <p>If you have a QR code, scan it now.</p>

            <Button on:click={() => goto("/scan")}>Scan QR Code Now</Button>
          </div>
          <p>
            If you purchased music previously and now it's not here, then likely it's because we didn't recognize you on this device. 
            To get you account back in order, please contact our help department 
            <Link blank href="https://docs.google.com/forms/d/e/1FAIpQLSfZwvTdNJxc2pQrYlSP6B-XSLHH6DcEkW4OEvRmm5YH4sHlRQ/viewform">
              here.
            </Link>
          </p>
        </div>
      </div>
    {:else}
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {#each $tokens as token}
          <a class="" href="albums/{token.album.id}">
            <AlbumCard album={token.album} />
          </a>
        {/each}
      </div>
    {/if}
  </div>
</HeroLayout>

