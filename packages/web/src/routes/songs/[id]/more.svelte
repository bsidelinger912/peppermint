<script lang="ts">
	import { writable } from "svelte/store";
  import More from "svelte-ionicons/EllipsisVertical.svelte";
  import Download from "svelte-ionicons/Download.svelte";

	import MenuContents from "$lib/layout/user-menu/menu-contents.svelte";
	import { clickOutside } from "$lib/util";
	import MenuItem from "$lib/layout/user-menu/menu-item.svelte";
	import type { Song } from "$lib/db/songs";

  export let song: Song;

  const open = writable(false);

  function download(type: "mp3" | "wave") {
    const url = type === "mp3" ? song.mp3 : song.wave;
    if (url) {
      // Create a blob from the URL to force download
      fetch(url)
        .then(response => response.blob())
        .then(blob => {
          const blobUrl = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = blobUrl;
          link.download = `${song.name}.${type}`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          // Clean up the blob URL
          window.URL.revokeObjectURL(blobUrl);
        });
    }
  }
</script>

<div class="relative" use:clickOutside={() => open.set(false)}>
  <button on:click={() => open.update((curr) => !curr)} class="hover:text-slate-500">
    <More class="outline-none" />
  </button>

  {#if $open}
    <div class="absolute top-0 right-0 z-10">
      <MenuContents>
        <div class="flex flex-col">
          <MenuItem onClick={() => download("mp3")}>
            <div slot="icon">
              <Download size="20" />
            </div>
            Download .mp3
          </MenuItem>
          <MenuItem onClick={() => download("wave")}>
            <div slot="icon">
              <Download size="20" />
            </div>
            Download .wave
          </MenuItem>
        </div>
      </MenuContents>
    </div>
  {/if}
</div>