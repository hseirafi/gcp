const express = require("express");
const app = express();
const multer = require("multer");
const fetch = require("node-fetch");
const path = require("path");
const key = "641c328a713ad00d";
const upload = multer();

app.use(express.static(path.join(__dirname)));
app.use("/scripts", express.static(__dirname + "/public"));
app.get("/weather", (req, res) => {
  res.sendFile(path.join(__dirname, "views/index.html"));
});

let date = new Date();

app.post("/weather", upload.fields([]), (req, res) => {
  let formData = JSON.parse(req.body.json);
  console.log(formData.lastWeek);
  console.log("latitude", formData.latitude);
  console.log("logitude", formData.longitude);

  if (formData.type) {
    let urls = [];
    console.log("formData", formData.lastWeek);
    let date = formData.lastWeek;
    console.log(date);
    let days = +date.substr(6, 7);
    if (days + 5 < 29) {
      date = +date;
      console.log(date);
      let limit = 6;
      while (--limit) {
        date += 1;
        console.log(date);
        urls.push(
          `https://api.wunderground.com/api/${key}/history_${date}/geolookup/q/${formData.latitude},${formData.longitude}.json`
        );
      }
    }

    Promise.all(
      urls.map(url => fetch(url).then(resp => resp.json()))
    ).then(formated => {
      res.setHeader("Content-Type", "application/json");
      res.send(JSON.stringify(formated, null, 3));
    });
  } else {
    fetch(
      `https://api.wunderground.com/api/${key}/history_${formData.lastWeek}/geolookup/q/${formData.latitude},${formData.longitude}.json`,
      { method: "GET" }
    )
      .then(response => response.json())
      .then(formated => {
        res.setHeader("Content-Type", "application/json");
        res.send(JSON.stringify(formated, null, 3));
      });
  }
});

app.listen(process.env.PORT || 3000);
