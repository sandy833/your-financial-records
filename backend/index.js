const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const bodyParser = require("body-parser");
const routes = require("./routes");
const dotenv = require("dotenv");
const mongoDB = require("./config/mongoose");

const app = express();
const port = process.env.PORT || 5500;

// helmet is to enhance your API's security
app.use(helmet());

dotenv.config();

// bodyParser is to parse JSON bodies into JS objects
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// enambling cors with option setting on all route
let whitelist = [
  "http://localhost",
  "http://localhost:3000",
  "http://localhost:3001",
];
let corsOpt = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS!"));
    }
  },
  methods: "GET,PUT,POST,DELETE",
  preflightContinue: false,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOpt));
mongoDB();

app.get("/", (req, res) => {
  res.status(200).send({
    message: "Server runing...",
  });
  //return res.redirect("https://mamamel.netlify.app");
});

app.use("/api/v1/uploads", express.static("uploads")); // static access (asset file like css, javascript, img)
app.use("/api/v1/users", routes.users);

app.listen(port, () => console.log(`listening at port:${port}`));
