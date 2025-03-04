<script lang="ts">
  import { writable } from "svelte/store";
  import Person from "svelte-ionicons/Person.svelte";

  import Button from "$lib/components/ds/button/index.svelte";
  import HeroLayout from "$lib/layout/hero-layout.svelte";
  import TextField from "$lib/components/form/text-field/index.svelte";
  import { getAuthContext } from "$lib/auth";

  const loggingInPassword = writable(false);
  const emailError = writable<string | undefined>(undefined);
  const passwordError = writable<string | undefined>(undefined);

  const { signIn, signUp } = getAuthContext();

  let emailValue: string;
  let passwordValue: string;

  $: if (passwordValue) {
    passwordError.set(undefined);
  }

  $: if (emailValue) {
    emailError.set(undefined);
  }

  async function validatePassword(login = false) {
    let valid = true;

    if (!emailValue) {
      emailError.set("Please enter an email");
      valid = false;
    }

    if (!passwordValue) {
      passwordError.set("Please enter a password");
      valid = false;
    }

    if (valid) {
      try {
        loggingInPassword.set(true);
        if (login) {
          const result = await signIn(emailValue as string, passwordValue as string);

          // TODO: redirect to app with session, which can be used to supabase.auth.setSession()
          console.log(result.session);
        } else {
          const result = await signUp(emailValue as string, passwordValue as string);

          // TODO: redirect to app with session, which can be used to supabase.auth.setSession()
          console.log(result.session);
        }
      } catch (e) {
        emailError.set((e as Error).message);
      } finally {
        loggingInPassword.set(false);
      }
    }
  }
</script>

<HeroLayout>
  <div class="flex flex-col gap-6">
    <div class="flex flex-col gap-2">
      <TextField id="email" label="Email" bind:value={emailValue} error={$emailError} />
      <TextField
        id="password"
        label="Password"
        type="password"
        bind:value={passwordValue}
        error={$passwordError}
      />
    </div>

    <Button loading={$loggingInPassword} on:click={() => validatePassword()}>
      <div class="flex items-center justify-center gap-4 text-lg">
        <Person size="22" />
        Sign up
      </div>
    </Button>
    <Button loading={$loggingInPassword} on:click={() => validatePassword(true)}>
      <div class="flex items-center justify-center gap-4 text-lg">
        <Person size="22" />
        Log in
      </div>
    </Button>
  </div>
</HeroLayout>
