<script lang="ts">
  import MenuCard from "../menu-card/index.svelte";

  export let loading = false;
  export let title: string;
  export let description: string;
</script>

<div class="flex flex-col gap-2">
  <div>
    <h2 class="text-xl font-semibold text-slate-700">{title}</h2>
    <p class="text-slate-500 text-sm">{description}</p>
  </div>
  <div class="flex gap-4 overflow-x-scroll no-scrollbar">
    {#if !loading}
      <slot />
    {:else}
      <div class="w-[43%] flex-shrink-0">
        <MenuCard loader />
      </div>
    {/if}
  </div>
</div>