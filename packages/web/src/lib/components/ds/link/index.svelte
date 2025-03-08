<script lang="ts">
  export let href: string;
  export let blank = false;
</script>

<a {href} class="text-slate-600 underline hover:text-slate-500" target={blank ? "_blank" : undefined}>
  <slot />
</a>