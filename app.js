const path = require("path");
var http = require("http");
require('dotenv').config()
const cheerio = require("cheerio");
const rp = require("request-promise");
const bodyParser = require("body-parser");
const express = require("express");
const app = express();
const http_port = 5000;
const https_port = 5443;

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");
app.use(express.static(path.join(__dirname, "public")));
app.use([
    bodyParser.urlencoded({
        extended: false
    }),
    bodyParser.json()
]);
app.get("/", (req, res) => {
    res.render("index", {
        title: "APP CALC"
    });
});
app.route("/calc").post((req, res) => {
    var lot = req.body.mm / (req.body.pos - req.body.sl) / req.body.pip;
    if (req.body.pos == req.body.sl)
        res.status(400).json({
            error: "pos_sl_same_val"
        });
    else
        res.status(200).json({
            lot: lot
        });
});

app.route("/get").get((req, res) => {
    let getData = req.query.data;
    let cur = req.query.cur;
    let opt = {
        uri: "https://ssltools.forexprostools.com/pip-calculator/index.php",
        json: true,
        transform: function (body) {
            return cheerio.load(body);
        }
    };
    rp(opt).then($ => {
        if (getData == "currency") {
            var resObj = [];
            $("#total .subtotal").each(function (el, i) {
                resObj.push(
                    $(this)
                    .find(".currency a")
                    .text()
                );
            });
            res.json(resObj);
        } else if (getData == "pip") {
            var resObj = [];
            $("#total .subtotal").each(function (el, i) {
                resObj.push({
                    currency: $(this)
                        .find(".currency a")
                        .text(),
                    pipValue: $(this)
                        .find(".standard")
                        .text()
                        .replace(/[^(0-9)+.]/g, "")
                });
            });
            if (typeof cur !== "undefined") {
                let x = resObj.findIndex(resObj => resObj.currency === cur);
                if (x !== false) res.json(resObj[x]);
                else res.status(404).end();
            } else res.json(resObj);
        } else res.status(404).end();
    });
});

var http = http.createServer(app);
// var https = https.createServer(credentials, app);

// http.listen(https_port, () => {
//   console.log("https listen to: " + https_port);
// });

// app.listen(port, () => {
//     console.log("listen to port " + port);
//     // shell.exec('yarn webpack --config webpack.config.js')
// });
if (process.env.NODE_ENV == "staging") {
    const shell = require('shelljs')
    const reload = require('reload');
    console.log(process.env.NODE_ENV);
    reload(app).then(function (reloadReturned) {
        http.listen(process.env.PORT || 5000, () => {
            console.log("http listen to: " + http_port);
            shell.exec('yarn webpack --config webpack.config.js')

        });
    }).catch((err) => {
        console.log("failed", err);
    })
} else {
    console.log(process.env.NODE_ENV);
    http.listen(process.env.PORT || 5000, () => {
        console.log("http listen to: " + http_port);
    });
}