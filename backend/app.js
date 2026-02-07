// const dns = require("dns");
// dns.setServers(["1.1.1.1", "8.8.8.8"]);

const express = require("express");
const path = require("path");
const rootDir = require("./utils/pathUtils");
const session = require("express-session");
require("dotenv").config();
const MongoDBStore = require("connect-mongodb-session")(session);
const { default: mongoose } = require("mongoose");
const cors = require("cors");

const DB_path = process.env.MONGO_URL;
const port = process.env.PORT;

const authRouter = require("./routes/authRouter");
const creatorRouter = require("./routes/creatorRouter");
const viewerRouter = require("./routes/viewerRouter");

const app = express();

// CORS setup
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  }),
);
// Explicitly handle preflight requests for all routes
app.options(
  /.*/,
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  }),
);

// Session store
const store = new MongoDBStore({
  uri: DB_path,
  collection: "sessions",
});

app.set("trust proxy", 1);

// Static files for public assets
app.use(express.static(path.join(rootDir, "public")));
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  if (req.headers["content-type"]?.includes("multipart/form-data")) {
    return next(); // let multer handle it
  }
  express.json()(req, res, next);
});

// Session middleware
app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    store: store,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 1000 * 60 * 60 * 24 * 5,
    },
  }),
);

// Attach session info to req
app.use((req, res, next) => {
  req.isLoggedIn = req.session.isLoggedIn || false;
  req._id = req.session._id || null;
  next();
});

// API routes
app.use("/auth", authRouter);
app.use("/creator", creatorRouter);
app.use("/viewer", viewerRouter);

// Connect to MongoDB and start server
mongoose
  .connect(DB_path)
  .then(() => {
    app.listen(port, "0.0.0.0", () => {
      console.log(`Server Running at http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.log("error connecting to server", err);
  });
