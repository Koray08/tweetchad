<script>
  import axios from "axios";
  import { push } from "svelte-spa-router/Router.svelte";
  import { updateUser } from "../store/userStore.js";
  import { emailRegex } from "../helpers/utils.js";
  import { user } from "../store/userStore.js";

  if ($user.id) {
    push("/home");
  }

  let nickname = "";
  let registerEmail = "";
  let password = "";
  let verifyPassword = "";
  let loading = false;
  let errorMessage = "";

  const handleRegister = async () => {
    errorMessage = "";

    if (!emailRegex.test(registerEmail)) {
      errorMessage = "Please enter a valid E-Mail address.";
      return;
    }
    if (
      nickname.length === 0 ||
      registerEmail.length === 0 ||
      password.length === 0
    ) {
      errorMessage = "Please fill out all fields.";
      return;
    }

    if (password.length < 6) {
      errorMessage = "Your password must be at least 6 characters long.";
      return;
    }

    if (password !== verifyPassword) {
      errorMessage = "Password and Verify Password fields must be the same.";
      return;
    }

    try {
      loading = true;
      errorMessage = "";

      const response = await axios.post("/register", {
        username: nickname,
        password: password,
        email: registerEmail,
      });

      const { id, username, email } = response.data;
      updateUser(id, username, email);

      registerEmail = "";
      password = "";

      push("/home");
    } catch (error) {
      errorMessage = "Email already exists";
      console.error(error);
    }

    loading = false;
  };

  const validateJWT = async () => {
    try {
      const response = await axios.get("/validateJWT");

      if (response.data == "Success") {
        push("/home");
      }
    } catch (error) {
      console.error(error);
    }
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

  <div
    class="w-96 m-auto mt-5 p-8 rounded-2xl transition bg-base-100 bg-base shadow"
  >
    <form on:submit|preventDefault>
      <div>
        <h2 class="text-left text-xl">Register Bro!</h2>

        <input
          type="text"
          placeholder="Username"
          bind:value={nickname}
          class="mt-4"
          autocomplete="on"
        />

        <input
          type="email"
          placeholder="Email"
          bind:value={registerEmail}
          class="mt-2"
          autocomplete="on"
        />

        <input
          type="password"
          placeholder="Password"
          bind:value={password}
          class="mt-2"
          autocomplete="on"
        />

        <input
          type="password"
          placeholder="Verify Password"
          bind:value={verifyPassword}
          class="mt-2"
          autocomplete="on"
        />

        <button
          class="btn bg-twitterBlue border-none w-full mt-4"
          class:loading
          disabled={loading}
          on:click={handleRegister}>Register</button
        >

        <div class="divider">OR</div>

        <button on:click={() => push("/")} class="btn bg-lokiBlack w-full"
          >Go Back</button
        >
      </div>
    </form>
  </div>
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
