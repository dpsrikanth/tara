var express = require("express"),
  app = express(),
  bodyParser = require("body-parser"),
  mongoose = require("mongoose"),
  flash = require("connect-flash"),
  passport = require("passport"),
  LocalStrategy = require("passport-local"),
  methodOverride = require("method-override"),
  { User } = require("./models/user"),
  expressSanitizer = require("express-sanitizer"),
  config = require("./config");
var equipmentRoutes = require("./routes/equipment");
var featuresRoutes = require("./routes/features");
var specificationsRoutes = require("./routes/specifications");
var imagesRoutes = require("./routes/images");
var datasheetsRoutes = require("./routes/datasheets");
var indexRoutes = require("./routes/index");
var usersRoutes = require("./routes/users");
var approvalRoutes = require("./routes/approvals")
var aboutRoutes = require("./routes/about")
var howtousetara = require("./routes/howtousetara")

var memsa = require("./routes/memsa")
var mandela = require("./routes/mandela")
var tech = require("./routes/tech")
var trl = require("./routes/trl")
var newsitem1 = require("./routes/news")

const contactRoutes = require("./routes/contact")
const newsletterRoutes = require("./routes/newsletter")
const favorites = require("./routes/favroite")
const moment = require("moment");
const {
  db: { host, port, name },
} = config;
const connectionString="mongodb://localhost:27017/admin?retryWrites=true&w=majority";
try {
  mongoose
    .connect(connectionString)
    .then(() => {
      console.log("Connected to DB!");
    })
    .catch((err) => {
      console.log("ERROR:", err.message);
    });
} catch (err) {
  console.log("ERROR:", err.message, "Set DATABASEURL environment variable");
}

mongoose.Promise = Promise;
app.use(bodyParser.urlencoded({ extended: true,limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); 
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(express.static(__dirname + "/assets"));
app.use(methodOverride("_method"));
app.use(flash());
app.use(expressSanitizer());
app.use((req, res, next)=>{
  res.locals.moment = moment;
  next();
});
// PASSPORT CONFIG
app.use(
  require("express-session")({
    secret: "The quick brown fox",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// THIS FUNCTION IS CALLED ON EVERY ROUT
app.use(function (req, res, next) {
  res.locals.currentUser = req.user;
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});


app.use("/", indexRoutes);
app.use("/equipment", equipmentRoutes);
app.use("/equipment/:id/features", featuresRoutes);
app.use("/equipment/:id/specifications", specificationsRoutes);
app.use("/equipment/:id/images", imagesRoutes);
app.use("/equipment/:id/datasheets", datasheetsRoutes);
app.use("/users", usersRoutes);
app.use("/approvals", approvalRoutes);
app.use("/contact", contactRoutes)
app.use("/favorite", favorites)
app.use('/newsletter', newsletterRoutes)
app.use('/about-us', aboutRoutes)
app.use('/howtousetara', howtousetara)

app.use('/memsa', memsa)
app.use('/tech', tech)
app.use('/trl', trl)
app.use('/mandela', mandela)

app.use("/news",newsitem1)

app.listen(config.app.port, config.app.host, function () {
  console.log(`Server is listening on port: ${config.app.port}`);
});
