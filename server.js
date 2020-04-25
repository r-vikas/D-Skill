const express = require("express");

const app = express();

const PORT = process.env.PORT || 4000;

app.get("/", (req, res) => {
    res.send("home : welcome")
})

app.listen(PORT, () => {
    console.log("hello world")
});