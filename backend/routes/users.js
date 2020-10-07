const express = require("express");
const app = express.Router();

const { users } = require("../controllers");
const auth = require("../config/auth");
const multer = require("multer");
const util = require("util");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/avatar");
  },
  filename: function (req, file, cb) {
    var fileObj = {
      "image/png": ".png",
      "image/jpeg": ".jpeg",
      "image/jpg": ".jpg",
    };
    if (fileObj[file.mimetype] == undefined) {
      cb(new Error("file format not valid"));
    } else {
      cb(null, file.fieldname + "-" + Date.now() + fileObj[file.mimetype]);
    }
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
  //fileFilter: imageFilter,
});
const uploadAsync = util.promisify(upload.single("avatar")); // field in database

// authorization
app.get("/auth", auth.userAuth, users.tokenAuth);

app.post("/registerauth", users.registerWithExternalDataThenLogin);
app.post("/register", users.register);
app.post("/login", users.login);
app.get("/logout", auth.userAuth, users.logout);

module.exports = app;
