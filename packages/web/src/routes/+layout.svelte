<script lang="ts">
  import "../app.css";
  import { setAuthContext } from "$lib/auth";
  import { page } from "$app/state";

  setAuthContext(page.data.user);

  import AudioPlayer from "$lib/components/audio-player/index.svelte";
</script>

<div class="flex flex-col h-dvh">
  <div class="flex-grow overflow-y-auto">
    <!-- {#if chromeIsInstalled === false && !hideInstall}
      <div class="flex items-center justify-between p-2">
        <p class="text-sm">Install the app for the best experience</p>

        <div class="flex items-center gap-2">
          <Button on:click={chromeInstall} size="small">
            Install
          </Button>

          <button on:click={hideInstallPrompt}>
            <CloseCircleOutline size="20" />
          </button>
        </div>
      </div>
    {:else if chromeIsInstalled && !hideOpen && !chromeIsPWA}
      <div class="flex items-center justify-between p-2">
        <p class="text-sm">Open the app for the best experience</p>

        <div class="flex items-center gap-2">
          <a href="https://peppermintmusic.xyz" target="_blank">
            open
          </a>

          <button on:click={hideOpenPrompt}>
            <CloseCircleOutline size="20" />
          </button>
        </div>
      </div>
    {/if} -->

    <slot />
  </div>
  <AudioPlayer />
</div>
