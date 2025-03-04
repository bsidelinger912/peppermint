<script lang="ts">
  // import { v4 as uuidv4 } from "uuid";
  import { writable } from "svelte/store";
  // import { toPasskeyValidator, toWebAuthnKey, WebAuthnMode, PasskeyValidatorContractVersion } from '@zerodev/passkey-validator';
  // import { createKernelAccount } from "@zerodev/sdk";
  // import { KERNEL_V3_1 } from "@zerodev/sdk/constants";
  // import { ENTRYPOINT_ADDRESS_V07 } from "permissionless";
  // import { createPublicClient, http } from "viem";
  import Key from "svelte-ionicons/Key.svelte";
  import Person from "svelte-ionicons/Person.svelte";
  // import { collection, doc, getDocs, query, setDoc, where } from "firebase/firestore";
  // import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

  import Button from "$lib/components/ds/button/index.svelte";
  // import { saveUserSession } from "$lib/userSessionStore";
  import HeroLayout from "$lib/layout/hero-layout.svelte";
  // import { goToNext } from "$lib/util";
  // import { auth, db } from "$lib/firebase";
  // import { BUNDLER_URL, PASSKEY_SERVER_URL, PASSKEY_NAME } from "$lib/constants";
  // import { reloadUserTokens } from "$lib/db/tokens";
  // import type { User } from "$lib/db/user";
  import TextField from "$lib/components/form/text-field/index.svelte";
  // import { FirebaseError } from "firebase/app";

  const loggingInPasskey = writable(false);
  const loggingInPassword = writable(false);
  const userNameError = writable<string | undefined>(undefined);
  const emailError = writable<string | undefined>(undefined);
  const passwordError = writable<string | undefined>(undefined);
  const serverError = writable<string | undefined>(undefined);
  const needsUserName = writable(false);
  //const creatingUser = writable(false);
  const logIn = writable(false);
  const showUserPassword = writable(false);

  let userNameValue: string = "";
  // let userAddress: string;
  let emailValue: string;
  let passwordValue: string;

  $: if (userNameValue) {
    userNameError.set(undefined);
  }

  $: if (passwordValue) {
    passwordError.set(undefined);
  }

  // const publicClient = createPublicClient({
  //   transport: http(BUNDLER_URL),
  // });
  // const entryPoint = ENTRYPOINT_ADDRESS_V07;

  // async function createPasskeyKernelAccount(mode: WebAuthnMode) {
  //   try {
  //     const webAuthnKey = await toWebAuthnKey({
  //       passkeyName: PASSKEY_NAME,
  //       passkeyServerUrl: PASSKEY_SERVER_URL,
  //       mode,
  //       passkeyServerHeaders: {},
  //     });

  //     const passkeyValidator = await toPasskeyValidator(publicClient, {
  //       webAuthnKey,
  //       entryPoint,
  //       kernelVersion: KERNEL_V3_1,
  //       validatorContractVersion: PasskeyValidatorContractVersion.V0_0_2,
  //     });

  //     const kernelAccount = await createKernelAccount(publicClient, {
  //       entryPoint: ENTRYPOINT_ADDRESS_V07,
  //       plugins: {
  //         sudo: passkeyValidator,
  //       },
  //       kernelVersion: KERNEL_V3_1,
  //     });

  //     return kernelAccount;
  //   } catch (e) {
  //     // usually just because the user aborted
  //     loggingInPasskey.set(false);
  //   }
  // }

  async function loginPasskey() {
    loggingInPasskey.set(true);
    // const kernelAccount = await createPasskeyKernelAccount(WebAuthnMode.Login);
    // kernelAccount && checkUser(kernelAccount.address);
  }

  async function signUpPasskey() {
    loggingInPasskey.set(true);
    // const kernelAccount = await createPasskeyKernelAccount(WebAuthnMode.Register);
    // kernelAccount && checkUser(kernelAccount.address);
  }

  function validatePassword(login = false) {
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
      if (login) {
        loginPassword(emailValue as string, passwordValue as string);
      } else {
        signUpPassword(emailValue as string, passwordValue as string);
      }
    }
  }

  async function loginPassword(email: string, password: string) {
    loggingInPassword.set(true);
    // try {
    //   const resp = await signInWithEmailAndPassword(auth, email, password);
    //   const userSnap = await getDocs(query(collection(db, "users"), where("userName", "==", resp.user.email)));

    //   if (userSnap.empty) {
    //     serverError.set("There was an error setting up the account");
    //   } else {
    //     const user = userSnap.docs[0].data() as User;
    //     saveUserSession({ address: user.address, userName: user.userName });
    //     reloadUserTokens();
    //     goToNext();
    //   }
    // } catch (e) {
    //   const code = (e instanceof FirebaseError) && e.code;

    //   if (code && code === "auth/missing-email") {
    //     emailError.set("Please enter valid email");

    //   } else if (code && code === "auth/email-already-in-use") {
    //     emailError.set(`This email is already in use, click "Sign in" below to continue`);
    //   } else {
    //     serverError.set(e instanceof FirebaseError ? e.message : String(e));
    //   }
    // } finally {
    //   loggingInPassword.set(false);
    // }
  }

  async function signUpPassword(email: string, password: string) {
    loggingInPassword.set(true);
    // try {
    //   const resp = await createUserWithEmailAndPassword(auth, email, password);
    //   const userSnap = await getDocs(query(collection(db, "users"), where("userName", "==", resp.user.email)));

    //   if (userSnap.empty) {
    //     serverError.set("There was an error setting up the account");
    //   } else {
    //     const user = userSnap.docs[0].data() as User;
    //     saveUserSession({ address: user.address, userName: user.userName });
    //     reloadUserTokens();
    //     goToNext();
    //   }
    // } catch (e) {
    //   const code = (e instanceof FirebaseError) && e.code;

    //   if (code && code === "auth/missing-email") {
    //     emailError.set("Please enter valid email");

    //   } else if (code && code === "auth/email-already-in-use") {
    //     emailError.set(`This email is already in use, click "Sign in" below to continue`);
    //   } else {
    //     serverError.set(e instanceof FirebaseError ? e.message : String(e));
    //   }
    // } finally {
    //   loggingInPassword.set(false);
    // }
  }

  // async function checkUser(address: string) {
  //   try {
  //     // check for with this address in firebase
  //     const userSnap = await getDocs(query(collection(db, "users"), where("address", "==", address)));

  //     if (userSnap.empty) {
  //       userAddress = address;
  //       needsUserName.set(true);
  //     } else {
  //       const user = userSnap.docs[0].data() as User;
  //       saveUserSession({ address, userName: user.userName });
  //       reloadUserTokens();
  //       goToNext();
  //     }
  //   } catch (e) {
  //     const message = e instanceof Error ? e.message : String(e);
  //     serverError.set(message);
  //   } finally {
  //     loggingInPasskey.set(false);
  //   }
  // }

  // async function saveUserName() {
  //   if (!userNameValue) {
  //     userNameError.set("Please enter a user name");
  //   } else {
  //     creatingUser.set(true);
  //     // Check if the username already exists
  //     const userNameQuery = query(collection(db, "users"), where("userName", "==", userNameValue));
  //     const userNameSnap = await getDocs(userNameQuery);

  //     if (!userNameSnap.empty) {
  //       userNameError.set("This username is already taken.");
  //       creatingUser.set(false);
  //       return;
  //     }

  //     await setDoc(doc(db, "users", `user_${uuidv4()}`), {
  //       userName: userNameValue,
  //       address: userAddress,
  //     });

  //     saveUserSession({ address: userAddress, userName: userNameValue });
  //     reloadUserTokens();
  //     goToNext();
  //   }
  // }
