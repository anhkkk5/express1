require("dotenv").config();
const express = require("express");
const flash = require("connect-flash");
const cookieParser = require("cookie-parser");
const session = require("express-session");

const methodOverride = require("method-override");
var bodyParser = require("body-parser");
const app = express();

const port = process.env.PORT;
app.use(methodOverride("_method"));
app.use(bodyParser.urlencoded({ extended: false }));
const systemConfig = require("./config/system");
const database = require("./config/database");

// cấu hình tinymce
var path = require("path");
app.use(
  "/tinymce",
  express.static(path.join(__dirname, "node_modules", "tinymce"))
);
// end cấu hình tinymce

//cấu hình pug
app.set("view engine", "pug");
app.set("views", `${__dirname}/views`);

//flash
app.use(cookieParser("your_secret_key"));
app.use(
  session({
    secret: "your_secret_key",
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 },
  })
);
app.use(flash());

//end flash
//App locals valueables
app.locals.prefixAdmin = systemConfig.prefixAdmin;

console.log(__dirname);
app.use(express.static(`${__dirname}/public`));

// Đảm bảo database được kết nối trước khi load routes
(async () => {
  try {
    await database.connect();
    console.log("Database connection established");

    // Load routes sau khi database đã kết nối
    const route = require("./routes/client/index.route");
    const routeAdmin = require("./routes/admin/index.route");

    //Routes
    route(app);
    routeAdmin(app);

    app.listen(port, () => {
      console.log(`Server đang chạy tại http://localhost:${port}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
})();
