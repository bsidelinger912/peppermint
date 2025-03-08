<script lang="ts">
  import "../app.css";
  import { setAuthContext } from "$lib/auth";
  let { children } = $props();

  setAuthContext();
</script>

{@render children()}