</script>

<HeroLayout>
  <div>
    {#if $needsUserName}
      <!-- <div class="flex flex-col gap-4">
        <TextField
          id="userName"
          label="Create a user name"
          bind:value={userNameValue}
          error={$userNameError}
        />

        <Button on:click={saveUserName} disabled={$creatingUser} loading={$creatingUser}>
          <div class="flex items-center justify-center gap-4 text-lg">
            <Key size="24" />
            Continue
          </div>
        </Button>
      </div> -->
    {:else if $logIn}
      {#if $showUserPassword}
        <div class="flex flex-col gap-2">
          <TextField id="email" label="Email" bind:value={emailValue} error={$emailError} />
          <TextField
            id="password"
            label="Password"
            type="password"
            bind:value={passwordValue}
            error={$passwordError}
          />

          <div class="flex items-center gap-4 justify-end">
            <button
              class="text-slate-600 hover:text-slate-400"
              on:click={() => showUserPassword.set(false)}
            >
              Cancel
            </button>
            <Button loading={$loggingInPassword} on:click={() => validatePassword(true)}
              >Log in</Button
            >
          </div>
        </div>
      {:else}
        <div class="flex flex-col gap-6">
          <div class="flex flex-col relative">
            <span
              class="absolute -top-3 -right-2 text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full border border-slate-300"
            >
              Recommended
            </span>
            <Button on:click={loginPasskey} loading={$loggingInPasskey}>
              <div class="flex items-center justify-center gap-4 text-lg">
                <Key size="24" />
                Log in with passkey
              </div>
            </Button>
          </div>

          <Button loading={$loggingInPassword} on:click={() => showUserPassword.set(true)}>
            <div class="flex items-center justify-center gap-4 text-lg">
              <Person size="22" />
              Log in with password
            </div>
          </Button>

          <hr />

          <div class="flex items-center gap-1 mx-auto">
            Don't have an account?
            <button
              class="underline text-slate-600 hover:text-slate-400"
              on:click={() => logIn.set(false)}>Sign up</button
            >
          </div>
        </div>
      {/if}
    {:else}
      <div class="flex flex-col gap-6">
        {#if $showUserPassword}
          <div class="flex flex-col gap-2">
            <TextField id="email" label="Email" bind:value={emailValue} error={$emailError} />
            <TextField
              id="password"
              label="Password"
              type="password"
              bind:value={passwordValue}
              error={$passwordError}
            />

            <div class="flex items-center gap-4 justify-end">
              <button
                class="text-slate-600 hover:text-slate-400"
                on:click={() => showUserPassword.set(false)}
              >
                Cancel
              </button>
              <Button loading={$loggingInPassword} on:click={() => validatePassword()}
                >Sign up</Button
              >
            </div>
          </div>
        {:else}
          <div class="flex flex-col relative">
            <span
              class="absolute -top-3 -right-2 text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full border border-slate-300"
            >
              Recommended
            </span>
            <Button on:click={signUpPasskey} loading={$loggingInPasskey}>
              <div class="flex items-center justify-center gap-4 text-lg">
                <Key size="24" />
                Sign up with passkey
              </div>
            </Button>
          </div>

          <Button loading={$loggingInPassword} on:click={() => showUserPassword.set(true)}>
            <div class="flex items-center justify-center gap-4 text-lg">
              <Person size="22" />
              Sign up with password
            </div>
          </Button>
        {/if}

        {#if $serverError}
          <div class="text-orange-600">
            {$serverError}
          </div>
        {/if}

        <hr />

        <div class="flex items-center gap-1 mx-auto">
          Already have an account?
          <button
            class="underline text-slate-600 hover:text-slate-400"
            on:click={() => logIn.set(true)}
          >
            Log in
          </button>
        </div>
      </div>
    {/if}
  </div>
</HeroLayout>
