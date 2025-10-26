import express from "express";


import pool from "./db.js";

const app = express();

app.listen(3000, () => {
  console.log("🚀 Server is running on port 3000");
});
