const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const { uploadFile, insert } = require("./AWS");

const app = express();

app.use(express.static("public"));
app.use(bodyParser.json({ limit: "100mb" }));

app.get("/", (req, res) => {
  const result = res.sendFile(path.join(__dirname, "/index.html"));
});

app.post("/api/upload", async (req, res) => {
  try {
    const response = await uploadFile(req.body.image);
    const insertData = new insert();
    const result = await insertData.insertData(
      req.body.text,
      `https://d1in12f4k6dok2.cloudfront.net/${response.key}`
    );
    if (!result) {
      res.status(500).json({ result: "insert failed" });
    }
    res.status(200).json({ result: "success" });
  } catch (err) {
    res.status(500).json({ result: "failure" });
  }
});

app.get("/api/get", (req, res) => {
  const getData = new insert();
  getData.getData(function (results) {
    res.status(200).json({ data: results });
  });
});

app.listen(5000, () => {
  console.log(`Server listening on port 5000`);
});
