<script>
  // @ts-nocheck

  import { user } from "../store/userStore.js";
  import axios from "axios";
  import { onMount } from "svelte";
  import { focus, dateCalculator } from "../helpers/utils.js";

  export let post;
  export let liked = false;
  export let updateFilteredPosts;
  export let fetchMyLikes;
  export let isNewPost;
  let editing = false;
  let postCreatedTime = dateCalculator(post.createdAt);
  let postLikes = "";
  let reply = "";
  let comments = "";

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
      fetchMyLikes();
    } catch (error) {
      console.error(error);
    }
  };

  const getPostComments = async () => {
    try {
      const response = await axios.get(`/comment/${post.id}`);

      comments = response.data.reverse();
    } catch (error) {
      console.log(error);
    }
  };

  const addComment = async () => {
    try {
      const response = await axios.post("/comment", {
        postID: post.id,
        content: reply,
      });

      const newComment = response.data;
      newComment.isNewComment = true;
      reply = "";

      comments = [newComment, ...comments];
    } catch (error) {
      console.error(error);
    }
  };

  const removeComment = async (id) => {
    try {
      const response = await axios.delete(`/comment/${id}`);

      comments = comments.filter((comment) => comment.id !== response.data.id);
    } catch (error) {
      console.error(error);
    }
  };

  onMount(() => {
    getPostLikes();
    getPostComments();
  });
</script>

<div class="flex flex-col border border-twitterGray p-4 text-base font-normal">
  <div class="flex gap-2 justify-between">
    <div class="flex gap-2">
      <div class="font-bold">{post.author.username}</div>
      <div class="">{post.author.email}</div>
      {#if !isNewPost}
        <div>• {postCreatedTime}</div>
      {/if}
    </div>

    {#if $user.id === post.author.id}
      <div class="flex gap-3 text-lg">
        {#if editing}
          <button
            on:click={() => {
              editing = false;
              updatePost();
            }}
            ><i
              class="fa-solid fa-check text-twitterBlue active:scale-95"
            /></button
          >
        {:else}
          <button on:click={() => (editing = true)}
            ><i
              class="fa-solid fa-pencil hover:text-twitterBlue"
            /></button
          >
        {/if}
        <button on:click={() => deletePost(post.id)}
          ><i
            class="fa-regular fa-trash-can text-lg hover:text-twitterRed"
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
    <label
      for={`comments-modal-${post.id}`}
      class="cursor-pointer w-max mr-2 flex items-center gap-2"
    >
      <span class="font-bold"
        ><i
          class="fa-regular fa-comment text-twitterBlue text-xl hover:text-blue-800"
        /></span
      >
      {#if comments.length}
        <div class="font-bold">{comments.length}</div>
      {/if}
    </label>

    <div class="text-xl cursor-pointer transition w-max">
      {#if liked}
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <i on:click={removeLike} class="fa-solid fa-heart text-twitterRed" />
      {:else}
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <i
          on:click={addLike}
          class="fa-regular fa-heart hover:text-twitterRed"
        />
      {/if}
    </div>

    {#if postLikes.length}
      <label
        for={`likes-modal-${post.id}`}
        class="cursor-pointer w-max hover:underline"
      >
        <span class="font-bold">{postLikes.length}</span>
        likes
      </label>
    {/if}
  </div>

  <input type="checkbox" id={`likes-modal-${post.id}`} class="modal-toggle" />
  <label for={`likes-modal-${post.id}`} class="modal cursor-pointer">
    <label class="modal-box relative h-[40%] overflow-y-auto" for="">
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

  <input
    type="checkbox"
    id={`comments-modal-${post.id}`}
    class="modal-toggle"
  />
  <label for={`comments-modal-${post.id}`} class="modal cursor-pointer">
    <label
      class="modal-box relative min-h-[45%] lg:max-h-[75%] lg:!max-w-[45%] !break-words"
      for=""
    >
      <div class="p-4">
        <div class="flex gap-2">
          <div class="font-bold">{post.author.username}</div>
          <div>{post.author.email}</div>
          <div>{postCreatedTime}</div>
        </div>
        <div class="mt-2 mb-4 text-lg">{post.content}</div>
        <div>
          Replying to <span class="text-twitterBlue"
            >@{post.author.username}</span
          >
        </div>
      </div>
      <div class="my-auto border-t border-twitterGray px-4 py-3 flex flex-col">
        <div
          use:focus={focus}
          contenteditable="true"
          class="focus:outline-none bg-transparent w-full h-full cursor-text text-base"
          data-placeholder="Tweet your reply!"
          bind:textContent={reply}
        />
        <button
          class="btn bg-twitterBlue border-none transition rounded-3xl mt-3 ml-auto"
          on:click={addComment}
          disabled={!reply}>Reply</button
        >
      </div>
      <div class="border-t border-twitterGray">
        {#each comments as comment}
          <div
            class="border-b border-twitterGray px-4 py-2 flex justify-between"
          >
            <div class="w-11/12">
              <div class="flex gap-2 !overflow-hidden">
                <div class="font-bold">{comment.author.username}</div>
                <div>{comment.author.email}</div>
                {#if !comment.isNewComment}
                  <div>• {dateCalculator(comment.createdAt)}</div>
                {/if}
              </div>
              <div>{comment.content}</div>
            </div>

            {#if $user.id === comment.author.id}
              <button class="my-auto" on:click={() => removeComment(comment.id)}
                ><i
                  class="fa-regular fa-trash-can text-lg hover:text-twitterRed transition"
                /></button
              >
            {/if}
          </div>
        {/each}
      </div>
    </label>
  </label>
</div>
