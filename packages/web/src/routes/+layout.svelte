<script lang="ts">
  import "../app.css";
  let { children } = $props();
</script>

<div>
  <div>Heading</div>
  {@render children()}
</div>
