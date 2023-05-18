<script>
  // @ts-nocheck

  import axios from "axios";
  import Router, { push } from "svelte-spa-router/Router.svelte";
  import { onMount } from "svelte";
  import { user, updateUser } from "../store/userStore.js";

  import Posts from "./Posts.svelte";
  import Login from "./Login.svelte";
  import Navbar from "./Navbar.svelte";
  import SideNavbar from "./SideNavbar.svelte";

  let postsList = [];
  let searchTerm = "";
  let content;
  let myLikes;
  let skip = 0;
  let take = 4;
  let loading = false;
  let newPosts = [];

  const routes = {
    "/": Login,
  };

  const fetchPosts = async () => {
    try {
      loading = true;
      const response = await axios.get("/post", {
        params: {
          skip,
          take,
        },
      });

      postsList = [...newPosts, ...filteredPosts, ...response.data];
      newPosts = [];
    } catch (error) {
      updateUser(null, null, null);
      push("/");
      console.error(error);
    }

    loading = false;
  };

  const loadMore = () => {
    skip += take;
    fetchPosts();
  };

  const fetchMyLikes = async () => {
    try {
      const response = await axios.get("/like");

      myLikes = response.data.map((like) => like.postId);
    } catch (error) {
      console.error(error);
    }
  };

  const createPost = async () => {
    try {
      const response = await axios.post("/post", {
        content: content,
      });

      const newPost = response.data;
      newPost.isNewPost = true;
      content = "";

      newPosts = [newPost, ...newPosts];
    } catch (error) {
      console.error(error);
    }
  };

  function updateFilteredPosts(id) {
    filteredPosts = filteredPosts.filter((post) => post.id !== id);
    newPosts = newPosts.filter((post) => post.id !== id);
  }

  $: filteredPosts = postsList.filter((val) => {
    if (searchTerm == "") {
      return true;
    } else if (
      val.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      val.author.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      val.author.username.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return true;
    } else {
      return false;
    }
  });

  onMount(() => {
    fetchMyLikes();
    fetchPosts();
  });
</script>

<main class="drawer">
  <input id="my-drawer" type="checkbox" class="drawer-toggle" />

  <div class="drawer-content flex flex-col">
    <Navbar />
    <div
      class="container mx-auto flex flex-col justify-center max-w-4xl lg:mb-10"
    >
      <div
        class="py-5 text-2xl font-semibold border border-b-0 border-twitterGray p-4"
      >
        Home
      </div>
      <div class="border border-twitterGray p-4 items-end flex flex-col">
        <div
          contenteditable="true"
          class="input m-0 p-0 focus:outline-none bg-transparent w-full h-full cursor-text"
          data-placeholder="What's happening?"
          bind:textContent={content}
        />

        <div class="w-full h-1 bg-twitterGray" />

        <button
          class="btn bg-twitterBlue border-none transition rounded-3xl mt-3"
          on:click={createPost}
          disabled={!content}>Tweet</button
        >
      </div>

      <div class="relative">
        <i
          class="fa-solid fa-magnifying-glass absolute left-4 top-4 text-gray-400"
        />
        <input
          class="input pl-11 w-full rounded-none focus:outline border border-y-0 border-twitterGray"
          placeholder="Search TweetChad"
          bind:value={searchTerm}
        />
      </div>

      {#if newPosts}
        {#each newPosts as post (post.id)}
          <Posts
            {post}
            liked={myLikes && myLikes.includes(post.id)}
            {fetchMyLikes}
            {updateFilteredPosts}
            isNewPost
          />
        {/each}
      {/if}

      {#if filteredPosts}
        {#each filteredPosts as post}
          <Posts
            {post}
            liked={myLikes && myLikes.includes(post.id)}
            {fetchMyLikes}
            {updateFilteredPosts}
          />
        {/each}
      {/if}

      <button
        on:click={loadMore}
        id="loadmore"
        class="btn bg-twitterBlue border-none my-5 mx-auto w-1/2"
        disabled={loading}
        class:loading
      >
        Show more
      </button>
    </div>
  </div>

  <SideNavbar />
</main>

<Router {routes} />
