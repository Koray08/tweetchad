<script>
  // @ts-nocheck

  import { user } from "../store/userStore.js";
  import axios from "axios";
  import { onMount } from "svelte";
  import { focus } from "../helpers/utils.js";

  export let post;
  export let liked = false;
  export let updateFilteredPosts;
  export let fetchMyLikes;
  export let isNewPost;
  let editing = false;
  let postLikes;
  let postLikesLength;

  const updatePost = async () => {
    try {
      await axios.patch(`/post/${post.id}`, {
        content: post.content,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const deletePost = async (id) => {
    try {
      await axios.delete(`/post/${id}`);
      updateFilteredPosts(id);
    } catch (error) {
      console.error(error);
    }
  };

  const addLike = async () => {
    try {
      await axios.post("/like", {
        userID: $user.id,
        postID: post.id,
      });

      liked = true;
      getPostLikes();
    } catch (error) {
      console.error(error);
    }
  };

  const removeLike = async () => {
    try {
      await axios.delete(`/like/${post.id}`);

      liked = false;
      getPostLikes();
    } catch (error) {
      console.error(error);
    }
  };

  const getPostLikes = async () => {
    try {
      const response = await axios.get(`/post/${post.id}`);

      postLikes = response.data;
      postLikesLength = postLikes.length;
      fetchMyLikes();
    } catch (error) {
      console.error(error);
    }
  };

  const now = new Date();
  const messageTime = new Date(post.createdAt);
  const diffInMilliseconds = now.getTime() - messageTime.getTime();
  const diffInSeconds = Math.round(diffInMilliseconds / 1000);
  const diffInMinutes = Math.round(diffInMilliseconds / 60000);
  const diffInHours = Math.round(diffInMilliseconds / 3600000);

  let elapsedTime;
  if (diffInSeconds < 60) {
    elapsedTime = diffInSeconds + "s";
  } else if (diffInMinutes < 60) {
    elapsedTime = diffInMinutes + "m";
  } else if (diffInHours < 24) {
    elapsedTime = diffInHours + "h";
  } else {
    const messageYear = messageTime.getFullYear();
    const currentYear = now.getFullYear();
    const showYear = messageYear !== currentYear;
    const dateOptions = {
      month: "short",
      day: "numeric",
    };
    if (showYear) {
      dateOptions.year = "numeric";
    }
    elapsedTime = messageTime
      .toLocaleString(undefined, dateOptions)
      .split(" ")
      .reverse()
      .join(" ");
  }

  onMount(() => {
    getPostLikes();
  });
</script>

<div class="flex flex-col border border-twitterGray p-4 text-base font-normal">
  <div class="flex gap-2 justify-between">
    <div class="flex gap-2">
      <div class="font-bold">{post.author.username}</div>
      <div class="">{post.author.email}</div>
      {#if !isNewPost}
        <div>• {elapsedTime}</div>
      {/if}
    </div>

    {#if $user.id === post.author.id}
      <div class="flex gap-3 text-lg">
        {#if editing}
          <button
            on:click={() => {
              editing = false;
              updatePost();
            }}><i class="fa-solid fa-check text-twitterBlue" /></button
          >
        {:else}
          <button on:click={() => (editing = true)}
            ><i
              class="fa-solid fa-pen text-twitterBlue hover:text-lokiBlack"
            /></button
          >
        {/if}
        <button on:click={() => deletePost(post.id)}
          ><i
            class="fa-solid fa-trash text-twitterRed hover:text-lokiBlack"
          /></button
        >
      </div>
    {/if}
  </div>
  {#if editing}
    <div
      use:focus={focus}
      contenteditable="true"
      class="focus:outline-none bg-transparent w-full h-full cursor-text text-base"
      data-placeholder="What's happening?"
      bind:textContent={post.content}
    />
  {:else}
    <div class="whitespace-pre-wrap overflow-auto text-base">
      {post.content}
    </div>
  {/if}

  <div class="flex gap-2 items-center mt-2">
    <div class="text-xl cursor-pointer transition w-max">
      {#if liked}
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <i on:click={removeLike} class="fa-solid fa-heart text-twitterRed" />
      {:else}
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <i
          on:click={addLike}
          class="fa-regular fa-heart hover:text-twitterRed transition"
        />
      {/if}
    </div>

    {#if postLikesLength}
      <label
        for={`likes-modal-${post.id}`}
        class="cursor-pointer w-max hover:underline"
      >
        <span class="font-bold">{postLikesLength}</span>
        likes
      </label>
    {/if}
  </div>

  <input type="checkbox" id={`likes-modal-${post.id}`} class="modal-toggle" />
  <label for={`likes-modal-${post.id}`} class="modal cursor-pointer">
    <label class="modal-box relative" for="">
      <h2 class="font-bold text-xl items mx-auto p-4">Liked by</h2>
      {#if postLikes}
        <div class="flex flex-col gap-1 text-base">
          {#each postLikes as postLike}
            <div class="hover:bg-twitterGray transition p-4 cursor-pointer">
              <div class="font-bold">{postLike.user.username}</div>
              <div class="">{postLike.user.email}</div>
            </div>
          {/each}
        </div>
      {/if}
    </label>
  </label>
</div>
