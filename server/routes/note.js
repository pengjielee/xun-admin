const express = require("express");
const router = express.Router();
const low = require("lowdb");
const FileAsync = require("lowdb/adapters/FileAsync");
const path = require("path");

const adapter = new FileAsync(path.join(__dirname, "../db/note.json"));
const db = low(adapter);

db.then((db) => {
  db.defaults({ notes: [] }).write();
});

router.get("/list", (req, res) => {
  db.then((db) => {
    const notes = db.get("notes").value();
    res.jsonp({ code: 200, msg: "success", data: notes });
  });
});

router.get("/:id", (req, res) => {
  db.then((db) => {
    const notes = db.get("notes").value();
    const note = notes.find((p) => p.id === req.params.id);
    res.jsonp({ code: 200, msg: "success", data: note });
  });
});

router.post("/add", async (req, res, next) => {
  const note = req.body;
  note.id = Date.now();
  db.then((db) => {
    db.get("notes")
      .push(note)
      .write()
      .then(() => {
        const added = db
          .get("notes")
          .value()
          .find((p) => p.id === note.id);
        res.jsonp({ code: 200, msg: "success", data: added });
      });
  });
});

router.post("/update", async (req, res, next) => {
  const note = req.body;
  db.then((db) => {
    db.get("notes")
      .find({ id: note.id })
      .assign(note)
      .write()
      .then(() => {
        const updated = db
          .get("notes")
          .value()
          .find((p) => p.id === note.id);
        res.jsonp({ code: 200, msg: "success", data: updated });
      });
  });
});

router.post("/delete/:id", function (req, res, next) {
  var id = req.params.id;
  db.then((db) => {
    var brand = db
      .get("notes")
      .remove({ id: id })
      .write()
      .then(() => {
        res.jsonp({ code: 200, msg: "success", data: id });
      });
  });
});

module.exports = router;
