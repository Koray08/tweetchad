<script>
  // @ts-nocheck

  import { user } from "../store/userStore.js";
  import axios from "axios";
  import { push } from "svelte-spa-router/Router.svelte";
  import { updateUser } from "../store/userStore.js";
  import { focus } from "../helpers/utils.js";
  let editing = false;
  let loading = false;

  const logout = async () => {
    updateUser(null, null, null);
    localStorage.clear();
    push("/");
  };

  const deleteAccount = async () => {
    try {
      loading = true;
      await axios.delete("/user");

      updateUser(null, null, null);
      localStorage.clear();
      push("/register");
    } catch (error) {
      console.error(error);
    }

    loading = false;
  };

  const updateName = async () => {
    try {
      await axios.patch(`/user/${$user.username}`);

      updateUser($user.id, $user.username, $user.email);
    } catch (error) {
      console.error(error);
    }
  };
</script>

<div class="drawer-side">
  <label for="my-drawer" class="drawer-overlay" />
  <div class="menu p-4 w-72 bg-base-100 items-center text-black">
    <div class="flex flex-col text-2xl items-center">
      <img src="tweet-chad.png" alt="profilePicture" class="w-24 my-4" />
      {#if editing}
        <div class="flex gap-3 text-xl">
          <div
            use:focus={focus}
            contenteditable="true"
            class="focus:outline-none cursor-text font-semibold text-2xl"
            data-placeholder="What's happening?"
            bind:textContent={$user.username}
          />
          <button
            on:click={() => {
              editing = false;
              updateName();
            }}
          >
            <i class="fa-solid fa-check text-xl text-twitterBlue" />
          </button>
        </div>
      {:else}
        <div class="flex gap-3">
          <div class="font-semibold">{$user.username}</div>
          <button on:click={() => (editing = true)}>
            <i class="fa-solid fa-pen-to-square text-twitterBlue" />
          </button>
        </div>
      {/if}
      <div>{$user.email}</div>
      <div class="divider" />
      <button
        on:click={logout}
        class="btn btn-primary bg-lokiBlack rounded-xl w-full"
        class:loading
        disabled={loading}
      >
        Logout
      </button>
      <button
        on:click={deleteAccount}
        class="btn btn-primary bg-twitterRed mt-2 rounded-xl w-full"
        class:loading
        disabled={loading}
      >
        Delete Account
      </button>
    </div>
  </div>
</div>

<style>
  button {
    @apply border-none;
  }
</style>
