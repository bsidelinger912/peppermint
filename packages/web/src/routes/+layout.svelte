<script lang="ts">
  import "../app.css";
  import { setAuthContext } from "$lib/auth";
  import { page } from "$app/state";
  let { children } = $props();

  setAuthContext(page.data.user);
</script>

{@render children()}
