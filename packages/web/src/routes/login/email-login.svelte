<script lang="ts">
  import { writable } from "svelte/store";

  import Button from "$lib/components/ds/button/index.svelte";
  import TextField from "$lib/components/form/text-field/index.svelte";
  import { Mail } from "svelte-ionicons";
  import { supabase } from "$lib/supabase";

  let emailValue: string;
  const emailError = writable<string | undefined>(undefined);
  const loggingIn = writable(false);

  async function login() {
    if (!emailValue) {
      emailError.set("Please enter an email");
      return;
    }

    loggingIn.set(true);
    const { data, error } = await supabase.auth.signInWithOtp({ email: emailValue });

    if (error) {
      emailError.set(error.message);
    }

    console.log("*****", data);
  }
</script>

<div class="flex flex-col gap-2">
  <TextField id="email" label="Email" bind:value={emailValue} error={$emailError} />
</div>

<Button loading={$loggingIn} on:click={login}>
  <div class="flex items-center justify-center gap-4 text-lg">
    <Mail size="22" />
    Log in or sign up
  </div>
</Button>
