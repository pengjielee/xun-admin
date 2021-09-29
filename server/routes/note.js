const express = require("express");
const router = express.Router();
const low = require("lowdb");
const FileAsync = require("lowdb/adapters/FileAsync");
const path = require("path");
const { nanoid } = require("nanoid");

const adapter = new FileAsync(path.join(__dirname, "../db/note.json"));
const db = low(adapter);

db.then((db) => {
  db.defaults({ notes: [] }).write();
});

router.get("/list", (req, res) => {
  db.then((db) => {
    const notes = db
      .get("notes")
      .value()
      .sort((a, b) => b.update_date - a.update_date);
    res.jsonp({ code: 200, msg: "success", data: notes });
  });
});

router.get("/:id", (req, res) => {
  db.then((db) => {
    const note = db
      .get("notes")
      .value()
      .find((p) => p.id === req.params.id);
    res.jsonp({ code: 200, msg: "success", data: note });
  });
});

router.post("/add", async (req, res, next) => {
  const note = req.body;
  note.id = nanoid();
  note.create_date = Date.now();
  note.update_date = Date.now();
  db.then((db) => {
    db.get("notes")
      .push(note)
      .write()
      .then(() => {
        res.jsonp({ code: 200, msg: "success", data: note });
      });
  });
});

router.put("/update", async (req, res, next) => {
  const { id, content } = req.body;
  db.then((db) => {
    db.get("notes")
      .find({ id })
      .assign({ content, update_date: Date.now() })
      .write()
      .then(() => {
        const updated = db
          .get("notes")
          .value()
          .find((p) => p.id === id);
        res.jsonp({ code: 200, msg: "success", data: updated });
      });
  });
});

router.post("/delete/:id", function (req, res, next) {
  const { id } = req.params;
  db.then((db) => {
    db.get("notes")
      .remove({ id })
      .write()
      .then(() => {
        res.jsonp({ code: 200, msg: "success", data: id });
      });
  });
});

module.exports = router;
