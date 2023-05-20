import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import registerRoute from "./routes/Register.js";
import loginRoute from "./routes/Login.js";
import userRoute from "./routes/User.js";
import postRoute from "./routes/Post.js";
import likeRoute from "./routes/Like.js";
import commentRoute from "./routes/Comment.js";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    credentials: true,
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST", "DELETE", "PATCH"],
  })
);

app.use("/register", registerRoute);
app.use("/login", loginRoute);
app.use("/user", userRoute);
app.use("/post", postRoute);
app.use("/like", likeRoute);
app.use("/comment", commentRoute);

app.listen(3000, () => {
  console.log("listening on port 3000...");
});
