const express = require("express");
const router = express.Router();
const low = require("lowdb");
const FileAsync = require("lowdb/adapters/FileAsync");
const path = require("path");
const { nanoid } = require("nanoid");

const adapter = new FileAsync(path.join(__dirname, "../db/article.json"));
const db = low(adapter);

db.then((db) => {
  db.defaults({ articles: [] }).write();
});

router.get("/list", (req, res) => {
  db.then((db) => {
    const articles = db
      .get("articles")
      .value()
      .sort((a, b) => b.update_date - a.update_date);
    res.jsonp({ code: 200, msg: "success", data: articles });
  });
});

router.get("/:id", (req, res) => {
  db.then((db) => {
    const article = db
      .get("articles")
      .value()
      .find((p) => p.id === req.params.id);
    res.jsonp({ code: 200, msg: "success", data: article });
  });
});

router.post("/add", async (req, res, next) => {
  const article = req.body;
  article.id = nanoid();
  article.create_date = Date.now();
  article.update_date = Date.now();
  db.then((db) => {
    db.get("articles")
      .push(article)
      .write()
      .then(() => {
        const added = db
          .get("articles")
          .value()
          .find((p) => p.id === article.id);
        res.jsonp({ code: 200, msg: "success", data: added });
      });
  });
});

router.put("/update", async (req, res, next) => {
  const { id, ...rest } = req.body;
  db.then((db) => {
    db.get("articles")
      .find({ id })
      .assign({ ...rest, update_date: Date.now() })
      .write()
      .then(() => {
        const updated = db
          .get("articles")
          .value()
          .find((p) => p.id === id);
        res.jsonp({ code: 200, msg: "success", data: updated });
      });
  });
});

router.post("/delete/:id", function (req, res, next) {
  const { id } = req.params;
  db.then((db) => {
    db.get("articles")
      .remove({ id })
      .write()
      .then(() => {
        res.jsonp({ code: 200, msg: "success", data: id });
      });
  });
});

module.exports = router;
