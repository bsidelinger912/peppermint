<script lang="ts">
  import { writable } from "svelte/store";
  import type { RedemptionCode } from "@peppermint/shared";

  import { page } from "$app/state";
  import HeroLayout from "$lib/layout/hero-layout.svelte";
  import { getAuthContext } from "$lib/auth";
  import Link from "$lib/components/ds/link/index.svelte";
  import Button from "$lib/components/ds/button/index.svelte";
  import AlbumCard from "$lib/components/album-card/index.svelte";
  import { supabase } from "$lib/supabase";
  import { goto } from "$app/navigation";

  const { user } = getAuthContext();

  const code = page.data.redemptionCode as RedemptionCode;
  const minting = writable(false);

  async function mint() {
    minting.set(true);

    try {
      // Check if user is authenticated
      if (!$user) {
        throw new Error("User must be authenticated to mint NFT");
      }

      // Get the current session to ensure we have a valid token
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session) {
        throw new Error("No valid session found");
      }

      const result = await supabase.functions.invoke("mint-nft", {
        body: { redemption_code: page.params.id },
      });

      if (result.error) {
        throw new Error(result.error.message || "Failed to mint NFT");
      }

      // Handle successful minting
      // You might want to redirect or update the UI here
      goto("/dashboard");
      
    } catch (e) {
      console.error("Error minting NFT:", e);
      // TODO: Show error to user
    } finally {
      minting.set(false);
    }
  }
</script>

<HeroLayout>
  {#if !$user}
    <div class="flex flex-col justify-center h-[200px]">
      <p class="text-center">
        Congrats on your purchase, you'll need to <Link href={`/login?next=codes/${page.params.id}`}>Log in</Link> to continue.
      </p>
    </div>
  {:else}
    <div class="flex flex-col sm:flex-row gap-6">
      <div class="sm:w-1/2 md:w-1/3">
        <AlbumCard album={code.album} />
      </div>
      
      <div class="flex flex-col gap-6">
        {#if !code.redeemed_by}
          <p>
            Congrats on your purchase, click the button below to redeem the album. 
          </p>
        {/if}

        {#if code.redeemed_by}
          {#if $user.id === code.redeemed_by}
            <p>
              You've already redeemed this code, go to your 
              <Link href="/profile">Profile</Link> to listen.
            </p>
          {:else}
            <p>
              This code has been redeemed by <strong>{code.redeemed_by}</strong>
            </p>

            <p>
              If your album is not showing up on your home page, then likely it's possibly because we didn't recognize you on this device. 
              If you think this is the case, please contact our help department 
              <Link blank href="https://docs.google.com/forms/d/e/1FAIpQLSfZwvTdNJxc2pQrYlSP6B-XSLHH6DcEkW4OEvRmm5YH4sHlRQ/viewform">
                here.
              </Link>
            </p>
          {/if}
        {:else}
          <div class="flex justify-center w-full">
            <div class="w-full max-w-[500px] flex flex-col">
              <Button 
                size="large"
                on:click={mint} 
                loading={$minting}
              >
                <span>Redeem</span>
              </Button>
            </div>
          </div>
        {/if}
      </div>
    </div>
  {/if}
</HeroLayout>