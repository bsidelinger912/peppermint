<script lang="ts">
  import { page } from "$app/state";
  import { getAuthContext } from "$lib/auth";
  // import Home from "svelte-ionicons/Home.svelte";
  import UserMenu from "$lib/layout/user-menu/index.svelte";
  import Headphones from "$lib/components/logo/headphones.svelte";
  import Name from "$lib/components/logo/name.svelte";
  // import { userSession } from "$lib/userSessionStore";
  // import { page } from "$app/stores";

  const { user } = getAuthContext();

  export let loading = false;
</script>

<div class="body">
  <header class="relative h-[300px] overflow-hidden">
    <div class="absolute w-full h-full">
      {#if loading}
        <div class="w-full h-full bg-gray-200 animate-pulse">
          <div
            class="h-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-shimmer"
          ></div>
        </div>
      {:else if $$slots.hero}
        <slot name="hero" />
      {:else}
        <div
          class="bg-[url('/aurora.png')] bg-center bg-cover flex flex-col items-center justify-center pb-4 pt-8 h-full"
        >
          <div class="pb-[50px]">
            <Headphones />
          </div>
          <div
            class="bg-gradient-to-t from-black to-transparent w-full flex justify-center absolute bottom-0 pb-[20px]"
          >
            <Name />
          </div>
        </div>
      {/if}
    </div>

    {#if !page.url.pathname.includes("login")}
      <div
        class="z-10 relative w-full flex items-center gap-4 justify-between p-4 min-[1100px]:px-0 min-[1100px]:justify-end max-w-[1100px] mx-auto"
      >
        <!-- <a href="/" class="text-white">
          <Home size="25" />
        </a> -->

        <UserMenu />
      </div>
    {/if}
  </header>
  <div
    class="max-w-[1100px] mx-auto p-4 rounded-t-2xl min-[1100px]:rounded-none border-t bg-white relative -top-4 min-[1100px]:top-0"
  >
    {#if loading}
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        {#each Array(2) as _}
          <div class="aspect-square bg-gray-200 animate-pulse rounded-lg overflow-hidden">
            <div
              class="h-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-shimmer"
            ></div>
          </div>
        {/each}
      </div>
    {:else}
      <slot />
    {/if}
  </div>
</div>
