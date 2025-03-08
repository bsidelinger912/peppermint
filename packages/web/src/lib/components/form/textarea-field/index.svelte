<script lang="ts">
  export let label: string;
  export let id: string;
  export let error: string | undefined = undefined;
  export let rows: number | undefined = undefined;

  export let value = "";
</script>

<div class="flex flex-col gap-2 relative">
  <label class="font-semibold" for={id}>{label}</label>
  <textarea {id} name={id} class="px-3 py-2 border rounded-lg" {rows} bind:value />

  {#if error}
    <div class="bg-orange-500 text-white absolute top-0 right-0 px-2 py-0.5 text-sm rounded-lg rounded-br-none">
      {error}

      <svg class="absolute bottom-[-10px] right-0 text-orange-500" width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M10 10L10 0L10 0L0 0Z" fill="currentColor"/>
      </svg>
    </div>
  {/if}
</div>