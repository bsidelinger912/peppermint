<script lang="ts">
  export let label: string;
  export let id: string;
  export let error: string | undefined = undefined;
  export let type: "text" | "password" = "text";

  export let value = "";
</script>

<div class="flex flex-col gap-2 relative">
  <label class="font-semibold" for={id}>{label}</label>

  {#if type === "password"}
    <input
      {id}
      name={id}
      class="px-3 py-2 border border-slate-400 rounded-lg outline-none"
      bind:value
      type="password"
    />
  {:else}
    <input
      {id}
      name={id}
      class="px-3 py-2 border border-slate-300 bg-slate-50 rounded-lg outline-none"
      bind:value
    />
  {/if}

  {#if error}
    <div
      class="bg-orange-500 text-white absolute top-0 right-0 px-2 py-0.5 text-sm rounded-lg rounded-br-none"
    >
      {error}

      <svg
        class="absolute bottom-[-10px] right-0 text-orange-500"
        width="10"
        height="10"
        viewBox="0 0 10 10"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M10 10L10 0L10 0L0 0Z" fill="currentColor" />
      </svg>
    </div>
  {/if}
</div>
