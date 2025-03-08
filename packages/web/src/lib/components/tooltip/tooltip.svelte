<script lang="ts">
  import { createTooltip, melt } from '@melt-ui/svelte';
  import { fade } from 'svelte/transition';

  const {
    elements: { trigger, content, arrow },
    states: { open },
  } = createTooltip({
    positioning: {
      placement: 'top',
    },
    openDelay: 0,
    closeDelay: 0,
    closeOnPointerDown: false,
    forceVisible: true,
  });
</script>

<div use:melt={$trigger}>
  <slot />
</div>

{#if $open}
  <div
    use:melt={$content}
    transition:fade={{ duration: 100 }}
    class="z-10 rounded-lg bg-slate-900 text-white border border-slate-400 px-3 py-2"
  >
    <div use:melt={$arrow} class="border-t border-l border-slate-400" />
    <slot name="content" />
  </div>
{/if}