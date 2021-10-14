const express = require("express");
const router = express.Router();
const low = require("lowdb");
const FileAsync = require("lowdb/adapters/FileAsync");
const path = require("path");
const { nanoid } = require("nanoid");

const adapter = new FileAsync(path.join(__dirname, "../db/rights.json"));
const db = low(adapter);

db.then((db) => {
  db.defaults({ items: [] }).write();
});

router.get("/list", (req, res) => {
  db.then((db) => {
    const models = db
      .get("items")
      .value()
      .sort((a, b) => b.update_date - a.update_date);
    res.jsonp({ code: 200, msg: "success", data: models });
  });
});

router.get("/:id", (req, res) => {
  const { id } = req.params;

  db.then((db) => {
    const model = db.get("items").find({ id }).value();
    res.jsonp({ code: 200, msg: "success", data: model });
  });
});

router.post("/add", async (req, res, next) => {
  const model = req.body;
  model.id = nanoid();
  model.create_date = Date.now();
  model.update_date = Date.now();

  db.then((db) => {
    db.get("items")
      .push(model)
      .write()
      .then(() => {
        res.jsonp({ code: 200, msg: "success", data: model });
      });
  });
});

router.put("/update", async (req, res, next) => {
  const { id, ...rest } = req.body;

  db.then((db) => {
    db.get("items")
      .find({ id })
      .assign({ ...rest, update_date: Date.now() })
      .write()
      .then(() => {
        const model = db.get("items").find({ id }).value();
        res.jsonp({ code: 200, msg: "success", data: model });
      });
  });
});

router.post("/delete/:id", function (req, res, next) {
  const { id } = req.params;

  db.then((db) => {
    db.get("items")
      .remove({ id })
      .write()
      .then(() => {
        res.jsonp({ code: 200, msg: "success", data: id });
      });
  });
});

module.exports = router;
