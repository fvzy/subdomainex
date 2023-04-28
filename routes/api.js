const cors = require("cors");
var bodyParser = require("body-parser");
const fetch = require("node-fetch");
const express = require("express");
const rateLimit = require("express-rate-limit");
const passport = require("passport");
const github = require("./../utils/github");
const Subdomain = require("../model/SubdoModel");
require("dotenv").config();
const fs = require("fs");

passport.use(github);

const router = express.Router();
router.use(bodyParser.json()); // for parsing application/json
router.use(bodyParser.urlencoded({ extended: true }));

router.use(passport.initialize());
router.use(passport.session());
const { CF_GLOBAL_APIKEY, CF_ZONE_ID, CF_EMAIL } = process.env;
const baseUrl = "https://api.cloudflare.com/client/v4/zones/" + CF_ZONE_ID;
const addLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 250,
  message: "Too many request from this IP, please try again after 15 minutes",
  standardHeaders: true,
  legacyHeaders: false,
  handler: function (req, res, next) {
    // lmao 200 OK
    res.status(200).send({
      success: false,
      errors: [
        {
          message: "Rate Limited",
          error_chain: [
            {
              message: "Slow down dude! You're too fast. Wait 15 minutes.",
            },
          ],
        },
      ],
    });
  },
});

router.get("/isexists", async (req, res, next) => {
  const q = req.query.q;
  const type = req.query.type;
  const dom = [];
  fetch(baseUrl + "/dns_records?type=" + type + "&match=all", {
    method: "GET",
    headers: {
      "Content-type": "application/json",
      "X-Auth-Email": CF_EMAIL,
      "X-Auth-Key": CF_GLOBAL_APIKEY,
    },
  })
    .then((d) => d.json())
    .then((x) => {
      if (x.success) {
        let result = x.result;
        for (var i = 0; i < result.length; i++) {
          dom.push(result[i].name);
        }
        res.status(200).json({
          result: dom.includes(q),
        });
      } else {
        console.log(x);
        res.sendStatus(500);
      }
    })
    .catch((x) => {
      console.log(x);
      res.sendStatus(500);
    });
});

router.get("/add", addLimit, async (req, res, next) => {
  try {
    const subdomain = req.query.subdomain;
    const content = req.query.content;
    const type = req.query.type;
    const username = req.query.username;
    const data = {
      type,
      name: `${subdomain}.botwa.net`,
      content,
      ttl: 1,
      proxied: false,
    };
    const response = await fetch(`${baseUrl}/dns_records`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        "X-Auth-Email": CF_EMAIL,
        "X-Auth-Key": CF_GLOBAL_APIKEY,
      },
      body: JSON.stringify(data),
    });
    const responseData = await response.json();
    const dat = {
      type,
      sub: `${subdomain}.botwa.net`,
      content,
      ttl: 1,
      proxied: false,
    };
    console.log(dat);
    res.json({ result: dat });
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});


module.exports = router;

