const express = require("express");
const port = 5000;
const connectionToDb = require("./config/db");
const userRouter = require("./routes/api/users");
const profileRouter = require("./routes/api/profile");
const postsRouter = require("./routes/api/posts");
const authRouter = require("./routes/api/auth");
//const listEndpoints = require("express-list-endpoints");  //print all routes

const app = express();
connectionToDb();

app.use(
  express.json({
    extended: false,
  })
);

app.get("/", (req, res) => {
  res.send("home : welcome");
});

//redirection
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/posts", postsRouter);
app.use("/api/v1/profile", profileRouter);

//prints all available routes :) uncomment require
//console.log(listEndpoints(app));

app.listen(process.env.PORT || port, () =>
  console.log(`listening on port ${port}`)
);
