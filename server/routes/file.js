const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs-extra");
const low = require("lowdb");
const FileAsync = require("lowdb/adapters/FileAsync");
const { nanoid } = require("nanoid");

const adapter = new FileAsync(path.join(__dirname, "../db/file.json"));
const db = low(adapter);

db.then((db) => {
  db.defaults({ files: [] }).write();
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const date = new Date();
    const year = date.getFullYear() + "";
    let month = date.getMonth() + 1 + "";
    month = month[1] ? month : "0" + month;

    const dest = path.join("public/uploads", year, month);
    fs.mkdirpSync(dest);
    req.dest = dest;
    cb(null, dest);
  },
  filename: function (req, file, cb) {
    const { name, ext } = path.parse(file.originalname);

    const id = nanoid();
    const filename = id + ext;

    //检查当前目录中是否存在该文件。
    fs.access(path.join(req.dest, filename), (err) => {
      if (err) {
        //如果不存在，则保存
        cb(null, filename);
      } else {
        //如果存在，则加上当前时间戳
        const filename = id + "-" + Date.now() + "" + ext;
        cb(null, filename);
      }
    });
  },
});

const upload = multer({
  storage: storage,
  limits: {
    files: 5,
    fieldSize: 2 * 1024 * 1024, // 2 MB (max file size)
  },
  fileFilter: function (req, file, cb) {
    file.originalname = file.originalname.toLowerCase();
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
      return cb(new Error("Only image are allowed."), false);
    }
    cb(null, true);
  },
});

router.get("/list", (req, res) => {
  db.then((db) => {
    const files = db
      .get("files")
      .value()
      .sort((a, b) => b.create_date - a.create_date);
    res.jsonp({ code: 200, msg: "success", data: files });
  });
});

router.post("/upload", upload.single("file"), async (req, res, next) => {
  const file = {
    id: nanoid(),
    create_date: Date.now(),
    url: req.file.path,
  };
  db.then((db) => {
    db.get("files")
      .push(file)
      .write()
      .then(() => {
        res.jsonp({ code: 200, msg: "success", data: file });
      });
  });
});

router.post("/uploads", upload.array("files"), async (req, res, next) => {
  const files = [];

  req.files.forEach((file) => {
    files.push({
      id: nanoid(),
      create_date: Date.now(),
      url: file.path,
    });
  });

  db.then((db) => {
    files.forEach((file) => {
      db.get("files").push(file).write();
    });
    res.jsonp({ code: 200, msg: "success", data: files });
  });
});

router.post("/delete/:id", function (req, res, next) {
  const { id } = req.params;
  db.then((db) => {
    db.get("files")
      .remove({ id })
      .write()
      .then(() => {
        res.jsonp({ code: 200, msg: "success", data: id });
      });
  });
});

module.exports = router;
