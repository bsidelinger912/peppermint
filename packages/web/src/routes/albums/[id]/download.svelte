<script lang="ts">
	import { writable } from "svelte/store";
  import Download from "svelte-ionicons/DownloadOutline.svelte";
  import { createDialog, melt } from '@melt-ui/svelte';

	import MenuContents from "$lib/layout/user-menu/menu-contents.svelte";
	import { clickOutside } from "$lib/util";
	import MenuItem from "$lib/layout/user-menu/menu-item.svelte";
	import type { Song } from "$lib/db/songs";
	import type { Artist } from "$lib/db/artists";
	import CloseCircleOutline from "svelte-ionicons/CloseCircleOutline.svelte";
	import Checkmark from "svelte-ionicons/Checkmark.svelte";

  export let songs: Song[];
  export let artist: Artist;

  const open = writable(false);
  
  
  const {
    elements: {
      overlay,
      content,
      title,
      portalled,
    },
    states: { open: dialogOpen },
  } = createDialog();

  function download(type: "mp3" | "wav") {
    dialogOpen.set(true);
    songs.forEach((song, i) => {
      const url = type === "mp3" ? song.mp3 : song.wave;
      if (url) {
        // Create a blob from the URL to force download
        fetch(url)
          .then(response => response.blob())
          .then(blob => {
            const blobUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = `${songs.length > 1 ? `${i +1}-` : ""}${song.name}-${artist.name}-peppermint.${type}`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            // Clean up the blob URL
            window.URL.revokeObjectURL(blobUrl);
          });
      }
    });
  }
</script>

<div class="relative text-slate-600" use:clickOutside={() => open.set(false)}>
  <button on:click={() => open.update((curr) => !curr)} class="hover:text-slate-500">
    <Download size="28" class="outline-none" />
  </button>

  {#if $open}
    <div class="absolute top-0 right-0 z-10">
      <MenuContents>
        <div class="flex flex-col">
          <MenuItem onClick={() => download("mp3")}>
            <div slot="icon">
              <Download size="20" />
            </div>
            Download {`${songs.length > 1 ? "album" : ""}`} .mp3
          </MenuItem>
          <MenuItem onClick={() => download("wav")}>
            <div slot="icon">
              <Download size="20" />
            </div>
            Download {`${songs.length > 1 ? "album" : ""}`} .wav
          </MenuItem>
        </div>
      </MenuContents>
    </div>
  {/if}
</div>

{#if $dialogOpen}
  <div class="" use:melt={$portalled}>
    <div
      use:melt={$overlay}
      class="fixed inset-0 z-50 bg-black/50"
    />
    <div
      class="fixed left-1/2 top-1/2 z-50 max-h-[85vh] w-[90vw]
            max-w-[450px] -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white
            p-4 shadow-lg"
      use:melt={$content}
    >
      <h2 use:melt={$title} class="mb-4 text-lg font-medium text-black flex items-center justify-between">
        <div class="flex items-center gap-2">
          <Checkmark class="text-green-600" size="22" />
          Your download has started
        </div>
        

        <button on:click={() => dialogOpen.set(false) }>
          <CloseCircleOutline size="20" />
        </button>
      </h2>

      <div class="flex flex-col gap-3">
        <p>Follow any prompts from your device to download the files.  They will download to the default folder in your system settings.</p>
        <p>
          On some devices, such as iPhones, the files can be difficult to find or utilize.  Check back soon for enhanced download capabilities such
          as integration with other streaming players and persistent offline functionality.  
        </p>
        <p>
          For now you can use the files as you see fit and manually integrate
          into other streaming players such as Spotify, you can also burn CDs and share files with your friends.  You really own this music so you have the 
          freedom to do with it what you choose.  Enjoy!
        </p>
      </div>
    </div>
  </div>
{/if}