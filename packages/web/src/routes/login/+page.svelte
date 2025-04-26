<script lang="ts">
  import { writable } from "svelte/store";
  import Mail from "svelte-ionicons/Mail.svelte";

  import Button from "$lib/components/ds/button/index.svelte";
  import HeroLayout from "$lib/layout/hero-layout.svelte";
  import { supabase } from "$lib/supabase";

  import EmailLogin from "./email-login.svelte";
  import { LogoGoogle } from "svelte-ionicons";

  const loginMethod = writable<"email" | undefined>();

  async function loginWithGoogle() {
    const params = new URLSearchParams(window.location.search);

    // todo: validate redirect
    const redirectUrl = encodeURIComponent(params.get("redirect") ?? "");

    try {
      supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}${redirectUrl ? `?redirect=${redirectUrl}` : ""}`,
        },
      });
    } catch (e) {
      // eslint-disable-next-line no-undef
      console.error("error logging in with google", e);
    }
  }

  // const loggingInPassword = writable(false);
  // const emailError = writable<string | undefined>(undefined);
  // const passwordError = writable<string | undefined>(undefined);

  // const { signIn, signUp } = getAuthContext();

  // let emailValue: string;
  // let passwordValue: string;

  // $: if (passwordValue) {
  //   passwordError.set(undefined);
  // }

  // $: if (emailValue) {
  //   emailError.set(undefined);
  // }

  // async function validatePassword(login = false) {
  //   let valid = true;

  //   if (!emailValue) {
  //     emailError.set("Please enter an email");
  //     valid = false;
  //   }

  //   if (!passwordValue) {
  //     passwordError.set("Please enter a password");
  //     valid = false;
  //   }

  //   if (valid) {
  //     try {
  //       loggingInPassword.set(true);
  //       if (login) {
  //         const result = await signIn(emailValue as string, passwordValue as string);

  //         // TODO: redirect to app with session, which can be used to supabase.auth.setSession()
  //         console.log(result.session);
  //       } else {
  //         const result = await signUp(emailValue as string, passwordValue as string);

  //         // TODO: redirect to app with session, which can be used to supabase.auth.setSession()
  //         console.log(result.session);
  //       }
  //     } catch (e) {
  //       emailError.set((e as Error).message);
  //     } finally {
  //       loggingInPassword.set(false);
  //     }
  //   }
  // }
</script>

<HeroLayout>
  <div class="flex flex-col gap-4 max-w-[600px] mx-auto">
    {#if $loginMethod === "email"}
      <EmailLogin />
    {:else}
      <Button on:click={() => loginMethod.set("email")}>
        <div class="flex items-center justify-center gap-4 text-lg">
          <Mail />
          Log in with email
        </div>
      </Button>

      <Button on:click={loginWithGoogle}>
        <div class="flex items-center justify-center gap-4 text-lg">
          <LogoGoogle />
          Log in with google
        </div>
      </Button>
    {/if}
  </div>
</HeroLayout>
