require("dotenv").config();
const express = require("express");
const insertRouter = require("./insert");
const updateRouter = require("./update");
const deleteRouter = require("./delete");
const fetchRouter = require("./fetch");
const searchRouter = require("./search");
const authRouter = require("./auth");
const cors = require("cors");

app = express();

app.use(express.json());
app.use(cors());
app.use("/create", insertRouter);
app.use("/update", updateRouter);
app.use("/delete", deleteRouter);
app.use("/fetch", fetchRouter);
app.use("/search", searchRouter);
app.use("/auth", authRouter);
app.use("/uploads", express.static("uploads"));

port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log("listening on port: " + port);
});
