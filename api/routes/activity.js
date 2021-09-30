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
    const models = db
      .get("items")
      .value()
      .sort((a, b) => b.update_date - a.update_date);
    res.jsonp({ code: 200, msg: "success", data: models });
  });
});

router.get("/draft/:id", async (req, res) => {
  const { id } = req.params;

  db.then((db) => {
    const model = db.get("items").find({ id }).value();
    const order = model.draft_module_ids || "";

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

router.get("/byid/:id", async (req, res) => {
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

router.get("/byurl/:url", async (req, res) => {
  const { url } = req.params;

  db.then((db) => {
    const model = db.get("items").find({ url }).value();
    const order = model.module_ids || "";

    moduleDB.then((db) => {
      let modules = db.get("items").filter({ activity_id: model.id }).value();

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
  model.draft_config = "";
  model.draft_module_ids = "";
  model.draft_end_date = "";
  model.draft_end_title = "";
  model.draft_end_content = "";
  model.create_date = Date.now();
  model.update_date = Date.now();
  model.first_publish_date = "";
  model.status = 2; //默认为2，待发布
  model.module_ids = "";

  db.then((db) => {
    const dbModel = db.get("items").find({ url: model.url }).value();
    if (dbModel) {
      return res.jsonp({ code: 500, msg: "failture", data: null });
    }

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
  //status=1,已上线; status=2,待发布; status=3,已下线
  db.then((db) => {
    const others = db
      .get("items")
      .value()
      .filter((p) => p.id != id);
    const exist = others.some((p) => p.url === rest.url);
    if (exist) {
      return res.jsonp({ code: 500, msg: "failture", data: null });
    }

    db.get("items")
      .find({ id })
      .assign({ ...rest, status: 2, update_date: Date.now() })
      .write()
      .then(() => {
        const model = db.get("items").find({ id }).value();
        res.jsonp({ code: 200, msg: "success", data: model });
      });
  });
});

router.post("/publish/:id", async (req, res, next) => {
  const { id } = req.params;

  //发布所有模块
  moduleDB.then((db) => {
    let modules = db.get("items").filter({ activity_id: id }).value();

    modules.forEach((item) => {
      db.get("items")
        .find({ id: item.id })
        .assign({ config: item.draft_config })
        .write();
    });
  });

  db.then((db) => {
    const dbModel = db.get("items").find({ id }).value();

    const {
      draft_name,
      draft_title,
      draft_keywords,
      draft_description,
      draft_config,
      draft_module_ids,
      draft_end_date,
      draft_end_title,
      draft_end_content,
    } = dbModel;

    const data = {
      name: draft_name,
      title: draft_title,
      keywords: draft_keywords,
      description: draft_description,
      config: draft_config,
      module_ids: draft_module_ids,
      status: 1,
      first_publish_date: Date.now(),
      end_date: draft_end_date,
      end_title: draft_end_title,
      end_content: draft_end_content,
    };

    db.get("items")
      .find({ id })
      .assign(data)
      .write()
      .then(() => {
        res.jsonp({ code: 200, msg: "success", data: "" });
      });
  });
});

router.post("/online/:id", async (req, res, next) => {
  const { id } = req.params;

  db.then((db) => {
    db.get("items")
      .find({ id })
      .assign({ status: 1 })
      .write()
      .then(() => {
        res.jsonp({ code: 200, msg: "success", data: "" });
      });
  });
});

router.post("/offline/:id", async (req, res, next) => {
  const { id } = req.params;

  db.then((db) => {
    db.get("items")
      .find({ id })
      .assign({ status: 3 })
      .write()
      .then(() => {
        res.jsonp({ code: 200, msg: "success", data: "" });
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
  model.draft_config = "";
  model.config = "";

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
  const { id, activity_id, ...rest } = req.body;

  //更新活动状态为待发布
  db.then((db) => {
    db.get("items").find({ id: activity_id }).assign({ status: 2 }).write();
  });

  moduleDB.then((db) => {
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
