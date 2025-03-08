<script lang="ts">
	import { writable } from "svelte/store";
  import Play from "svelte-ionicons/PlayCircle.svelte";
  import Pause from "svelte-ionicons/PauseCircle.svelte";
  import FastForward from "svelte-ionicons/PlaySkipForward.svelte";
  import Rewind from "svelte-ionicons/PlaySkipBack.svelte";


	import { browser } from "$app/environment";
	import Queue from "$lib/components/ds/icons/playlist.svelte";

  import { isPlaying, pastPlayed, playNext, playlist } from "./store";
	import type { PlaylistItem } from "./types";
	import { onMount } from "svelte";

  $: currentPlaylistItem = $playlist[0];

  let audio: HTMLAudioElement;

  const currentTime = writable("0:00");
  const duration = writable("");
  const percentComplete = writable(0);

  $: if (browser && currentPlaylistItem && audio?.src !== currentPlaylistItem.url) {
    audio?.pause();
    audio?.remove();
    audio = new Audio(currentPlaylistItem.url);

    audio.ontimeupdate = () => {
      currentTime.set(formatSeconds(audio.currentTime));
      percentComplete.set((audio.currentTime / audio.duration) * 100);
    };

    audio.onloadedmetadata = () => {
      duration.set(formatSeconds(audio.duration));
    }

    audio.onended = () => {
      playNext();
    }

    currentTime.set("0:00");
    duration.set("");
    percentComplete.set(0);
  }

  $: if ($isPlaying) {
    audio?.play();
  } else {
    audio?.pause();
  }

  function formatSeconds(time: number) {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  }

  function play() {
    isPlaying.set(true);
  }

  function pause() {
    isPlaying.set(false);
  }

  function back() {
    if (!audio) return;

    if ($currentTime === "0:00" && $pastPlayed.length > 0) {
      // todo: maybe move to store file???
      const prev = $pastPlayed.at(-1) as PlaylistItem;
      pastPlayed.update((current) => current.slice(0, -1));
      playlist.update((current) => [prev].concat(current));
    }

    audio.currentTime = 0;
    percentComplete.set(0);
  }

  function next() {
    if ($playlist.length < 2) return;

    playNext();
  }

  function rangeInput(e: Event & { currentTarget: EventTarget & HTMLInputElement; }) {
    const newTime = (parseFloat(e.currentTarget.value) / 100) * audio.duration;
    audio.currentTime = newTime;
    percentComplete.set(parseFloat(e.currentTarget.value));
  }

  $: backDisabled = !audio || ($currentTime === "0:00" && $pastPlayed.length < 1);
</script>

{#if $playlist.length > 0}
  <div class="border-t bg-slate-700 text-white">
    <div class="flex items-center justify-between gap-4 pt-2 pb-3 pl-2 pr-1 max-w-[1100px] mx-auto w-full">
      <div class="flex flex-col">
        <a class="text-lg font-semibold text-slate-100" href={`/songs/${currentPlaylistItem.songId}`}>{currentPlaylistItem.name}</a>
        <a class="text-slate-300" href={`/artists/${currentPlaylistItem.artistId}`}>{currentPlaylistItem.artistName}</a>
      </div>
      <div class="flex flex-col gap-1 items-center">
        <div class="flex items-center justify-between gap-4">
          <a href="/queue">
            <Queue size="22" />
          </a>
          
          <button 
            on:click={back}
            disabled={backDisabled} class:text-slate-400={backDisabled}
          >
            <Rewind size="20" />
          </button>

          {#if $isPlaying}
            <button on:click={pause}>
              <Pause size="36" />
            </button>
          {:else}
            <button on:click={play}>
              <Play size="36" />
            </button>
          {/if}

          <button 
            on:click={next}
            disabled={$playlist.length < 2} class:text-slate-400={$playlist.length < 2}
          >
            <FastForward size="20" />
          </button>
        </div>
        <div class="flex items-center gap-2">
          <span class="text-xs w-8 text-right">
            {$currentTime}
          </span>
          <div class="relative h-1.5 w-16 rounded bg-slate-300">
            <div class="absolute h-full bg-slate-500" style={`width:${$percentComplete}%`} />
            <input
              type="range"
              min="0"
              max="100"
              value={$percentComplete}
              class="absolute w-full h-full opacity-0 cursor-pointer"
              on:input={rangeInput}
            />
            <div
              class="absolute w-3 h-3 bg-white rounded-full shadow-md"
              style={`left: calc(${$percentComplete}% - 6px); top: -3px;`}
            />
          </div>
          <span class='text-xs w-8'>
            {$duration}
          </span>
        </div>
      </div>
    </div>
  </div>
{/if}