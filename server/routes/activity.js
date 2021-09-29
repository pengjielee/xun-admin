const express = require("express");
const router = express.Router();
const low = require("lowdb");
const FileAsync = require("lowdb/adapters/FileAsync");
const path = require("path");
const { nanoid } = require("nanoid");

const adapter = new FileAsync(path.join(__dirname, "../db/activity.json"));
const db = low(adapter);

db.then((db) => {
  db.defaults({ items: [] }).write();
});

const moduleDB = low(new FileAsync(path.join(__dirname, "../db/module.json")));

moduleDB.then((db) => {
  db.defaults({ items: [] }).write();
});

router.get("/list", (req, res) => {
  db.then((db) => {
    const items = db
      .get("items")
      .value()
      .sort((a, b) => b.update_date - a.update_date);
    res.jsonp({ code: 200, msg: "success", data: items });
  });
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;

  db.then((db) => {
    const model = db.get("items").find({ id }).value();
    const order = model.module_ids || "";

    moduleDB.then((db) => {
      let modules = db.get("items").filter({ activity_id: id }).value();

      if (order) {
        modules = modules.sort((a, b) => {
          return order.indexOf(a.id) - order.indexOf(b.id);
        });
      }

      res.jsonp({
        code: 200,
        msg: "success",
        data: {
          activity: model,
          modules: modules,
        },
      });
    });
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
        const updated = db
          .get("items")
          .value()
          .find((p) => p.id === id);
        res.jsonp({ code: 200, msg: "success", data: updated });
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

router.get("/module/:id", async (req, res) => {
  const { id } = req.params;

  moduleDB.then((db) => {
    const model = db.get("items").find({ id }).value();

    res.jsonp({ code: 200, msg: "success", data: model });
  });
});

router.post("/module/add", async (req, res, next) => {
  const model = req.body;
  model.id = nanoid();
  model.create_date = Date.now();
  model.update_date = Date.now();
  moduleDB.then((db) => {
    db.get("items")
      .push(model)
      .write()
      .then(() => {
        res.jsonp({ code: 200, msg: "success", data: model });
      });
  });
});

router.post("/module/update", async (req, res, next) => {
  const { id, ...rest } = req.body;
  moduleDB.then((db) => {
    db.get("items")
      .find({ id })
      .assign({ ...rest, update_date: Date.now() })
      .write()
      .then(() => {
        const updated = db.get("items").find({ id }).value();
        res.jsonp({ code: 200, msg: "success", data: updated });
      });
  });
});

router.post("/module/delete/:aid/:id", function (req, res, next) {
  const { aid, id } = req.params;
  moduleDB.then((db) => {
    db.get("items")
      .remove({ id })
      .write()
      .then(() => {
        const modules = db.get("items").filter({ activity_id: aid }).value();
        res.jsonp({ code: 200, msg: "success", data: modules });
      });
  });
});

module.exports = router;
