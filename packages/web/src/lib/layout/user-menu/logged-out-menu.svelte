<script lang="ts">
  import Person from "svelte-ionicons/Person.svelte";
  import Information from "svelte-ionicons/InformationCircle.svelte";
  import Help from "svelte-ionicons/HelpCircle.svelte";
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
  

  <a href="https://docs.google.com/forms/d/e/1FAIpQLSfZwvTdNJxc2pQrYlSP6B-XSLHH6DcEkW4OEvRmm5YH4sHlRQ/viewform" target="_blank">
    <MenuItem>
      <div slot="icon">
        <Help size="20" />
      </div>
      Help
    </MenuItem>
  </a>

  <a href="/privacy-policy">
    <MenuItem>
      <div slot="icon">
        <Information size="20" />
      </div>
      Privacy policy
    </MenuItem>
  </a>
</MenuContents>