const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false, limit: "10mb" }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.use("/api/note", require("./routes/note"));
app.use("/api/article", require("./routes/article"));
app.use("/api/file", require("./routes/file"));
app.use("/api/excel", require("./routes/excel"));
app.use("/api/activity", require("./routes/activity"));

const PORT = 3001;

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
