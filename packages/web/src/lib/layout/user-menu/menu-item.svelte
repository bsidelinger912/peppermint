<script lang="ts">
  export let onClick: (() => void) | undefined = undefined;
</script>

{#if onClick}
  <button on:click={onClick} class="hover:text-slate-500">
    <div class="flex p-2 gap-2 items-center">
      <slot name="icon" />
      <slot />
    </div>
  </button>
{:else}
  <div class="flex p-2 gap-2 items-center">
    <slot name="icon" />
    <slot />
  </div>
{/if}