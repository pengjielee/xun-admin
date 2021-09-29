const express = require("express");
const router = express.Router();
const low = require("lowdb");
const FileAsync = require("lowdb/adapters/FileAsync");
const path = require("path");
const { nanoid } = require("nanoid");
const dayjs = require("dayjs");
const nodeExcel = require("excel-export");

const db = low(new FileAsync(path.join(__dirname, "../db/note.json")));

db.then((db) => {
  db.defaults({ items: [] }).write();
});

router.get("/export/note", (req, res) => {
  const conf = {};

  conf.name = "mysheet";
  conf.cols = [
    {
      caption: "ID",
      type: "string",
      beforeCellWrite: function (row, cellData) {
        return cellData;
      },
      width: 30,
    },
    {
      caption: "内容",
      type: "string",
      beforeCellWrite: function (row, cellData) {
        return cellData;
      },
      width: 120,
    },
    {
      caption: "创建日期",
      type: "string",
      beforeCellWrite: function (row, cellData) {
        const date = dayjs(cellData).format("YYYY-MM-DD HH:mm:ss");
        return date;
      },
      width: 30,
    },
    {
      caption: "最后更新日期",
      type: "string",
      beforeCellWrite: function (row, cellData) {
        const date = dayjs(cellData).format("YYYY-MM-DD HH:mm:ss");
        return date;
      },
      width: 30,
    },
  ];

  db.then((db) => {
    const models = db
      .get("items")
      .value()
      .sort((a, b) => b.update_date - a.update_date);

    const rows = [];

    models.map((note) => {
      const row = [];
      const { id, content, create_date, update_date } = note;
      row.push(id);
      row.push(content);
      row.push(create_date);
      row.push(update_date);
      rows.push(row);
    });

    conf.rows = rows;

    const result = nodeExcel.execute(conf);
    const fileName = "笔记导出";
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats;charset=utf-8"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=" + encodeURIComponent(fileName) + ".xlsx"
    ); //中文名需要进行url转码
    res.setTimeout(30 * 60 * 1000); //防止网络原因造成超时。
    res.end(result, "binary");
  });
});

module.exports = router;
