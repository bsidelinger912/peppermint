<script lang="ts">
  import Person from "svelte-ionicons/Person.svelte";
  import Home from "svelte-ionicons/Home.svelte";
	import MenuContents from "./menu-contents.svelte";
	import MenuItem from "./menu-item.svelte";
</script>

<MenuContents>
  <a href="/login">
    <MenuItem>
      <div slot="icon">
        <Person size="16" />
      </div>
      Log in
    </MenuItem>
  </a>
</MenuContents>