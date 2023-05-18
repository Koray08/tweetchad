<script>
  // @ts-ignore
  import Router from "svelte-spa-router/Router.svelte";
  import Login from "./lib/Login.svelte";
  import Register from "./lib/Register.svelte";
  import Home from "./lib/Home.svelte";
  import NotFound from "./lib/NotFound404.svelte";
  import axios from "axios";
  axios.defaults.baseURL = "http://localhost:3000";
  axios.defaults.withCredentials = true;

  import "./app.css";

  let routes = {
    "/home": Home,
    "/": Login,
    "/register": Register,
    "*": NotFound,
  };
</script>

<main>
  <Router {routes} />
</main>
