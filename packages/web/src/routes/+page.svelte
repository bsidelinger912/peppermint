<script lang="ts">
  import { browser } from "$app/environment";
  import { goto } from "$app/navigation";
  import { getAuthContext } from "$lib/auth";
	import HeroLayout from "$lib/layout/hero-layout.svelte";

  const { user } = getAuthContext();

  $: if ($user && browser) {
    goto("/dashboard");
  }
</script>

<HeroLayout>
  <div class="flex flex-col gap-8">
    <h1 class="text-2xl md:text-4xl font-semibold">What is Peppermint?</h1>

    <div class="flex flex-col gap-2">
      <h3 class="text-xl font-semibold">Bringing back music ownership</h3>

      <p>
        Peppermint was founded on the principal that it should still be possible to truly own music in the streaming age.  On many platforms, even if you buy music you don't 
        really "own" it.  We miss the days of when you bought something you could give it away, sell it, and use it in any way that you want.  We want to bring that concept
        back to life with the convenience of mobile and streaming.  Many people are still buying CDs at shows even if they can't listen to them in most settings, because they
        like the artwork, the ownership qualities and the in-person commerce experience.  Peppermint aims to support those experiences without requiring the purchaser to buy an 
        actual CD.
      </p>
    </div>
    

    <div class="flex flex-col gap-2">
      <h3 class="text-xl font-semibold">How it works</h3>

      <p>
        Using peppermint is designed to combine the conveniences of modern technology with the true ownership qualities of buying physical media.  Albums are sold at shows
        with all the packaging, info and artwork of a CD, but with a QR code that a user can scan to claim their digital ownership.  The QR code will bring the purchaser to 
        an app that allows them to listen, download, integrate into any streaming service's player and transfer their ownership freely.  We think the built in player is pretty slick, 
        especially for the type of listener that still likes listening to an album all the way through, but if you don't want to hop between apps when switching between music you own
        and your favorite streaming service.  Users can follow the simple instructions in the app to integrate their purchase in the stream app of their choice. If they switch
        services, they can easily re-integrate with the new service's app, because they really do own their purchase.  Users can also download mp3 or wav files and listen to them
        any way they choose on whatever device they choose.  
      </p>
    </div>

    <div class="flex flex-col gap-2">
      <h3 class="text-xl font-semibold">And I can sell my album?</h3>

      <p>
        We don't believe that you technically own something unless you can sell it or give it away.  Many music platforms sell you music that you can't use with different devices or apps, sell
        or give away.  We wanted to create something different, something that is closer to how people think about ownership.  Your ownership of the music is verified by an NFT on the base blockchain,
        which means you can easily transfer it or sell it on a number of NFT exchange platforms.  It also means that the rarity is guaranteed, and that you have a digital collectible
        which nobody can possible revoke.  When someone buys your NFT, they can then log into Peppermint and listen and download.  It also means that you will relinquish your access to that copy 
        of the music (just like physical media of yore, you can own multiple copies).  Peppermint is not intended to be used for the type of speculative investments that have given NFTs a bad name, 
        however the underlying technology enables true digital ownership and transferability in a standardized and platform-agnostic interface.  The NFT is just a means to and end 
        though, what excites us is the user experiences that the technology can enable, and the freedom and property rights that inherently come with it.  
      </p>
    </div>
  </div>
</HeroLayout>
