<script lang="ts">
  import { writable } from "svelte/store";
  import Logout from "svelte-ionicons/LogOut.svelte";
  import Copy from "svelte-ionicons/CopyOutline.svelte";
  import Check from "svelte-ionicons/Checkmark.svelte";
  import Help from "svelte-ionicons/HelpCircle.svelte";
  import About from "svelte-ionicons/InformationCircle.svelte";

  // import { clearUserSession, userSession } from "$lib/userSessionStore";

  import QueueIcon from "$lib/components/ds/icons/playlist.svelte";
  import { playlist } from "$lib/components/audio-player/store";
  import { getAuthContext } from "$lib/auth";

  import MenuContents from "./menu-contents.svelte";
  import MenuItem from "./menu-item.svelte";

  const { user, signOut } = getAuthContext();
  // const copied = writable(false);

  // function copy() {
  //   if ($userSession?.address) {
  //     navigator.clipboard.writeText($userSession.address).then(() => {
  //       copied.set(true);
  //       setTimeout(() => copied.set(false), 1000);
  //     });
  //   }
  // }
</script>

<MenuContents>
  <div>
    <div class="flex gap-1">
      <span class="w-24 font-semibold text-slate-700"> Username: </span>
      <span class="truncate text-slate-500">
        {$user?.email}
      </span>
    </div>
    <!-- <div class="flex gap-1 items-center">
      <span class="w-24 flex-shrink-0 font-semibold text-slate-700"> Address: </span>
      <span class="truncate text-slate-500">
        {$user?.address}
      </span>
      <button title="copy" class="outline-none" on:click={copy}>
        {#if $copied}
          <Check size="16" class="outline-none" />
        {:else}
          <Copy size="16" class="hover:text-blue-600 outline-none" />
        {/if}
      </button>
    </div> -->
  </div>

  <hr class="my-2" />

  <button on:click={signOut}>
    <MenuItem>
      <div slot="icon">
        <Logout size="20" />
      </div>
      Logout
    </MenuItem>
  </button>

  {#if $playlist.length > 0}
    <a href="/queue" class="notranslate">
      <MenuItem>
        <div slot="icon">
          <QueueIcon size="20" />
        </div>
        Queue
      </MenuItem>
    </a>
  {/if}

  <!-- <a href="/about">
    <MenuItem>
      <div slot="icon">
        <About size="20" />
      </div>
      About
    </MenuItem>
  </a> -->

  <a
    href="https://docs.google.com/forms/d/e/1FAIpQLSfZwvTdNJxc2pQrYlSP6B-XSLHH6DcEkW4OEvRmm5YH4sHlRQ/viewform"
    target="_blank"
  >
    <MenuItem>
      <div slot="icon">
        <Help size="20" />
      </div>
      Help
    </MenuItem>
  </a>
</MenuContents>
