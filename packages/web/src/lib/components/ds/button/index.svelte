<script lang="ts">
	import BarsLoader from "../icons/bars-loader.svelte";

  export let loading = false;
  export let disabled = false;
  export let type: "button" | "submit" = "button";
  export let size: "small" | "medium" | "large" = "medium";
</script>

<button 
  class="border border-slate-800 rounded-lg bg-slate-700 px-4 py-2 text-white flex items-center justify-center" 
  class:h-10={size === "medium"}
  class:h-8={size === "small"}
  class:text-sm={size === "small"}
  class:px-4={size === "medium"}
  class:py-2={size === "medium"}
  class:px-2={size === "small"}
  class:py-1={size === "small"}
  class:h-12={size === "large"}
  class:text-lg={size === "large"}
  class:px-6={size === "large"}
  class:py-3={size === "large"}
  class:bg-slate-300={loading || disabled}
  disabled={loading || disabled} 
  {type}
  on:click
>
  {#if loading}
    <BarsLoader size=20 />
  {:else}
    <slot />
  {/if}
</button>