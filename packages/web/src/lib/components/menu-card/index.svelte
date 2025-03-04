<script lang="ts">
  export let title: string | undefined = undefined;
  export let subTitle: string | undefined = undefined;
  export let image: string | undefined = undefined;
  export let loader = false;
</script>

<div 
  class="aspect-square w-full overflow-hidden rounded-lg relative"
  class:bg-slate-400={loader}
  class:animate-pulse={loader}
>
  {#if image}
    <img src={image} alt={title} class="w-full" />
  {/if}

  {#if $$slots.actions}
    <div class="absolute top-2 right-2">
      <slot name="actions" />
    </div>
  {/if}

  {#if title}
    <div class="bg-gradient-to-t px-2 pb-1 pt-8 from-black to-transparent absolute bottom-0 text-white w-full flex flex-col">
      <h5 class="text-md truncate">{title}</h5>
      {#if subTitle}
        <h6 class="text-sm truncate">{subTitle}</h6>
      {/if}
    </div>
  {/if}
</div>