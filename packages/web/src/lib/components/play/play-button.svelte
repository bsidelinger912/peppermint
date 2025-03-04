<script lang="ts">
  import Play from "svelte-ionicons/Play.svelte";

  export let mp3: string;

  $: console.log(mp3);
</script>

<div class="rounded-full p-2 bg-green-700 border border-green-900">
  <Play size="24" class="text-white relative left-[1px]" />
</div>
