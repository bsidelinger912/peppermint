<script lang="ts">
  import { writable } from "svelte/store";
  import Person from "svelte-ionicons/Person.svelte";
  import Menu from "svelte-ionicons/Menu.svelte";

  import { afterNavigate } from "$app/navigation";

  import { clickOutside } from "$lib/util";
  import { getAuthContext } from "$lib/auth";

  import LoggedOut from "./logged-out-menu.svelte";
  import ProfileMenu from "./profile-menu.svelte";

  const menuOpen = writable(false);
  const { user } = getAuthContext();

  function toggleMenu() {
    menuOpen.update((current) => !current);
  }

  afterNavigate(() => {
    menuOpen.set(false);
  });
</script>

<div class="relative flex items-center" use:clickOutside={() => menuOpen.set(false)}>
  <button class="outline-none" on:click={toggleMenu}>
    <div class="text-white">
      {#if $user}
        <Person size="24" class="outline-none" />
      {:else}
        <Menu size="32" class="outline-none" />
      {/if}
    </div>
  </button>

  {#if $menuOpen}
    {#if $user}
      <ProfileMenu />
    {:else}
      <LoggedOut />
    {/if}
  {/if}
</div>
