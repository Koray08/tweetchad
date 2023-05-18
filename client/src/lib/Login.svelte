<script>
  import axios from "axios";
  import { push } from "svelte-spa-router/Router.svelte";
  import { updateUser } from "../store/userStore.js";
  import { emailRegex } from "../helpers/utils.js";
  import { user } from "../store/userStore.js";

  if ($user.id) {
    push("/home");
  }

  let loginEmail = "";
  let password = "";
  let loading = false;
  let errorMessage = "";

  const handleLogin = async () => {
    errorMessage = "";

    if (!emailRegex.test(loginEmail)) {
      errorMessage = "Please enter a valid E-Mail address.";
      return;
    }
    if (loginEmail.length === 0 || password.length === 0) {
      errorMessage = "Please fill out all fields.";
      return;
    }

    if (password.length < 6) {
      errorMessage = "Your password must be at least 6 characters long.";
      return;
    }
    try {
      loading = true;
      errorMessage = "";

      const response = await axios.post("/login", {
        email: loginEmail,
        password: password,
      });

      const { id, username, email } = response.data;
      updateUser(id, username, email);

      await push("/home");

      loginEmail = "";
      password = "";
    } catch (error) {
      errorMessage = "Incorrect email address or password";
      console.error(error);
    }

    loading = false;
  };
</script>

<div>
  <div class="text-center pt-8">
    <img src="tweet-chad.png" alt="bro logo" class="w-24 m-auto" />
  </div>

  {#if errorMessage}
    <div
      class="w-96 p-4 text-lg mt-3 rounded-2xl m-auto bg-yellow-400 shadow-lg"
    >
      {errorMessage}
    </div>
  {/if}

  <form
    on:submit|preventDefault
    class="w-96 m-auto p-8 rounded-2xl mt-5 transition bg-base-100 bg-base shadow"
  >
    <div>
      <h2 class="text-left text-xl">Login Bro!</h2>

      <input
        type="email"
        placeholder="Email"
        bind:value={loginEmail}
        class="mt-4"
        autocomplete="on"
      />

      <input
        type="password"
        placeholder="Password"
        bind:value={password}
        class="mt-2"
      />

      <button
        class="btn bg-twitterBlue border-none w-full mt-4"
        class:loading
        disabled={loading}
        on:click={handleLogin}>Login</button
      >

      <div class="divider">OR</div>

      <button on:click={() => push("/register")} class="btn bg-lokiBlack w-full"
        >Register</button
      >
    </div>
  </form>

  <p class="text-center mt-6 text-sm font-normal">
    By using this Software in any way shape or form you're agreeing to our Terms
    of Use. <br /> Copyright @ 2023 - All rights reserved by TweetChad LLC.
  </p>
</div>

<style>
  input {
    @apply input input-bordered w-full border;
  }

  input:focus {
    @apply border-twitterBlue;
  }
</style>
